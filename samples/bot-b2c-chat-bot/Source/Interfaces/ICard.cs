// <copyright file="ICard.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Interfaces
{
    using B2CChatBot.Models;
    using Microsoft.Bot.Schema;

    /// <summary>
    /// Interface for cards.
    /// </summary>
    public interface ICard
    {
        /// <summary>
        /// Creates a query attachment.
        /// </summary>
        /// <param name="customer">CustomerInformation instance.</param>
        /// <returns>new query attachment.</returns>
        Attachment CreateNewQueryAttachment(CustomerInformation customer);

        /// <summary>
        /// Help attachement.
        /// </summary>
        /// <returns>help attachment.</returns>
        Attachment HelpAttachment();

        /// <summary>
        /// Raise new request attachment.
        /// </summary>
        /// <returns>raise new request attachment.</returns>
        Attachment RaiseNewRequestAttachment();

        /// <summary>
        /// Update query status attachment.
        /// </summary>
        /// <param name="customer">CustomerInformation instance.</param>
        /// <returns>update query status attachment.</returns>
        Attachment UpdateQueryStatusAttachment(CustomerInformation customer);

        /// <summary>
        /// Teams channel meeting link attachment.
        /// </summary>
        /// <param name="customerInformation">CustomerInformation instance.</param>
        /// <param name="joinUrl">Meeting link.</param>
        /// <returns>teams channel meeting link attachment.</returns>
        Attachment TeamsChannelMeetingLinkAttachment(CustomerInformation customerInformation, string joinUrl);

        /// <summary>
        /// Web chat meeting lnk attachment.
        /// </summary>
        /// <param name="joinUrl">Meeting link.</param>
        /// <returns>web chat meeting lnk attachment.</returns>
        Attachment WebChatMeetingLinkAttachment(string joinUrl);
    }
}
