// <copyright file="UserTokenController.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling
{
    using System;
    using System.Threading.Tasks;
    using Azure;
    using Azure.Communication;
    using Azure.Communication.Identity;
    using Azure.Core;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;

    /// <summary>
    /// User Token Controller.
    /// </summary>
    public class UserTokenController : Controller
    {
        private readonly CommunicationIdentityClient client;

        /// <summary>
        /// Initializes a new instance of the <see cref="UserTokenController"/> class.
        /// </summary>
        /// <param name="configuration">IConfiguration instance.</param>
        public UserTokenController(IConfiguration configuration)
        {
            this.client = new CommunicationIdentityClient(configuration["ResourceConnectionString"]);
        }

        /// <summary>
        /// Gets a token to be used to initalize the call client.
        /// </summary>
        /// <returns>Token.</returns>
        [Route("/token")]
        [HttpGet]
        public async Task<IActionResult> GetAsync()
        {
            try
            {
                Response<(CommunicationUserIdentifier User, AccessToken Token)> response = await this.client.CreateUserWithTokenAsync(scopes: new[] { CommunicationTokenScope.VoIP });

                var responseValue = response.Value;

                var jsonFormattedUser = new
                {
                    communicationUserId = responseValue.User.Id,
                };

                var clientResponse = new
                {
                    user = jsonFormattedUser,
                    token = responseValue.Token.Token,
                    expiresOn = responseValue.Token.ExpiresOn,
                };

                return this.Ok(clientResponse);
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while Generating Token: {ex}");
                return this.Ok(this.Json(ex));
            }
        }

        /// <summary>
        /// Gets a token to be used to initalize the call client.
        /// </summary>
        /// <param name="identity">identity.</param>
        /// <returns>Token.</returns>
        [Route("/refreshToken/{identity}")]
        [HttpGet]
        public async Task<IActionResult> GetAsync(string identity)
        {
            try
            {
                CommunicationUserIdentifier identifier = new CommunicationUserIdentifier(identity);
                Response<AccessToken> response = await this.client.IssueTokenAsync(identifier, scopes: new[] { CommunicationTokenScope.VoIP });

                var responseValue = response.Value;
                var clientResponse = new
                {
                    token = responseValue.Token,
                    expiresOn = responseValue.ExpiresOn,
                };

                return this.Ok(clientResponse);
            }
            catch (RequestFailedException ex)
            {
                Console.WriteLine($"Error occured while Generating Token: {ex}");
                return this.Ok(this.Json(ex));
            }
        }
    }
}
