using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using msteams_tabs_sso_sample.Models;
using Newtonsoft.Json;

namespace msteams_tabs_sso_sample.Controllers
{
    [ApiController]
    public class ApiAuthController : ControllerBase
    {
        private IConfiguration Configuration;
        public ApiAuthController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [Route("auth/token")]
        [HttpPost]
        public async Task<string> token([FromBody] ServerTokenViewModel serverTokenViewModel)
        {
            var scopes = new string[] { "https://graph.microsoft.com/User.Read" };

            var url = $"https://login.microsoftonline.com/{serverTokenViewModel.tid}/oauth2/v2.0/token";

            var httpClient = new HttpClient();
            httpClient.DefaultRequestHeaders.Add("Accept", "application/json");

            var values = new Dictionary<string, string>
                {
                    { "client_id", Configuration["ClientId"] },
                    { "client_secret", Configuration["ClientPassword"]},
                    { "grant_type", "urn:ietf:params:oauth:grant-type:jwt-bearer"},
                    { "assertion", serverTokenViewModel.token},
                    { "requested_token_use", "on_behalf_of"},
                    { "scope", string.Join(' ', scopes)},
                };

            var formContent = new FormUrlEncodedContent(values);

            var response = await httpClient.PostAsync(url, formContent);

            var responseString = await response.Content.ReadAsStringAsync();

            dynamic responseJsonObject = JsonConvert.DeserializeObject(responseString);

            if (response.StatusCode == HttpStatusCode.OK)
            {
                return (string)responseJsonObject.access_token;
            }
            else
            {
                return (string)responseJsonObject.error;
            }
        }

    }
}