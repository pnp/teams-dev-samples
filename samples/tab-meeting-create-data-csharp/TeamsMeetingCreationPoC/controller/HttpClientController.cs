using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace TeamsMeetingCreationPoC.controller
{
    internal class HttpClientController
    {
        private HttpClient httpClient;

        public HttpClientController(string accessToken)
        {
            HttpClient _httpClient = new HttpClient();
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);
            this.httpClient = _httpClient;
        }

        public async Task<string> GetOnlineMeeting(string user, string joinUrl)
        {
            Uri uri = new Uri($"https://graph.microsoft.com/v1.0/users/{user}/onlineMeetings?$filter=joinWebUrl eq '{joinUrl}'");

            Console.WriteLine($"Request: {uri}" );
            var httpGetResult = await httpClient.GetAsync(uri);
            string result = await httpGetResult.Content.ReadAsStringAsync();
            

            return result;
        }
    }
}
