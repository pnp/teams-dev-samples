// <copyright file="GraphHelper.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Helpers
{
    using System;
    using System.Threading.Tasks;
    using Calling.Interfaces;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;
    using Microsoft.Graph.Auth;
    using Microsoft.Identity.Client;

    /// <summary>
    /// Helper class for Graph.
    /// </summary>
    public class GraphHelper : IGraph
    {
        private readonly ILogger<GraphHelper> logger;
        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="GraphHelper"/> class.
        /// </summary>
        /// <param name="httpClientFactory">IHttpClientFactory instance.</param>
        /// <param name="logger">ILogger instance.</param>
        /// <param name="configuration">IConfiguration instance.</param>
        public GraphHelper(ILogger<GraphHelper> logger, IConfiguration configuration)
        {
            this.logger = logger;
            this.configuration = configuration;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="GraphHelper"/> class.
        /// </summary>
        /// <param name="configuration">IConfiguration instance.</param>
        public GraphHelper(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        /// <summary>
        /// GraphServiceClient.
        /// </summary>
        /// <returns>Graph Service Client.</returns>
        public GraphServiceClient GetGraphServiceClient()
        {
            try
            {
                return new GraphServiceClient(this.GetClientCredentialProvider());
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }

        /// <inheritdoc/>
        public async Task<OnlineMeeting> CreateOnlineMeeting()
        {
            try
            {
                var graphServiceClient = this.GetGraphServiceClient();

                var onlineMeeting = new OnlineMeeting
                {
                    StartDateTime = DateTime.UtcNow,
                    EndDateTime = DateTime.UtcNow.AddMinutes(30),
                    Subject = "ACS meeting",
                };

                var onlineMeetingResponse = await graphServiceClient.Users[this.configuration[Constants.UserIdConfigurationSettingsKey]].OnlineMeetings
                           .Request()
                           .AddAsync(onlineMeeting);
                return onlineMeetingResponse;
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, ex.Message);
                return null;
            }
        }

        /// <summary>
        /// Get Client Credential Provider.
        /// </summary>
        /// <returns>Client Credential Provider.</returns>
        private ClientCredentialProvider GetClientCredentialProvider()
        {
            try
            {
                IConfidentialClientApplication confidentialClientApplication = ConfidentialClientApplicationBuilder
                        .Create(this.configuration[Constants.ClientIdConfigurationSettingsKey])
                        .WithTenantId(this.configuration[Constants.TenantIdConfigurationSettingsKey])
                        .WithClientSecret(this.configuration[Constants.ClientSecretConfigurationSettingsKey])
                        .Build();

                return new ClientCredentialProvider(confidentialClientApplication);
            }
            catch (System.Exception ex)
            {
                throw ex;
            }
        }
    }
}
