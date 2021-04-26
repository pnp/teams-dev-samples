// <copyright file="VirtualEvent.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    using System.Collections.Generic;
    using Newtonsoft.Json;

    /// <summary>
    /// Virtual event class.
    /// </summary>
    public class VirtualEvent
    {
        /// <summary>
        /// Gets or sets event id.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets created date
        /// </summary>
        public string CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets start date
        /// </summary>
        public string StartTime { get; set; }

        /// <summary>
        /// Gets or sets end date
        /// </summary>
        public string EndTime { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether event is active or not.
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Gets or sets join Web Url
        /// </summary>
        public string JoinWebUrl { get; set; }

        /// <summary>
        /// Gets or sets list of participants
        /// </summary>
        public List<Participant> ListOfParticipants { get; set; } = new List<Participant>();
    }
}
