// <copyright file="CustomerInformation.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Models
{
    using Newtonsoft.Json;

    /// <summary>
    /// Customer information model.
    /// </summary>
    public class CustomerInformation
    {
        /// <summary>
        /// Gets or sets cosmos document id.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets first name.
        /// </summary>
        [JsonProperty(PropertyName = "firstName")]
        public string FirstName { get; set; }

        /// <summary>
        /// Gets or sets last name.
        /// </summary>
        [JsonProperty(PropertyName = "lastName")]
        public string LastName { get; set; }

        /// <summary>
        /// Gets or sets mobile number.
        /// </summary>
        [JsonProperty(PropertyName = "mobileNumber")]
        public string MobileNumber { get; set; }

        /// <summary>
        /// Gets or sets email address.
        /// </summary>
        [JsonProperty(PropertyName = "emailAddress")]
        public string EmailAddress { get; set; }

        /// <summary>
        /// Gets or sets query.
        /// </summary>
        [JsonProperty(PropertyName = "query")]
        public string Query { get; set; }

        /// <summary>
        /// Gets or sets status.
        /// </summary>
        [JsonProperty(PropertyName = "status")]
        public string Status { get; set; }

        /// <summary>
        /// Gets or sets assigned to.
        /// </summary>
        [JsonProperty(PropertyName = "assignedTo")]
        public string AssignedTo { get; set; }

        /// <summary>
        /// Gets or sets teams conversation id.
        /// </summary>
        [JsonProperty(PropertyName = "teamsConversationId")]
        public string TeamsConversationId { get; set; }

        /// <summary>
        /// Gets or sets web conversation id.
        /// </summary>
        [JsonProperty(PropertyName = "webConversationId")]
        public string WebConversationId { get; set; }

        /// <summary>
        /// Gets or sets folder name.
        /// </summary>
        [JsonProperty(PropertyName = "folderName")]
        public string FolderName { get; set; }

        /// <summary>
        /// Gets or sets folder id.
        /// </summary>
        [JsonProperty(PropertyName = "folderId")]
        public string FolderId { get; set; }

        /// <summary>
        /// Gets or sets folder url.
        /// </summary>
        [JsonProperty(PropertyName = "folderUrl")]
        public string FolderUrl { get; set; }
    }
}
