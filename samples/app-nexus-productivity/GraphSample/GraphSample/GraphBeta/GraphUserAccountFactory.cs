using System.Security.Claims;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication.Internal;
using Microsoft.Graph.Beta;
using Microsoft.Graph.Beta.Models.ODataErrors;

namespace GraphSampleBeta.Graph
{
    // Extends the AccountClaimsPrincipalFactory that builds
    // a user identity from the identity token.
    // This class adds additional claims to the user's ClaimPrincipal
    // that hold values from Microsoft Graph
    public class GraphUserAccountFactory
        : AccountClaimsPrincipalFactory<RemoteUserAccount>
    {
        private readonly IAccessTokenProviderAccessor accessor;
        private readonly ILogger<GraphUserAccountFactory> logger;

        private readonly GraphClientFactoryBeta clientFactory;

        public GraphUserAccountFactory(IAccessTokenProviderAccessor accessor,
            GraphClientFactoryBeta clientFactory,
            ILogger<GraphUserAccountFactory> logger)
        : base(accessor)
        {
            this.accessor = accessor;
            this.clientFactory = clientFactory;
            this.logger = logger;
        }

        public async override ValueTask<ClaimsPrincipal?> CreateUserAsync(
            RemoteUserAccount account,
            RemoteAuthenticationUserOptions options)
        {
            // Create the base user
            var initialUser = await base.CreateUserAsync(account, options);

            // If authenticated, we can call Microsoft Graph
            if (initialUser?.Identity?.IsAuthenticated ?? false)
            {
                try
                {
                    // Add additional info from Graph to the identity
                    await AddGraphInfoToClaims(accessor, initialUser);
                }
                catch (AccessTokenNotAvailableException exception)
                {
                    logger.LogError($"Graph API access token failure: {exception.Message}");
                }
            }

            return initialUser;
        }

        private async Task AddGraphInfoToClaims(
            IAccessTokenProviderAccessor accessor,
            ClaimsPrincipal claimsPrincipal)
        {
            var graphClient = clientFactory.GetAuthenticatedClient();

            // Get user profile including mailbox settings
            // GET /me?$select=displayName,mail,mailboxSettings,userPrincipalName
            var user = await graphClient.Me.GetAsync(config =>
            {
                // Request only the properties used to
                // set claims
                config.QueryParameters.Select = new [] { "displayName", "mail", "mailboxSettings", "userPrincipalName" };
            });

            if (user == null)
            {
                throw new Exception("Could not retrieve user from Microsoft Graph.");
            }

            logger.LogInformation($"Got user: {user.DisplayName}");

            claimsPrincipal.AddUserGraphInfo(user);

            // Get user's photo
            // GET /me/photos/48x48/$value
            try
            {
                var photo = await graphClient.Me
                .Photos["48x48"]  // Smallest standard size
                .Content
                .GetAsync();

                claimsPrincipal.AddUserGraphPhoto(photo);
            }
            catch (ODataError err)
            {
                Console.WriteLine($"Photo error: ${err?.Error?.Code}");
                if (err?.Error?.Code != "ImageNotFound")
                {
                    throw err ?? new Exception("Unknown error getting user photo.");
                }
            }
        }
    }
}
