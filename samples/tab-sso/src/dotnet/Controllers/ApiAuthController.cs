using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using System.Net.Http.Headers;
using Microsoft.Identity.Web;

namespace msteams_tabs_sso_sample.Controllers
{
    [Authorize]
    [ApiController]
    public class ApiAuthController : ControllerBase
    {
        private IConfiguration Configuration;
        private ITokenAcquisition _tokenAcquisition;
        public ApiAuthController(IConfiguration configuration, ITokenAcquisition tokenAcquisition)
        {
            Configuration = configuration;
            _tokenAcquisition = tokenAcquisition;
        }
       
        [Route("auth/token")]
        [HttpGet]
        public async Task<string> GetUserData()
        {
            string[] scopes = { Configuration["GraphAPI:Scope"] };
            try
            {
                string accessToken = await _tokenAcquisition.GetAccessTokenForUserAsync(scopes);

                GraphServiceClient graphServiceClient = GetGraphServiceClient(accessToken);

                // Retrieve the signed-in user's profile from Microsoft Graph.
                var user = await graphServiceClient.Me
                                .Request()
                                .GetAsync();
                
                return ($"DisplayName: { user.DisplayName},GivenName: {user.GivenName},Id: {user.Id},UserPrincipalName: {user.UserPrincipalName}");
            }
            catch (MicrosoftIdentityWebChallengeUserException msalEx)
            {
                return msalEx.MsalUiRequiredException.ErrorCode;
            }
            catch (Exception ex)
            {
                return ex.Message;
            }
        }

        /// <summary>
        /// Prepares the authenticated client.
        /// </summary>
        /// <param name="accessToken">The access token.</param>
        private GraphServiceClient GetGraphServiceClient(string accessToken)
        {
            string graphEndpoint = Configuration["GraphAPI:Endpoint"];
            try
            {
                GraphServiceClient graphServiceClient = new GraphServiceClient(graphEndpoint,
                                                                     new DelegateAuthenticationProvider(
                                                                         async (requestMessage) =>
                                                                         {
                                                                             await Task.Run(() =>
                                                                             {
                                                                                 requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);
                                                                             });
                                                                         }));
                return graphServiceClient;
            }
            catch (Exception ex)
            {
                return null;
            }
        }
    }
}