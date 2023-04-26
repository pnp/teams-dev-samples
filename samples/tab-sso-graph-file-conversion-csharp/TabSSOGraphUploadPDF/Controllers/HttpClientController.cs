using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using TabSSOGraphFileConversion.Models;

namespace TabSSOGraphFileConversion.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HttpClientController : ControllerBase
    {
        private readonly string _accessToken;
        private HttpClient _httpClient;

        public HttpClientController(string accessToken)
        {
            _accessToken = accessToken;
            this._httpClient = new HttpClient();
            this._httpClient.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);
        }

        public async Task<HttpResponseMessage> GetConvertedFile(string userID, string itemID, string convertTo, ImageSize? size)
        {
            string url =$"https://graph.microsoft.com/beta/users/{userID}/Drive/Items/{itemID}/content?format={convertTo}";
            if (convertTo== "JPG" && size != null)
            {
                url += $"&width={size.Width}&height={size.Height}";
            }
            Uri uri = new Uri(url);
            try
            {
                // var httpResult = await this._httpClient.GetStreamAsync(uri);
                var httpResult = await this._httpClient.GetAsync(uri);
                // Stream result = await httpResult.Content.ReadAsStreamAsync();
                return httpResult;
            }
            catch (HttpRequestException ex)
            {
                Console.WriteLine(ex.Message);
            }
            return null;
        }
    }
}
