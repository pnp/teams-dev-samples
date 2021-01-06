// <copyright file="JoinCallRequestData.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Data
{
    /// <summary>
    /// The join call body.
    /// </summary>
    public class JoinCallRequestData
    {
        /// <summary>
        /// Gets or sets the join URL.
        /// </summary>
        public string JoinUrl { get; set; }

        /// <summary>
        /// Gets or sets the meeting identifier.
        /// </summary>
        public string VideoTeleconferenceId { get; set; }

        /// <summary>
        /// Gets or sets the tenant id.
        /// </summary>
        public string TenantId { get; set; }

        /// <summary>
        /// Gets or sets the scenario id.
        /// </summary>
        public string ScenarioId { get; set; }
    }
}
