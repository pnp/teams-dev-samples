// <copyright file="AddParticipantRequestData.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Data
{
    /// <summary>
    /// The add participant request body.
    /// </summary>
    public class AddParticipantRequestData
    {
        /// <summary>
        /// Gets or sets the object id.
        /// </summary>
        public string ObjectId { get; set; }

        /// <summary>
        /// Gets or sets the replaces call identifier.
        /// </summary>
        /// <value>
        /// The replaces call identifier.
        /// </value>
        public string ReplacesCallId { get; set; }
    }
}
