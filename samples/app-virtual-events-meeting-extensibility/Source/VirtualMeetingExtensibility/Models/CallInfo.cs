// <copyright file="CallInfo.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Call information model
    /// </summary>
    public class CallInfo
    {
        /// <summary>
        /// Gets or sets call info id
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets call id
        /// </summary>
        public string CallId { get; set; }

        /// <summary>
        /// Gets or sets created date
        /// </summary>
        public string CreatedDate { get; set; }

        /// <summary>
        /// Gets or sets status value
        /// </summary>
        public int? Status { get; set; }

        /// <summary>
        /// Gets or sets event id
        /// </summary>
        public string EventId { get; set; }
    }
}
