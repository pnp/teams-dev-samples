using Newtonsoft.Json;
using O365C.FuncApp.ProductCatalog.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace O365C.FuncApp.ProductCatalog.Services
{
    public interface IGraphService
    {
        Task<List<Product>> GetProductInfo(string productName);
                    
        
    }
    public class GraphService : IGraphService
    {

        private const string GraphBaseUrl = "https://graph.microsoft.com/v1.0";
        private readonly HttpClient _client;
        private readonly ITokenService _tokenService;
        private readonly AzureFunctionSettings _azureFunctionSettings;


        public GraphService(ITokenService tokenService, IHttpClientFactory httpClientFactory, AzureFunctionSettings azureFunctionSettings)
        {
            _tokenService = tokenService;
            _client = httpClientFactory.CreateClient();
            _azureFunctionSettings = azureFunctionSettings;

        }

        public async Task<List<Product>> GetProductInfo(string productName)
        {
            var products = new List<Product>();

            try
            {
                var accessToken = await _tokenService.GetAccessTokenAsync();
                if(accessToken == null)
                {
                    throw new Exception("Error getting access token");
                }
                string endpoint = $"{GraphBaseUrl}/users/{productName}";
                using (var request = new HttpRequestMessage(HttpMethod.Get, endpoint))
                {
                    //Headers
                    request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                                        
                    var response = await _client.SendAsync(request);

                    if (!response.IsSuccessStatusCode)
                    {
                        throw new Exception($"Error getting user info: {response.ReasonPhrase}");
                    }
                    var responseContent = await response.Content.ReadAsStringAsync();

                    // Parse the response
                    dynamic result = JsonConvert.DeserializeObject(responseContent);
                    
                    if(result != null)
                    {
                        //go through the result and create a list of products
                        foreach (var item in result)
                        {
                            products.Add(new Product
                            {
                                SKUID = item["body"]["SKUID"].ToString(),
                                Catalogue = item["body"]["Catalogue"].ToString(),
                                ProductName = item["body"]["ProductName"].ToString(),
                                ProductDescription = item["body"]["ProductDescription"].ToString(),
                                RevenueType = item["body"]["RevenueType"].ToString(),
                                PLPostingGroup = item["body"]["PLPostingGroup"].ToString(),
                                ServiceArea = item["body"]["ServiceArea"].ToString(),
                                ServiceAreaOwner = item["body"]["ServiceOwner"].ToString(),
                                ServiceGroup = item["body"]["ServiceGroup"].ToString()                                
                            });
                        }
                    }

                   
                }

                
            }
            catch (Exception ex)
            {
                throw new Exception($"Error getting product info: {ex.Message}");
            }
            return products;
        }   
    }
}
