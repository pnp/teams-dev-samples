// <copyright file="NotificationSendStatus.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Models
{
    /// <summary>
    /// Notification status of Teams channel message.
    /// </summary>
    public class NotificationSendStatus
    {
        /// <summary>
        /// Gets or sets a value indicating whether successful or not.
        /// </summary>
        public bool IsSuccessful { get; set; }

        /// <summary>
        ///  Gets or sets failure message.
        /// </summary>
        public string FailureMessage { get; set; }

        /// <summary>
        ///  Gets or sets message id.
        /// </summary>
        public string MessageId { get; set; }
    }
}
