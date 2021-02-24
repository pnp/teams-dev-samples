// <copyright file="Constants.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Helpers
{
    /// <summary>
    /// Class for constants.
    /// </summary>
    public class Constants
    {
        /// <summary>
        /// Schedule meeting constant.
        /// </summary>
        public const string ScheduleMeeting = "schedulemeeting";

        /// <summary>
        /// Help constant.
        /// </summary>
        public const string Help = "help";

        /// <summary>
        /// Raise new request constant.
        /// </summary>
        public const string RaiseNewRequest = "raisenewrequest";

        /// <summary>
        /// End conversation constant.
        /// </summary>
        public const string EndConversation = "endconversation";

        /// <summary>
        /// Submit new request constant.
        /// </summary>
        public const string SubmitNewRequest = "submitnewrequest";

        /// <summary>
        /// Assign constant.
        /// </summary>
        public const string Assign = "assign";

        /// <summary>
        /// Assigned constant.
        /// </summary>
        public const string Assigned = "Assigned";

        /// <summary>
        /// Unassigned constant.
        /// </summary>
        public const string Unassigned = "Unassigned";

        /// <summary>
        /// Update assignment status to user constant.
        /// </summary>
        public const string UpdateAssignmentStatusToUser = "Request has been assigned.";

        /// <summary>
        /// Conversation end message , which will be sent to Teams channel.
        /// </summary>
        public const string ConversationEndTeamsMessageText = "This conversation has been ended.";

        /// <summary>
        /// Conversation end message , which will be sent to web chat.
        /// </summary>
        public const string ConversationEndWebChatMessageText = "Thank you for using the Web chat B2C bot, current conversation has been ended. Please raise a new request for any further queries.";

        /// <summary>
        /// Help Message Text.
        /// </summary>
        public const string HelpMessageText = "Please create a request using HELP command";

        /// <summary>
        /// Attachments Help Message Text.
        /// </summary>
        public const string AttachmentsHelpMessageText = "Please create a request using HELP command before attaching any documents";

        /// <summary>
        /// Microsoft app id.
        /// </summary>
        public const string MicrosoftAppIdConfigurationSettingsKey = "MicrosoftAppId";

        /// <summary>
        /// Microsoft app password.
        /// </summary>
        public const string MicrosoftAppPasswordConfigurationSettingsKey = "MicrosoftAppPassword";
    }
}
