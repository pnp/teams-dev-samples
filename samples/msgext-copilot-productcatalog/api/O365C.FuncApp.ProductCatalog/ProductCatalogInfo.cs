using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using O365C.FuncApp.ProductCatalog.Services;
using System.Net;

namespace O365C.FuncApp.ProductCatalog
{
    public class ProductCatalogInfo
    {
        private readonly ILogger<ProductCatalogInfo> _logger;
        private readonly AzureFunctionSettings _azureFunctionSettings;
        private readonly ISharePointService _sharePointService;

        public ProductCatalogInfo(ILogger<ProductCatalogInfo> logger, AzureFunctionSettings azureFunctionSettings, ISharePointService sharePointService)
        {
            _logger = logger;
            _azureFunctionSettings = azureFunctionSettings;
            _sharePointService = sharePointService;
        }

        [Function("ProductCatalogInfo")]
        public async Task<IActionResult> RunAsync([HttpTrigger(AuthorizationLevel.Function, "post")] HttpRequest req)
        {
            _logger.LogInformation("C# HTTP trigger function processed a request.");
            

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();

            if (string.IsNullOrEmpty(requestBody))
            {
                return new BadRequestObjectResult("Please pass a valid request body");
            }

            try
            {
                RequestInfo data = JsonConvert.DeserializeObject<RequestInfo>(requestBody);
                if(data == null)
                {
                    return new BadRequestObjectResult("Invalid JSON in request body");
                }
                //User must pass at least one parameter
                if (string.IsNullOrEmpty(data.ProductName) && string.IsNullOrEmpty(data.ProductDescription) && string.IsNullOrEmpty(data.RevenueType) && string.IsNullOrEmpty(data.ServiceArea) && string.IsNullOrEmpty(data.ServiceAreaOwner))
                {
                    return new BadRequestObjectResult("Please pass at least one parameter");
                }                                               

                var products = await _sharePointService.GetProductInfo(data);
                return new OkObjectResult(products);
            }
            catch (JsonReaderException)
            {
                return new BadRequestObjectResult("Invalid JSON in request body");
            }
            catch (Exception ex)
            {
                // Log the exception here
                return new StatusCodeResult(StatusCodes.Status500InternalServerError);
            }
        }
    }
}
