// <copyright file="ConversationResource.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Models
{
    using Microsoft.Bot.Schema;
    using Newtonsoft.Json;

    /// <summary>
    /// Conversation resource model.
    /// </summary>
    public class ConversationResource
    {
        /// <summary>
        /// Gets or sets cosmos document id.
        /// </summary>
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }

        /// <summary>
        /// Gets or sets web conversation id.
        /// </summary>
        [JsonProperty(PropertyName = "webConversationId")]
        public string WebConversationId { get; set; }

        /// <summary>
        /// Gets or sets teams conversation id.
        /// </summary>
        [JsonProperty(PropertyName = "teamsConversationId")]
        public string TeamsConversationId { get; set; }

        /// <summary>
        /// Gets or sets conversation reference.
        /// </summary>
        [JsonProperty(PropertyName = "conversationReference")]
        public ConversationReference ConversationReference { get; set; }
    }
}
