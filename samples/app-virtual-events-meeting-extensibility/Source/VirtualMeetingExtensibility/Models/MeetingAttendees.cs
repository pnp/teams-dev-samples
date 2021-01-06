// <copyright file="MeetingAttendees.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    using System.Collections.Generic;

    /// <summary>
    /// Actual attendees
    /// </summary>
    public class MeetingAttendees
    {
        /// <summary>
        /// Gets or sets event id
        /// </summary>
        public string EventId { get; set; }

        /// <summary>
        /// Gets or sets call id
        /// </summary>
        public string CallId { get; set; }

        /// <summary>
        /// Gets or sets log time
        /// </summary>
        public string LogTime { get; set; }

        /// <summary>
        /// Gets or sets list of attendees
        /// </summary>
        public List<Attendee> ListOfAttendees { get; set; } = new List<Attendee>();
    }
}
