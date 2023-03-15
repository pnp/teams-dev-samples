using Azure.Core;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Identity.Web;
using System.Net;

namespace TabMGTPerson.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TokenController : ControllerBase
    {
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly ILogger<TokenController> _logger;

        public TokenController(ITokenAcquisition tokenAcquisition, ILogger<TokenController> logger)
        {
            _tokenAcquisition = tokenAcquisition;
            _logger = logger;
        }

        [HttpPost]
        public async Task<ActionResult<string>> Post()
        {
            // This verifies that the access_as_user scope is
            // present in the bearer token, throws if not
            //HttpContext.VerifyUserHasAnyAcceptedScope(apiScopes);

            // To verify that the identity libraries have authenticated
            // based on the token, log the user's name
            _logger.LogInformation($"Authenticated user: {User.GetDisplayName()}");

            try
            {
                // TEMPORARY
                // Get a Graph token via OBO flow
                var token = await _tokenAcquisition
                    .GetAccessTokenForUserAsync(new[]{
                        "User.Read", "User.ReadBasic.All", "People.Read" });

                // Log the token
                _logger.LogInformation($"Access token for Graph: {token}");
                var response = new { access_token = token };
                return new JsonResult(response);
            }
            catch (MicrosoftIdentityWebChallengeUserException ex)
            {
                _logger.LogError(ex, "Consent required");
                // This exception indicates consent is required.
                var response = new { error = "consent_required" };
                return new JsonResult(response)
                {
                    StatusCode = (int)HttpStatusCode.Forbidden                    
                }; 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred");
                throw;
            }
        }
    }
}
