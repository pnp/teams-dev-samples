// <copyright file="IncidentStatusData.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.IncidentStatus
{
    using System;
    using System.Collections.Generic;
    using Data;
    using Microsoft.Graph;
    using Newtonsoft.Json;

    /// <summary>
    /// The incident status.
    /// </summary>
    public enum IncidentStatus
    {
        /// <summary>
        /// Default value.
        /// </summary>
        Default
    }

    /// <summary>
    /// The incident status data.
    /// </summary>
    public class IncidentStatusData
    {
        private readonly Dictionary<string, IncidentResponderStatusData> responderStatusDictionary;

        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentStatusData"/> class.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <param name="data">The incident data.</param>
        public IncidentStatusData(string id, IncidentRequestData data)
            : this(id, data.Name, data.Time, data.ObjectIds)
        {
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentStatusData"/> class.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <param name="name">The incident name.</param>
        /// <param name="time">The time of incident.</param>
        /// <param name="objectIds">The responders' object IDs.</param>
        private IncidentStatusData(string id, string name, DateTime time, IEnumerable<string> objectIds)
        {
            DataCreationTime = DateTime.UtcNow;

            Id = id;
            Name = name;
            Time = time;

            responderStatusDictionary = new Dictionary<string, IncidentResponderStatusData>();

            foreach (var responderId in objectIds)
            {
                responderStatusDictionary.Add(responderId, new IncidentResponderStatusData(responderId));
            }
        }

        /// <summary>
        /// Gets the bot's meeting call id.
        /// </summary>
        public string BotMeetingCallId { get; private set; }

        /// <summary>
        /// Gets the bot's meeting scenario identifier.
        /// </summary>
        public Guid BotMeetingScenarioId { get; private set; }

        /// <summary>
        /// Gets the incident status.
        /// </summary>
        [JsonConverter(typeof(EnumConverter))]
        public IncidentStatus IncidentStatus { get; private set; }

        /// <summary>
        /// Gets the bot meeting status.
        /// </summary>
        [JsonConverter(typeof(EnumConverter))]
        public CallState? BotMeetingStatus { get; private set; }

        /// <summary>
        /// Gets the responder status.
        /// </summary>
        public IEnumerable<IncidentResponderStatusData> ResponderStatus => responderStatusDictionary.Values;

        /// <summary>
        /// Gets the incident id.
        /// </summary>
        public string Id { get; private set; }

        /// <summary>
        /// Gets the incident name.
        /// </summary>
        public string Name { get; private set; }

        /// <summary>
        /// Gets the incident time.
        /// </summary>
        public DateTime Time { get; private set; }

        /// <summary>
        /// Gets the incident data creation time.
        /// </summary>
        public DateTime DataCreationTime { get; private set; }

        /// <summary>
        /// Update the incident status.
        /// </summary>
        /// <param name="status">The incident status.</param>
        public void UpdateIncidentStatus(IncidentStatus status)
        {
            IncidentStatus = status;
        }

        /// <summary>
        /// Update the bot's meeting call id.
        /// </summary>
        /// <param name="callId">The call id.</param>
        /// <param name="scenarioId">The scenario identifier.</param>
        public void UpdateBotMeetingCallId(string callId, Guid scenarioId)
        {
            BotMeetingCallId = callId;
            BotMeetingScenarioId = scenarioId;
        }

        /// <summary>
        /// Update the bot meeting status.
        /// </summary>
        /// <param name="status">The meeting status.</param>
        public void UpdateBotMeetingStatus(CallState? status)
        {
            BotMeetingStatus = status;
        }

        /// <summary>
        /// Update the responder's notification call id.
        /// </summary>
        /// <param name="responderId">The responder id.</param>
        /// <param name="callId">The call id.</param>
        /// <param name="scenarioId">The scenario identifier.</param>
        public void UpdateResponderNotificationCallId(string responderId, string callId, Guid scenarioId)
        {
            responderStatusDictionary.TryGetValue(responderId, out IncidentResponderStatusData responderData);

            if (responderData != null)
            {
                responderData.NotificationCallId = callId;

                responderData.NotificationScenarioId = scenarioId;
            }
        }

        /// <summary>
        /// Update the responder's meeting call id.
        /// </summary>
        /// <param name="responderId">The responder id.</param>
        /// <param name="callId">The call id.</param>
        /// <param name="scenarioId">The scenario identifier.</param>
        public void UpdateResponderMeetingCallId(string responderId, string callId, Guid scenarioId)
        {
            responderStatusDictionary.TryGetValue(responderId, out IncidentResponderStatusData responderData);

            if (responderData != null)
            {
                responderData.MeetingCallId = callId;

                responderData.MeetingScenarioId = scenarioId;
            }
        }

        /// <summary>
        /// Update the responder's notification status.
        /// </summary>
        /// <param name="responderId">The responder id.</param>
        /// <param name="status">The notification status.</param>
        public void UpdateResponderNotificationStatus(string responderId, CallState? status)
        {
            responderStatusDictionary.TryGetValue(responderId, out IncidentResponderStatusData responderData);

            if (responderData != null)
            {
                responderData.NotificationStatus = status;
            }
        }

        /// <summary>
        /// Update the responder's meeting status.
        /// </summary>
        /// <param name="responderId">The responder id.</param>
        /// <param name="status">The meeting status.</param>
        public void UpdateResponderMeetingStatus(string responderId, IncidentResponderMeetingStatus status)
        {
            responderStatusDictionary.TryGetValue(responderId, out IncidentResponderStatusData responderData);

            if (responderData != null)
            {
                responderData.MeetingStatus = status;
            }
        }

        /// <summary>
        /// Get the responder's status.
        /// </summary>
        /// <param name="responderId">The responder id.</param>
        /// <returns>The responder status.</returns>
        public IncidentResponderStatusData GetResponder(string responderId)
        {
            responderStatusDictionary.TryGetValue(responderId, out IncidentResponderStatusData value);

            return value;
        }
    }
}
