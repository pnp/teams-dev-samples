using Microsoft.Graph;
using PDFConversion.Models;
using PDFConverstion.Helpers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;


namespace PDFConverstion.Services
{
    public class GraphService
    {
        private GraphServiceClient _graphServiceClient;
        public GraphService(GraphServiceClient graphServiceClient)
        {
            _graphServiceClient = graphServiceClient;

        }
        public async Task<string> GetUserDriveIdAsync()
        {
            try
            {
                var driveItem = await _graphServiceClient.Me.Drive.Request().GetAsync();
                var userDriveId = driveItem.Id;
                return userDriveId;
            }
            catch (ServiceException ex)
            {
                Console.WriteLine($"Error getting One Drive contents: {ex.Message}");
                return null;
            }
        }
        public async Task<DriveItem> UploadSmallFile(RequestDetail request, string userDriveId)
        {
            try
            {
                //Convert the base64 string into stream
                Stream fileStream = FilesHelper.ConvertBase64ToFileStream(request.Content);

                // upload the file to OneDrive            
                var result = await _graphServiceClient.Me.Drive.Root
                                              .ItemWithPath($"Uploads/{request.Name}")
                                              .Content
                                              .Request()
                                              .PutAsync<DriveItem>(fileStream);
                return result;
            }
            catch (ServiceException ex)
            {
                Console.WriteLine($"Error getting OneDrive data: {ex.Message}");
                return null;
            }

        }

        public async Task<DriveItem> UploadSmallFile(byte[] mergedPdfFile)
        {
            try
            {                
                Stream fileStream = new MemoryStream(mergedPdfFile);

                // upload the file to OneDrive            
                var result = await _graphServiceClient.Me.Drive.Root
                                              .ItemWithPath($"Uploads/DocumentPack.pdf")
                                              .Content
                                              .Request()
                                              .PutAsync<DriveItem>(fileStream);
                return result;
            }
            catch (ServiceException ex)
            {
                Console.WriteLine($"Error getting OneDrive data: {ex.Message}");
                return null;
            }

        }
                
        public async Task<User> GetCurrentUser()
        {
            var result = await _graphServiceClient.Me.Request().GetAsync();
            return result ?? null;
        }
        
        public async Task<byte[]> ConvertToPDF(string driveItemId, string userDriveId)
        {
            MemoryStream ms = new MemoryStream();
            try
            {


                List<QueryOption> options = new List<QueryOption>
                        {
                            new QueryOption("format", "pdf"),
                        };

                Stream pdfStream = await _graphServiceClient.Drives[userDriveId].Items[driveItemId]
                    .Content
                    .Request(options)
                    .GetAsync();
                pdfStream.CopyTo(ms);
               
            }
            catch (Exception ex)
            {

            }
            return ms.ToArray();

        }

        public async Task<bool> RemoveTempFile(string driveItemId, string userDriveId)
        {
            bool result = false;
            try
            {
                
                await _graphServiceClient.Drives[userDriveId].Items[driveItemId].Request().DeleteAsync();                    

            }
            catch (Exception ex)
            {
                
            }
            return result;

        }
                

    }
}
