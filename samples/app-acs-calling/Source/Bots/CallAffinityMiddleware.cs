// <copyright file="CallAffinityMiddleware.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Bots
{
    using System;
    using Calling.Helpers;
    using Microsoft.AspNetCore.Http;
    using Microsoft.Graph.Communications.Common.Telemetry;

    /// <summary>
    /// The call affinity helper class to help re-route calls to specific web instance.
    /// </summary>
    public class CallAffinityMiddleware
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="CallAffinityMiddleware"/> class.
        /// </summary>
        /// <param name="logger">The logger.</param>
        public CallAffinityMiddleware(IGraphLogger logger)
        {
            logger.CreateShim(nameof(CallAffinityMiddleware));
        }

        /// <summary>
        /// Get the web instance call back uri.
        /// </summary>
        /// <param name="baseUri">The base uri.</param>
        /// <returns>The uri with current web instance id as query string.</returns>
        public static Uri GetWebInstanceCallbackUri(Uri baseUri)
        {
            return SetQueryString(baseUri, new QueryString("?").Add(Constants.WebInstanceIdName, GetCurrentWebInstanceId()));
        }

        /// <summary>
        /// Get the current web instance id.
        /// </summary>
        /// <returns>The current web instance id.</returns>
        private static string GetCurrentWebInstanceId()
        {
            return Environment.GetEnvironmentVariable(Constants.EnvWebInstanceId) ?? Constants.Local;
        }

        /// <summary>
        /// Set the query string.
        /// </summary>
        /// <param name="uri">The base Uri.</param>
        /// <param name="queryString">The query string to add.</param>
        /// <returns>The new Uri with base Uri and query string.</returns>
        private static Uri SetQueryString(Uri uri, QueryString queryString)
        {
            var uriBuilder = new UriBuilder(uri)
            {
                Query = queryString.ToString().TrimStart('?'),
            };

            return uriBuilder.Uri;
        }
    }
}
