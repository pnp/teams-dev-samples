// <copyright file="IncidentCallContext.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Data
{
    /// <summary>
    /// The incident call type.
    /// </summary>
    public enum IncidentCallType
    {
        /// <summary>
        /// The call is a notification from the bot to a responder.
        /// </summary>
        ResponderNotification,

        /// <summary>
        /// The call is from the bot to the incident meeting.
        /// </summary>
        BotMeeting,

        /// <summary>
        /// The call is an incoming call to the bot.
        /// </summary>
        BotIncoming,

        /// <summary>
        /// The call is an incoming call to a bot endpoint.
        /// </summary>
        BotEndpointIncoming,
    }

    /// <summary>
    /// The call context class to pass data with ICall.Resource.AppContext for async calls.
    /// </summary>
    public class IncidentCallContext
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentCallContext"/> class.
        /// </summary>
        /// <param name="callType">The call type.</param>
        /// <param name="incidentId">The incident Id.</param>
        public IncidentCallContext(IncidentCallType callType, string incidentId)
        {
            CallType = callType;

            IncidentId = incidentId;
        }

        /// <summary>
        /// Gets the call type.
        /// </summary>
        public IncidentCallType CallType { get; }

        /// <summary>
        /// Gets the incident id.
        /// </summary>
        public string IncidentId { get; }
    }
}
