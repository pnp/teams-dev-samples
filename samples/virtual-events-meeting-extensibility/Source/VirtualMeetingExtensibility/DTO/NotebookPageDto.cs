// <copyright file="NotebookPageDto.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.DTO
{
    /// <summary>
    /// Notebook page data transfer object.
    /// </summary>
public class NotebookPageDto
    {
        /// <summary>
        /// Gets or sets user notes from meeting side panel.
        /// </summary>
        public string PageContent { get; set; }

        /// <summary>
        /// Gets or sets meeting id or the chat id.
        /// </summary>
        public string ChatId { get; set; }
    }
}
