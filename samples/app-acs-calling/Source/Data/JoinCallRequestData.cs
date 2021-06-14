// <copyright file="JoinCallRequestData.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Data
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
