// <copyright file="HttpRouteConstants.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.IncidentBot
{
    /// <summary>
    /// HTTP route constants for routing requests to CallController methods.
    /// </summary>
    public static class HttpRouteConstants
    {
        /// <summary>
        /// Route for create room requests.
        /// </summary>
        public const string ApiControllerRoute = "api/[controller]";

        /// <summary>
        /// Route for create room requests.
        /// </summary>
        public const string CreateRoom = "CreateRoom";

        /// <summary>
        /// Route for access token requests.
        /// </summary>
        public const string Token = "/token";

        /// <summary>
        /// Route prefix for all incoming requests.
        /// </summary>
        public const string CallbackPrefix = "/callback";

        /// <summary>
        /// Route for incoming requests including notifications, callbacks and incoming call.
        /// </summary>
        public const string OnIncomingRequestRoute = CallbackPrefix + "/calling";

        /// <summary>
        /// The calls suffix.
        /// </summary>
        public const string CallsPrefix = "/calls";

        /// <summary>
        /// Route for getting Image for a call.
        /// </summary>
        public const string CallRoutePrefix = CallsPrefix + "/{callLegId}";
    }
}
