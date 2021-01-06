// <copyright file="EventViewModel.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    using System;

    /// <summary>
    /// Event view model
    /// </summary>
    public class EventViewModel
    {
        /// <summary>
        /// Gets or sets Subject
        /// </summary>
        public string Subject { get; set; }

        /// <summary>
        /// Gets or sets participants
        /// </summary>
        public string Participants { get; set; }

        /// <summary>
        /// Gets or sets Start date
        /// </summary>
        public DateTime StartDate { get; set; }

        /// <summary>
        /// Gets or sets End Date
        /// </summary>
        public DateTime EndDate { get; set; }
    }
}
