// <copyright file="IncidentResponderStatusData.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.IncidentBot.IncidentStatus
{
    using System;
    using Microsoft.Graph;
    using Newtonsoft.Json;

    /// <summary>
    /// The responder's meeting status.
    /// </summary>
    public enum IncidentResponderMeetingStatus
    {
        /// <summary>
        /// Default value
        /// </summary>
        Default,

        /// <summary>
        /// Added to the meeting
        /// </summary>
        Added,

        /// <summary>
        /// Removed from the meeting
        /// </summary>
        Removed,
    }

    /// <summary>
    /// The incident responder status data class.
    /// </summary>
    public class IncidentResponderStatusData
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentResponderStatusData"/> class.
        /// </summary>
        /// <param name="objectId">The responder's object id.</param>
        public IncidentResponderStatusData(string objectId)
        {
            this.ObjectId = objectId;
        }

        /// <summary>
        /// Gets the responder's object id.
        /// </summary>
        public string ObjectId { get; private set; }

        /// <summary>
        /// Gets or sets the notification status.
        /// </summary>
        [JsonConverter(typeof(EnumConverter))]
        public CallState? NotificationStatus { get; set; }

        /// <summary>
        /// Gets or sets the meeting status.
        /// </summary>
        [JsonConverter(typeof(EnumConverter))]
        public IncidentResponderMeetingStatus MeetingStatus { get; set; }

        /// <summary>
        /// Gets or sets the call id which called from bot.
        /// </summary>
        public string NotificationCallId { get; set; }

        /// <summary>
        /// Gets or sets the scenario identifier which called from bot.
        /// </summary>
        public Guid NotificationScenarioId { get; set; }

        /// <summary>
        /// Gets or sets the call id of the meeting leg to responder.
        /// </summary>
        public string MeetingCallId { get; set; }

        /// <summary>
        /// Gets or sets the scenario identifier of the meeting leg to responder.
        /// </summary>
        public Guid MeetingScenarioId { get; set; }
    }
}
