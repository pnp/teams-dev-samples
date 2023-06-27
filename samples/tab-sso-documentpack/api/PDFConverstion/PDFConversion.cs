using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.TeamsFx;
using Microsoft.Identity.Client;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Options;
using static System.Formats.Asn1.AsnWriter;
using Azure.Identity;
using Microsoft.Graph;
using PDFConverstion.Models;
using System.Net.Http;
using PDFConverstion.Services;
using System.Net;
using System.Text;
using System.Collections.Generic;
using PDFConversion.Models;
using Azure.Core;

namespace PDFConverstion
{
    public static class PDFConversion
    {

        [FunctionName("CreateDocumentPack")]
        public static async Task<HttpResponseMessage> Run(
            [HttpTrigger(AuthorizationLevel.Anonymous, "get", "post", Route = null)] HttpRequestMessage req,
            ILogger log, [TeamsFx(AllowedAppIds = "5e3ce6c0-2b1f-4285-8d4b-75ee78787346")] string TeamsFxContext)
        {

            try
            {
                log.LogInformation("Creating New Document Pack.......");
                // parse query parameter
                List<RequestDetail> requestDetail = await req.Content.ReadAsAsync<List<RequestDetail>>();
                if (requestDetail != null && requestDetail.Count > 0)
                {

                    log.LogInformation("Getting Single Sign-On access token.......");
                TokenResponse tokenResponse = JsonConvert.DeserializeObject<TokenResponse>(TeamsFxContext);
                if (string.IsNullOrEmpty(tokenResponse.AccessToken))
                {
                    throw new Exception("Unable to get Single Sign-On token.");
                }
                string tenantId = Environment.GetEnvironmentVariable("TenantId");
                string clientId = Environment.GetEnvironmentVariable("ClientId");
                string clientSecret = Environment.GetEnvironmentVariable("ClientSecret");
                string[] downstreamApiScopes = { "https://graph.microsoft.com/.default" };

                if (string.IsNullOrEmpty(tenantId) || string.IsNullOrEmpty(tenantId) || string.IsNullOrEmpty(tenantId))
                {
                    throw new Exception("Configuration values are missing.");
                }

                // using Azure.Identity;
                log.LogInformation("Create Microsoft graph client using OnBehalfOfCredential.......");                
                var options = new OnBehalfOfCredentialOptions
                {
                    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud
                };

                var onBehalfOfCredential = new OnBehalfOfCredential(tenantId, clientId, clientSecret, tokenResponse.AccessToken, options);
                var graphClient = new GraphServiceClient(onBehalfOfCredential, downstreamApiScopes);
                                    
                    var graphService = new GraphService(graphClient);
                    var fileService = new FileService();
                    var userDriveId = await graphService.GetUserDriveIdAsync();
                    foreach (var request in requestDetail)
                    {                       
                        var tempFile = await graphService.UploadSmallFile(request, userDriveId);
                        var fileBytes = await graphService.ConvertToPDF(tempFile.Id, userDriveId);
                        request.Bytes = fileBytes;
                        var isRemoved = await graphService.RemoveTempFile(tempFile.Id, userDriveId);
                    }
                    byte[] mergedPdfFile = fileService.Merge(requestDetail);

                    if (mergedPdfFile != null)
                    {
                        var documentPack = await graphService.UploadSmallFile(mergedPdfFile);                        
                        return new HttpResponseMessage(HttpStatusCode.OK)
                        {
                            Content = new StringContent(JsonConvert.SerializeObject(documentPack), Encoding.UTF8, "application/json")
                        };
                    }                    
                }
                return new HttpResponseMessage(HttpStatusCode.OK);

            }
            catch (Exception ex)
            {
                return new HttpResponseMessage(HttpStatusCode.ExpectationFailed)
                {
                    Content = new StringContent(JsonConvert.SerializeObject(ex), Encoding.UTF8, "application/json")
                };
            }
            





        }



    }
}
