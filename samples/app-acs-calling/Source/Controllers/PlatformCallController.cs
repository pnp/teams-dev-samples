// <copyright file="PlatformCallController.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.IncidentBot.Http
{
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Threading.Tasks;
    using Calling.Bots;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.WebApiCompatShim;
    using Microsoft.Graph.Communications.Client;
    using Microsoft.Graph.Communications.Common.Telemetry;

    /// <summary>
    /// Entry point for handling call-related web hook requests from the stateful client.
    /// </summary>
    public class PlatformCallController : Controller
    {
        private readonly IGraphLogger graphLogger;

        private readonly Bot bot;

        /// <summary>
        /// Initializes a new instance of the <see cref="PlatformCallController"/> class.
        /// </summary>
        /// <param name="bot">The bot.</param>
        public PlatformCallController(Bot bot)
        {
            this.graphLogger = bot.Client.GraphLogger.CreateShim(nameof(PlatformCallController));

            this.bot = bot;
        }

        /// <summary>
        /// Handle a callback for an existing call.
        /// </summary>
        /// <returns>
        /// The <see cref="HttpResponseMessage"/>.
        /// </returns>
        [HttpPost]
        [Route(HttpRouteConstants.OnIncomingRequestRoute)]
        public async Task<IActionResult> OnIncomingRequestAsync()
        {
            var requestMessage = this.Request.HttpContext.GetHttpRequestMessage();

            var requestUri = requestMessage.RequestUri;

            // Process the incoming request for current web instance.
            this.bot.AddCallbackLog($"Process incoming request {requestUri}");

            var token = requestMessage?.Headers?.Authorization?.Parameter;

            this.bot.AddCallbackLog($"Token: {token ?? "null"}");

            this.graphLogger.Info($"Received HTTP {this.Request.Method}, {requestUri}");

            // Pass the incoming message to the sdk. The sdk takes care of what to do with it.
            var response = await this.bot.Client.ProcessNotificationAsync(requestMessage).ConfigureAwait(false);

            // Convert the status code, content of HttpResponseMessage to IActionResult,
            // and copy the headers from response to HttpContext.Response.Headers.
            return await this.GetActionResultAsync(response).ConfigureAwait(false);
        }

        /// <summary>
        /// Get the callback logs.
        /// </summary>
        /// <param name="maxCount">The maximum count of log lines.</param>
        /// <returns>The logs.</returns>
        [HttpGet]
        [Route("log/callback")]
        public async Task<IEnumerable<string>> GetCallbackLogsAsync(int maxCount = 1000)
        {
            return await Task.FromResult(this.bot.GetCallbackLogs(maxCount)).ConfigureAwait(false);
        }
    }
}