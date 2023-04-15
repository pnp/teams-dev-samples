using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Extensions.Logging;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using System.IO;
using System.IO.Pipes;
using System.Net;
using TabSSOGraphFileConversion.Models;

namespace TabSSOGraphFileConversion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UploadController : ControllerBase
    {
        private readonly GraphServiceClient _graphClient;
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly ILogger<UploadController> _logger;
        public UploadController(ITokenAcquisition tokenAcquisition, GraphServiceClient graphClient, ILogger<UploadController> logger)
        {
            _tokenAcquisition = tokenAcquisition;
            _graphClient = graphClient;
            _logger = logger;
        }
        // api/<controller>/GetMimeMessage
        [HttpPost]
        [DisableRequestSizeLimit]
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        public async Task<ActionResult<string>> Post([FromForm] UploadRequest fileUpload)
        {
            string accessToken = await GetAccessToken();

            string fileName = fileUpload.Name;
            string siteUrl = fileUpload.SiteUrl;
            string convertTo = fileUpload.TargetType;
            _logger.LogInformation($"Received file {fileUpload.file.FileName} with size in bytes {fileUpload.file.Length}");
            string userID = User.GetObjectId(); //   Claims["preferred_username"];
            DriveItem uploadResult = await uploadTempFile(userID, fileUpload);
            Stream convertedFile = await GetConvertedFile(userID, uploadResult.Id, convertTo);
            string convertedFileUrl = await UploadConvertedFile(userID, fileUpload.file.FileName, convertedFile, siteUrl, convertTo);
            DeleteTempFile(userID, uploadResult.Id);
            return Ok(convertedFileUrl);
        }

        private async Task<string> GetAccessToken()
        {
            _logger.LogInformation($"Authenticated user: {User.GetDisplayName()}");

            try
            {
                // TEMPORARY
                // Get a Graph token via OBO flow
                var token = await _tokenAcquisition
                    .GetAccessTokenForUserAsync(new[]{
                        "Files.ReadWrite", "Sites.ReadWrite.All" });

                // Log the token
                _logger.LogInformation($"Access token for Graph: {token}");
                return token;
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                _logger.LogError(ex, "Consent required");
                // This exception indicates consent is required.
                // Return a 403 with "consent_required" in the body
                // to signal to the tab it needs to prompt for consent
                return "";
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred");
                return "";
            }
        }

        private async Task<DriveItem> uploadTempFile(string userID, UploadRequest fileUpload)
        {
            DriveItem uploadResult;
            if (fileUpload.file.Length < (4 * 1024 * 1024))
            {
                uploadResult = await this._graphClient.Users[userID]
                                                    .Drive.Root
                                                    .ItemWithPath(fileUpload.file.FileName)
                                                    .Content.Request()
                                                    .PutAsync<DriveItem>(fileUpload.file.OpenReadStream());
            }
            else
            {
                Drive drive = await this._graphClient.Users[userID].Drive.Request().Select("id").GetAsync();
                uploadResult = await this.UploadLargeFile(drive.Id, fileUpload.file.FileName, fileUpload.file.OpenReadStream());
            }
            return uploadResult;
        }
        private async Task<Stream> GetConvertedFile(string userID, string itemID, string convertTo)
        {
            string accessToken = await this.GetAccessToken();
            HttpClientController httpClient = new HttpClientController(accessToken);
            Stream pdfResult;
            if (convertTo.ToUpper() == "JPG") 
            {
                ImageSize size = await GetImageSize(userID, itemID);
                HttpResponseMessage httpResponse = await httpClient.GetConvertedFile(userID, itemID, convertTo, size);
                pdfResult = await httpResponse.Content.ReadAsStreamAsync();
                
            }
            else
            {
                HttpResponseMessage httpResponse = await httpClient.GetConvertedFile(userID, itemID, convertTo, null);
                pdfResult = await httpResponse.Content.ReadAsStreamAsync();
                
            }            
            return pdfResult;
        }

        private async Task<string> UploadConvertedFile(string userID, string orgFileName, Stream fileStream, string siteUrl, string convertTo)
        {
            string convertedFileName = Path.GetFileNameWithoutExtension(orgFileName);
            convertedFileName += $".{convertTo.ToLower()}";
            string siteId = await EvaluateSiteID(siteUrl); 
            DriveItem uploadResult;
            if (fileStream.Length < (4 * 1024 * 1024))
            {
                uploadResult = await this._graphClient.Sites[siteId]
                                                    .Drive.Root
                                                    .ItemWithPath(convertedFileName)
                                                    .Content.Request()
                                                    .PutAsync<DriveItem>(fileStream);
            }
            else
            {
                Drive drive = await this._graphClient.Sites[siteId]
                                                    .Drive
                                                    .Request()
                                                    .Select("id")
                                                    .GetAsync();
                uploadResult = await this.UploadLargeFile(drive.Id, convertedFileName, fileStream);                
            }
                
            return uploadResult.WebUrl; 
        }

        private void DeleteTempFile(string userID, string itemID)
        {
            this._graphClient.Users[userID]
                        .Drive.Items[itemID]
                        .Request()
                        .DeleteAsync();
        }

        private async Task<DriveItem> UploadLargeFile(string driveID, string fileName, Stream fileStream)
        {
            var uploadProps = new DriveItemUploadableProperties
            {
                AdditionalData = new Dictionary<string, object>
                {
                    { "@microsoft.graph.conflictBehavior", "replace" }
                }
            };

            // Create the upload session
            var uploadSession = await this._graphClient.Drives[driveID].Root
                .ItemWithPath(fileName)
                .CreateUploadSession(uploadProps)
                .Request()
                .PostAsync();

            // Max slice size must be a multiple of 320 KiB
            int maxSliceSize = 320 * 1024;
            var fileUploadTask =
                new LargeFileUploadTask<DriveItem>(uploadSession, fileStream, maxSliceSize);

            var totalLength = fileStream.Length;
            // Create a callback that is invoked after each slice is uploaded
            IProgress<long> progress = new Progress<long>(prog => {
                _logger.LogInformation($"Uploaded {prog} bytes of {totalLength} bytes");
            });

            try
            {
                // Upload the file
                var uploadResult = await fileUploadTask.UploadAsync(progress);

                Console.WriteLine(uploadResult.UploadSucceeded ?
                    $"Upload complete, item ID: {uploadResult.ItemResponse.Id}" :
                    "Upload failed");
                return uploadResult.ItemResponse;
            }
            catch (ServiceException ex)
            {
                Console.WriteLine($"Error uploading: {ex.ToString()}");
                return null;
            }
        }
        private async Task<string> EvaluateSiteID(string siteUrl)
        {
            Uri siteUri = new Uri(siteUrl);
            Site site = await this._graphClient.Sites.GetByPath(siteUri.PathAndQuery, siteUri.Host).Request().GetAsync();
            return site.Id;
        }

        private async Task<ImageSize> GetImageSize(string userID, string itemID)
        {
            DriveItem image = await this._graphClient.Users[userID]
                                        .Drive.Items[itemID]
                                        .Request()
                                        .Select("image")
                                        .GetAsync();
            if (image.Image != null)
            {
                _logger.LogInformation("Width: " + image.Image.Width);
                _logger.LogInformation("Height: " + image.Image.Height);
                int width = image.Image.Width != null ? (int)(image.Image.Width) : 999;
                int height = image.Image.Height != null ? (int)(image.Image.Height) : 999;
                return new ImageSize(width, height);
            }

            return new ImageSize(0,0);      
        }
    }
}
