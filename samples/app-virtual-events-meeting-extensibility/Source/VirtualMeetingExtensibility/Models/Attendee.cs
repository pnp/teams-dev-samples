// <copyright file="Attendee.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    /// <summary>
    /// Attendee model
    /// </summary>
    public class Attendee
    {
        /// <summary>
        /// Gets or sets attendee ad id
        /// </summary>
        public string AadId { get; set; }

        /// <summary>
        /// Gets or sets display name
        /// </summary>
        public string DisplayName { get; set; }
    }
}
