// <copyright file="HttpRouteConstants.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility
{
    /// <summary>
    /// HTTP route constants for routing requests to CallController methods.
    /// </summary>
    public static class HttpRouteConstants
    {
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