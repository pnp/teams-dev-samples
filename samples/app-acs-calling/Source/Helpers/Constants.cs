// <copyright file="Constants.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Helpers
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
        public const string RequestACall = "requestacall";

        /// <summary>
        /// End conversation constant.
        /// </summary>
        public const string PlaceACall = "placeacall";

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
        /// Conversation end message , which will be sent to Teams channel.
        /// </summary>
        public const string RequestHasBeenSubmitted = "Request has been submitted. Please wait untill you get a meeting link, click on it to join the meeting.";

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

        /// <summary>
        /// Teams Service Url.
        /// </summary>
        public const string TeamsServiceUrlConfigurationSettingsKey = "TeamsServiceUrl";

        /// <summary>
        /// Channel Id.
        /// </summary>
        public const string ChannelIdConfigurationSettingsKey = "ChannelId";

        /// <summary>
        /// Accept.
        /// </summary>
        public const string Accept = "Accept";

        /// <summary>
        /// Reject.
        /// </summary>
        public const string Reject = "Reject";

        /// <summary>
        /// Join.
        /// </summary>
        public const string Join = "Join";

        /// <summary>
        /// Reassign.
        /// </summary>
        public const string Reassign = "Reassign";

        /// <summary>
        /// Base Url.
        /// </summary>
        public const string BaseUrl = "BaseUrl";

        /// <summary>
        /// Azure Client Id.
        /// </summary>
        public const string ClientIdConfigurationSettingsKey = "AzureAd:ClientId";

        /// <summary>
        /// Azure Tenant Id.
        /// </summary>
        public const string TenantIdConfigurationSettingsKey = "AzureAd:TenantId";

        /// <summary>
        /// Azure ClientSecret .
        /// </summary>
        public const string ClientSecretConfigurationSettingsKey = "AzureAd:ClientSecret";

        /// <summary>
        /// Azure Url .
        /// </summary>
        public const string AzureInstanceConfigurationSettingsKey = "AzureAd:Instance";

        /// <summary>
        /// get the user id key.
        /// </summary>
        public const string UserIdConfigurationSettingsKey = "UserId";

        /// <summary>
        /// get the user id key.
        /// </summary>
        public const string UserIdsConfigurationSettingsKey = "UserIds";

        /// <summary>
        /// get the group read all scope.
        /// </summary>
        public const string RoomDataCreateOrUpdateSucessful = "Room data create or update successful.";

        /// <summary>
        /// get the bearer.
        /// </summary>
        public const string Schema = "Bearer";

        /// <summary>
        /// get the tenant replace string.
        /// </summary>
        public const string TenantReplaceString = "{tenant}";

        /// <summary>
        /// get the tenant id replace string.
        /// </summary>
        public const string TenantIdReplaceString = "TENANT_ID";

        /// <summary>
        /// get the No audience defined in token.
        /// </summary>
        public const string NoAudienceDefinedInToken = "No audience defined in token!";

        /// <summary>
        /// get the No valid audiences defined in validationParameters.
        /// </summary>
        public const string NoValidAudiencesDefinedInValidationParameters = "No valid audiences defined in validationParameters!";

        /// <summary>
        /// get the graph default scope.
        /// </summary>
        public const string GraphDefaultScope = "https://graph.microsoft.com/.default";

        /// <summary>
        /// get the Graph Web Client.
        /// </summary>
        public const string GraphWebClient = "GraphWebClient";

        /// <summary>
        /// get the valid issuers configuration settings exception.
        /// </summary>
        public const string ValidIssuersConfigurationSettingsException = " does not contain a valid value in the configuration file.";

        /// <summary>
        /// get the application/json.
        /// </summary>
        public const string ApplicationJsonMediaTypeHeader = "application/json";

        /// <summary>
        /// get the application/x-www-form-urlencoded.
        /// </summary>
        public const string ApplicationXWwwFormUrlencodedMediaTypeHeader = "application/x-www-form-urlencoded";

        /// <summary>
        /// get the OAuth v2 token link.
        /// </summary>
        public const string OAuthV2TokenLink = "https://login.microsoftonline.com/{tenant}";

        /// <summary>
        /// get the graph resource.
        /// </summary>
        public const string GraphResource = "https://graph.microsoft.com";

        /// <summary>
        /// get the common.
        /// </summary>
        public const string Common = "common";

        /// <summary>
        /// get the generating OAuth Token.
        /// </summary>
        public const string GeneratingOAuthToken = "AuthenticationProvider: Generating OAuth token.";

        /// <summary>
        /// get the failed to generate token for client.
        /// </summary>
        public const string FailedToGenerateTokenForClient = "Failed to generate token for client:";

        /// <summary>
        /// get the failed to generate token for client.
        /// </summary>
        public const string FailedToValidateTokenForClient = "Failed to validate token for client:";

        /// <summary>
        /// get the generated OAuth token. Expires in.
        /// </summary>
        public const string GeneratedOAuthTokenExpiresIn = "AuthenticationProvider: Generated OAuth token. Expires in";

        /// <summary>
        /// get the minutes.
        /// </summary>
        public const string Minutes = "minutes";

        /// <summary>
        /// get the authDomain.
        /// </summary>
        public const string AuthDomain = "https://api.aps.skype.com/v1/.well-known/OpenIdConfiguration";

        /// <summary>
        /// get the updating OpenID configuration.
        /// </summary>
        public const string UpdatingOpenIDConfiguration = "Updating OpenID configuration";

        /// <summary>
        /// get the graph Issuer.
        /// </summary>
        public const string GraphIssuer = "https://graph.microsoft.com";

        /// <summary>
        /// get the bot framework issuer.
        /// </summary>
        public const string BotFrameworkIssuer = "https://api.botframework.com";

        /// <summary>
        /// The name of web instance ID in query string.
        /// </summary>
        public const string WebInstanceIdName = "webInstanceId";

        /// <summary>
        /// get the environment web instance Id.
        /// </summary>
        public const string EnvWebInstanceId = "WEBSITE_INSTANCE_ID";

        /// <summary>
        /// get the local.
        /// </summary>
        public const string Local = "local";

        /// <summary>
        /// get the Authorization.
        /// </summary>
        public const string Authorization = "Authorization";

        /// <summary>
        /// get the upn.
        /// </summary>
        public const string UpnKey = "upn";

        /// <summary>
        /// get the oid.
        /// </summary>
        public const string OidKey = "oid";

        /// <summary>
        /// Azure Application Id URI.
        /// </summary>
        public const string ApplicationIdURIConfigurationSettingsKey = "AzureAd:ApplicationIdURI";

        /// <summary>
        /// Azure Valid Issuers.
        /// </summary>
        public const string ValidIssuersConfigurationSettingsKey = "AzureAd:ValidIssuers";

        /// <summary>
        /// Azure Authorization Url .
        /// </summary>
        public const string AzureAuthUtrlConfigurationSettingsKey = "AzureAd:AuthUrl";

        /// <summary>
        /// get the meeting url regex.
        /// </summary>
        public const string MeetingUrlRegex = "https://teams\\.microsoft\\.com.*/(?<thread>[^/]+)/(?<message>[^/]+)\\?context=(?<context>{.*})";

        /// <summary>
        /// Join URL cannot be parsed.
        /// </summary>
        public const string JoinURLCannotBeParsedException = "Join URL cannot be parsed:";

        /// <summary>
        /// get the context.
        /// </summary>
        public const string Context = "context";

        /// <summary>
        /// get the thread.
        /// </summary>
        public const string Thread = "thread";

        /// <summary>
        /// get the message.
        /// </summary>
        public const string Message = "message";

        /// <summary>
        /// get the Storage account connection string.
        /// </summary>
        public const string StorageAccountConnectionStringConfigurationSettingsKey = "StorageAccountConnectionString";

        /// <summary>
        /// get the Azure Ad key.
        /// </summary>
        public const string AzureAdConfigurationSettingsKey = "AzureAd";

        /// <summary>
        /// get the Bot key.
        /// </summary>
        public const string BotConfigurationSettingsKey = "Bot";

        /// <summary>
        /// get the Bot key.
        /// </summary>
        public const string CORSAllowAllPolicy = "AllowAll";
    }
}
