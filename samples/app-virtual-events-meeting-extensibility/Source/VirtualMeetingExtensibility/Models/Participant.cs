// <copyright file="Participant.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    /// <summary>
    /// Participant model
    /// </summary>
    public class Participant
    {
        /// <summary>
        /// Gets or sets name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Gets or sets email 
        /// </summary>
        public string EmailId { get; set; }

        /// <summary>
        /// Gets or sets attendee AAD id
        /// </summary>
        public string AadId { get; set; }

        /// <summary>
        /// Gets or sets type of participant
        /// </summary>
        public string Type { get; set; }
    }
}
