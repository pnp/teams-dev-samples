using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using System.IO;
using System.Net;
using TabSSOGraphUploadPDF.Models;

namespace TabSSOGraphUploadPDF.Controllers
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
        [DisableRequestSizeLimit] //<======= add this line
        [RequestFormLimits(ValueLengthLimit = int.MaxValue, MultipartBodyLengthLimit = int.MaxValue)]
        public async Task<ActionResult<string>> Post([FromForm] UploadRequest fileUpload)
        {            
            _logger.LogInformation($"Received file {fileUpload.file.FileName} with size in bytes {fileUpload.file.Length}");
            string userID = User.GetObjectId(); //   Claims["preferred_username"];
            DriveItem uploadResult = await this._graphClient.Users[userID]
                                                    .Drive.Root
                                                    .ItemWithPath(fileUpload.file.FileName)
                                                    .Content.Request()
                                                    .PutAsync<DriveItem>(fileUpload.file.OpenReadStream());

            Stream pdfFile = await GetPDF(userID, uploadResult.Id);
            string pdfFileUrl = await UploadPDF(userID, fileUpload.file.FileName, pdfFile, fileUpload.SiteUrl);
            DeleteTempFile(userID, uploadResult.Id);
            return Ok(pdfFileUrl);
            //return Ok(uploadResult.WebUrl);
        }

        private async Task<Stream> GetPDF(string userID, string itemID)
        {
            var queryOptions = new List<QueryOption>()
            {
                new QueryOption("format", "PDF")
            };
            Stream pdfResult = await this._graphClient.Users[userID]
                                                    .Drive.Items[itemID]
                                                    .Content
                                                    .Request(queryOptions)
                                                    .GetAsync();
            return pdfResult;
        }

        private async Task<string> UploadPDF(string userID, string orgFileName, Stream fileStream, string siteUrl)
        {
            string pdfFileName = Path.GetFileNameWithoutExtension(orgFileName);
            pdfFileName += ".pdf";
            string siteId = await EvaluateSiteID(siteUrl);
            DriveItem uploadResult = await this._graphClient.Sites[siteId]
                                                    .Drive.Root
                                                    .ItemWithPath(pdfFileName)
                                                    .Content.Request()
                                                    .PutAsync<DriveItem>(fileStream);
            return uploadResult.WebUrl;
        }

        private async Task DeleteTempFile(string userID, string itemID)
        {
            await this._graphClient.Users[userID]
                        .Drive.Items[itemID]
                        .Request()
                        .DeleteAsync();
        }

        private async Task<string> EvaluateSiteID(string siteUrl)
        {
            Uri siteUri = new Uri(siteUrl);
            Site site = await this._graphClient.Sites.GetByPath(siteUri.PathAndQuery, siteUri.Host).Request().GetAsync();
            return site.Id;
        }
    }
}
