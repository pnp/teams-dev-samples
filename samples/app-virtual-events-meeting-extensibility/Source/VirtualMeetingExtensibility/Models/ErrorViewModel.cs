// <copyright file="ErrorViewModel.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Models
{
    /// <summary>
    /// Error view model
    /// </summary>
    public class ErrorViewModel
    {
        /// <summary>
        /// Gets or sets request id
        /// </summary>
        public string RequestId { get; set; }

        /// <summary>
        /// Show request id
        /// </summary>
        public bool ShowRequestId => !string.IsNullOrEmpty(RequestId);
    }
}