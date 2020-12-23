// <copyright file="OnlineMeetingHelper.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace Sample.Common.OnlineMeetings
{
    using System;
    using System.Threading.Tasks;
    using Microsoft.Graph;
    using Microsoft.Graph.Communications.Client.Authentication;
    using Microsoft.Graph.Communications.Common;

    /// <summary>
    /// Online meeting class to fetch meeting info based of meeting id (ex: vtckey).
    /// </summary>
    public class OnlineMeetingHelper
    {
        private readonly Uri graphEndpointUri;
        private readonly IRequestAuthenticationProvider requestAuthenticationProvider;

        /// <summary>
        /// Initializes a new instance of the <see cref="OnlineMeetingHelper"/> class.
        /// </summary>
        /// <param name="requestAuthenticationProvider">The request authentication provider.</param>
        /// <param name="graphUri">The graph url.</param>
        public OnlineMeetingHelper(IRequestAuthenticationProvider requestAuthenticationProvider, Uri graphUri)
        {
            this.requestAuthenticationProvider = requestAuthenticationProvider;
            this.graphEndpointUri = graphUri;
        }

        /// <summary>
        /// Gets the online meeting.
        /// </summary>
        /// <param name="tenantId">The tenant identifier.</param>
        /// <param name="meetingId">The meeting identifier.</param>
        /// <param name="scenarioId">The scenario identifier.</param>
        /// <returns>The online meeting. </returns>
        public async Task<OnlineMeeting> GetOnlineMeetingAsync(string tenantId, string meetingId, Guid scenarioId)
        {
            IAuthenticationProvider GetAuthenticationProvider()
            {
                return new DelegateAuthenticationProvider(async request =>
                {
                    request.Headers.Add(HttpConstants.HeaderNames.ScenarioId, scenarioId.ToString());
                    request.Headers.Add(HttpConstants.HeaderNames.ClientRequestId, Guid.NewGuid().ToString());

                    await this.requestAuthenticationProvider
                        .AuthenticateOutboundRequestAsync(request, tenantId)
                        .ConfigureAwait(false);
                });
            }

            var statelessClient = new GraphServiceClient(this.graphEndpointUri.AbsoluteUri, GetAuthenticationProvider());
            var meetingRequest = statelessClient.Communications.OnlineMeetings[meetingId].Request();

            var meeting = await meetingRequest.GetAsync().ConfigureAwait(false);

            return meeting;
        }
    }
}