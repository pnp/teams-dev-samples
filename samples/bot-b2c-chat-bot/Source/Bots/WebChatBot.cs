// <copyright file="WebChatBot.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Bots
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net.Http;
    using System.Threading;
    using System.Threading.Tasks;
    using B2CChatBot.Helpers;
    using B2CChatBot.Interfaces;
    using B2CChatBot.Models;
    using B2CChatBot.Repository;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Connector;
    using Microsoft.Bot.Connector.Authentication;
    using Microsoft.Bot.Schema;
    using Microsoft.Bot.Schema.Teams;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Newtonsoft.Json;

    /// <summary>
    /// Web chat bot handles the conversation between Teams channel and Web chat and vice versa.
    /// </summary>
    public class WebChatBot : ActivityHandler
    {
        private readonly IGraph graph;
        private readonly IConfiguration configuration;
        private readonly ICard cardHelper;
        private readonly ILogger<WebChatBot> logger;
        private readonly IHttpClientFactory httpClientFactory;

        /// <summary>
        /// Initializes a new instance of the <see cref="WebChatBot"/> class.
        /// </summary>
        /// <param name="graph">IGraph instance.</param>
        /// <param name="configuration">IConfiguration instance.</param>
        /// <param name="cardHelper">ICard instance.</param>
        /// <param name="logger">ILogger instance.</param>
        /// <param name="httpClientFactory">IHttpClientFactory instance.</param>
        public WebChatBot(IGraph graph, IConfiguration configuration, ICard cardHelper, ILogger<WebChatBot> logger, IHttpClientFactory httpClientFactory)
        {
            this.graph = graph;
            this.configuration = configuration;
            this.cardHelper = cardHelper;
            this.logger = logger;
            this.httpClientFactory = httpClientFactory;
        }

        /// <inheritdoc/>
        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            if (!string.IsNullOrEmpty(turnContext.Activity.Conversation.ConversationType))
            {
                dynamic value = turnContext.Activity.Value;

                if (value != null)
                {
                    string type = value["type"];
                    type = string.IsNullOrEmpty(type) ? "." : type.ToLower();
                    await this.HandleEvent(turnContext, type, cancellationToken);
                }
                else
                {
                    var teamsResponse = turnContext.Activity.RemoveRecipientMention();

                    try
                    {
                        await this.SendToWebChatFromTeamsChannel(turnContext, cancellationToken, teamsResponse, null);
                    }
                    catch (Exception e)
                    {
                        this.logger.LogError(e.Message + " " + e.StackTrace);
                    }
                }
            }
            else
            {
                dynamic value = turnContext.Activity.Value;

                if (value != null)
                {
                    string type = value["type"];
                    type = string.IsNullOrEmpty(type) ? "." : type.ToLower();
                    await this.HandleEvent(turnContext, type, cancellationToken);
                }
                else if (turnContext.Activity.Attachments != null && turnContext.Activity.Attachments.Any())
                {
                    await this.HandleIncomingAttachment(turnContext, cancellationToken);
                }
                else
                {
                    if (turnContext.Activity.Text.ToLower().Equals(Constants.Help))
                    {
                        await this.SendResponse(turnContext, cancellationToken);
                    }
                    else
                    {
                        try
                        {
                            await this.SendToTeamsChannelFromWebChat(turnContext, cancellationToken, turnContext.Activity.Text, null);
                        }
                        catch (Exception e)
                        {
                            this.logger.LogError(e.Message + " " + e.StackTrace);
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Invoked when a conversation update activity is received from the channel.
        /// </summary>
        /// <param name="turnContext">The context object for this turn.</param>
        /// <param name="cancellationToken">A cancellation token that can be used by other objects
        /// or threads to receive notice of cancellation.</param>
        /// <returns>A task that represents the work queued to execute.</returns>
        protected override async Task OnConversationUpdateActivityAsync(
            ITurnContext<IConversationUpdateActivity> turnContext,
            CancellationToken cancellationToken)
        {
            // base.OnConversationUpdateActivityAsync is useful when it comes to responding to users being added to or removed from the conversation.
            // For example, a bot could respond to a user being added by greeting the user.
            // By default, base.OnConversationUpdateActivityAsync will call <see cref="OnMembersAddedAsync(IList{ChannelAccount}, ITurnContext{IConversationUpdateActivity}, CancellationToken)"/>
            // if any users have been added or <see cref="OnMembersRemovedAsync(IList{ChannelAccount}, ITurnContext{IConversationUpdateActivity}, CancellationToken)"/>
            // if any users have been removed. base.OnConversationUpdateActivityAsync checks the member ID so that it only responds to updates regarding members other than the bot itself.
            await base.OnConversationUpdateActivityAsync(turnContext, cancellationToken);

            var activity = turnContext.Activity;

            if (activity.MembersAdded != null)
            {
            }

            if (activity.MembersRemoved != null)
            {
            }
        }

        private async Task SendToTeamsChannelFromWebChat(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken, string message, Attachment attachment)
        {
            try
            {
                var conversationId = turnContext.Activity.Conversation.Id;
                ConversationResource teamsChatReferenceUsingWebConversationId = null;

                var conversationResourceTeamsChatReference = (await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.WebConversationId == conversationId && c.ConversationReference != null)).FirstOrDefault();
                var conversationResourceWebChatReference = (await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.TeamsConversationId == conversationId && c.ConversationReference != null)).FirstOrDefault();
                if (conversationResourceWebChatReference != null)
                {
                    teamsChatReferenceUsingWebConversationId = (await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.WebConversationId == conversationResourceWebChatReference.ConversationReference.Conversation.Id && c.ConversationReference != null)).FirstOrDefault();
                }

                var customerInfo = await this.GetCustomerInformation(conversationId);
                if (customerInfo != null && (conversationResourceTeamsChatReference != null || teamsChatReferenceUsingWebConversationId != null))
                {
                    var conversationReferece = conversationResourceTeamsChatReference ?? teamsChatReferenceUsingWebConversationId;
                    try
                    {
                        await ((BotFrameworkAdapter)turnContext.Adapter).ContinueConversationAsync(
                            this.configuration[Constants.MicrosoftAppIdConfigurationSettingsKey],
                            conversationReferece.ConversationReference,
                            async (t2, c2) =>
                                {
                                    await t2.SendActivityAsync(this.CreateMessageActivityForTeamsChannel(customerInfo, message, attachment));
                                },
                            cancellationToken);
                    }
                    catch (Exception e)
                    {
                        this.logger.LogError(e.Message + " " + e.StackTrace);
                    }
                }
                else
                {
                    await turnContext.SendActivityAsync(Constants.HelpMessageText);
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message + " " + ex.StackTrace);
            }
        }

        private async Task SubmitNewChatRequest(ITurnContext<IMessageActivity> turnContext)
        {
            try
            {
                dynamic value = turnContext.Activity.Value;
                CustomerInformation customer = JsonConvert.DeserializeObject<CustomerInformation>(Convert.ToString(value));
                customer.Status = Constants.Unassigned;
                var newQueryAttachment = this.cardHelper.CreateNewQueryAttachment(customer);
                if (newQueryAttachment != null)
                {
                    ChannelAccount channelAccount = new ChannelAccount(this.configuration[Constants.MicrosoftAppIdConfigurationSettingsKey]);
                    var notificationStatus = await this.SendChannelNotification(channelAccount, customer, string.Empty, newQueryAttachment);
                    if (notificationStatus.IsSuccessful)
                    {
                        var conversationResource = new ConversationResource() { TeamsConversationId = notificationStatus.MessageId, ConversationReference = turnContext.Activity.GetConversationReference() };
                        await DocumentDBRepository.CreateItemAsync(conversationResource);
                        customer.TeamsConversationId = notificationStatus.MessageId;
                        customer.WebConversationId = turnContext.Activity.Conversation.Id;
                        await DocumentDBRepository.CreateItemAsync(customer);
                    }
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message + " " + ex.StackTrace);
            }
        }

        private async Task SubmitUpdatedChatRequest(ITurnContext<IMessageActivity> turnContext, CustomerInformation customerInfo, CancellationToken cancellationToken)
        {
            try
            {
                var messageId = customerInfo.TeamsConversationId.Split("messageid=")[1];
                customerInfo.Status = Constants.Assigned;
                var updatedQueryAttachment = this.cardHelper.UpdateQueryStatusAttachment(customerInfo);
                IMessageActivity activity = MessageFactory.Attachment(updatedQueryAttachment);
                activity.Id = messageId;
                await turnContext.UpdateActivityAsync(activity, cancellationToken);
                await DocumentDBRepository.UpdateItemAsync<CustomerInformation>(customerInfo.Id, customerInfo);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message + " " + ex.StackTrace);
            }
        }

        private async Task SendToWebChatFromTeamsChannel(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken, string message, Attachment attachment)
        {
            try
            {
                var conversationResourceWebChatReference = (await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.TeamsConversationId == turnContext.Activity.Conversation.Id && c.ConversationReference != null)).FirstOrDefault();
                if (conversationResourceWebChatReference != null)
                {
                    await ((BotFrameworkAdapter)turnContext.Adapter).ContinueConversationAsync(
                        this.configuration[Constants.MicrosoftAppIdConfigurationSettingsKey],
                        conversationResourceWebChatReference.ConversationReference,
                        async (t2, c2) =>
                                                {
                                                    await t2.SendActivityAsync(this.CreateMessageActivityForWebChat(message, attachment));
                                                },
                        cancellationToken);
                    var conversationResourceTeamsChatReference = (await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.WebConversationId == conversationResourceWebChatReference.ConversationReference.Conversation.Id && c.ConversationReference != null)).FirstOrDefault();
                    if (conversationResourceTeamsChatReference == null)
                    {
                        var conversationResource = new ConversationResource() { WebConversationId = conversationResourceWebChatReference.ConversationReference.Conversation.Id, ConversationReference = turnContext.Activity.GetConversationReference() };
                        await DocumentDBRepository.CreateItemAsync(conversationResource);
                    }
                }
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex.Message + " " + ex.StackTrace);
            }
        }

        private async Task<NotificationSendStatus> SendChannelNotification(ChannelAccount botAccount, CustomerInformation customer, string messageText, Attachment attachment)
        {
            string serviceUrl = this.configuration["TeamsServiceUrl"];
            string channelId = this.configuration["ChannelId"];
            try
            {
                IMessageActivity replyMessage = this.CreateMessageActivityForTeamsChannel(customer, messageText, attachment);
                MicrosoftAppCredentials.TrustServiceUrl(serviceUrl, DateTime.MaxValue);
                using var connectorClient = new ConnectorClient(new Uri(serviceUrl), this.configuration[Constants.MicrosoftAppIdConfigurationSettingsKey], this.configuration[Constants.MicrosoftAppPasswordConfigurationSettingsKey]);
                var parameters = new ConversationParameters
                {
                    Bot = botAccount,
                    ChannelData = new TeamsChannelData
                    {
                        Channel = new ChannelInfo(channelId),
                        Notification = new NotificationInfo() { Alert = true },
                    },
                    IsGroup = true,
                    Activity = (Activity)replyMessage,
                };

                var conversationResource = await connectorClient.Conversations.CreateConversationAsync(parameters);

                return new NotificationSendStatus() { MessageId = conversationResource.Id, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                return new NotificationSendStatus() { IsSuccessful = false, FailureMessage = ex.Message };
            }
        }

        private IMessageActivity CreateMessageActivityForWebChat(string message, Attachment attachment)
        {
            var replyMessage = Activity.CreateMessageActivity();

            replyMessage.Text = message;

            if (attachment != null)
            {
                replyMessage.Attachments.Add(attachment);
            }

            return replyMessage;
        }

        private IMessageActivity CreateMessageActivityForTeamsChannel(CustomerInformation customer, string messageText, Attachment attachment)
        {
            var replyMessage = Activity.CreateMessageActivity();

            var onBehalfOfObj = new[]
            {
                    new Dictionary<string, object>
                    {
                        ["itemid"] = 0,
                        ["mentionType"] = "person",
                        ["mri"] = "29:orgid:ee6f58c7-631b-4170-aa47-88f0a9164903", // random GUID
                        ["displayName"] = customer.FirstName + " " + customer.LastName,
                    },
            };

            replyMessage.ChannelData = new Dictionary<string, object>
            {
                ["OnBehalfOf"] = onBehalfOfObj,
            };

            replyMessage.Text = messageText;

            if (attachment != null)
            {
                replyMessage.Attachments.Add(attachment);
            }

            return replyMessage;
        }

        private async Task HandleEvent(ITurnContext<IMessageActivity> turnContext, string input, CancellationToken cancellationToken)
        {
            var conversationId = turnContext.Activity.Conversation.Id;

            switch (input)
            {
                case Constants.ScheduleMeeting:
                    var @event = await this.graph.CreateOnlineEvent(turnContext.Activity.From.AadObjectId);
                    if (@event != null)
                    {
                        CustomerInformation customerInformation = await this.GetCustomerInformation(conversationId);
                        var webChatMeetingLinkAttachment = this.cardHelper.WebChatMeetingLinkAttachment(@event.OnlineMeeting.JoinUrl);
                        await this.SendToWebChatFromTeamsChannel(turnContext, cancellationToken, string.Empty, webChatMeetingLinkAttachment);
                        if (customerInformation != null)
                        {
                            var teamsChannelMeetingLinkAttachment = this.cardHelper.TeamsChannelMeetingLinkAttachment(customerInformation, @event.OnlineMeeting.JoinUrl);
                            await this.SendToTeamsChannelFromWebChat(turnContext, cancellationToken, string.Empty, teamsChannelMeetingLinkAttachment);
                        }
                    }

                    break;
                case Constants.RaiseNewRequest:
                    var raiseNewRequestAttachment = this.cardHelper.RaiseNewRequestAttachment();
                    await turnContext.SendActivityAsync(MessageFactory.Attachment(raiseNewRequestAttachment), cancellationToken);
                    break;
                case Constants.EndConversation:
                    var conversationResourceReference = await DocumentDBRepository.GetItemsAsync<ConversationResource>(c => c.ConversationReference != null && (c.WebConversationId == conversationId || c.ConversationReference.Conversation.Id == conversationId || c.TeamsConversationId == conversationId));
                    foreach (ConversationResource conversationResource in conversationResourceReference)
                    {
                        if (!string.IsNullOrEmpty(conversationResource.WebConversationId) && conversationResource.WebConversationId == conversationId)
                        {
                            await this.SendToTeamsChannelFromWebChat(turnContext, cancellationToken, Constants.ConversationEndTeamsMessageText, null);
                            await turnContext.SendActivityAsync(Constants.ConversationEndWebChatMessageText);
                        }

                        if (!string.IsNullOrEmpty(conversationResource.TeamsConversationId) && conversationResource.TeamsConversationId == conversationId)
                        {
                            await this.SendToWebChatFromTeamsChannel(turnContext, cancellationToken, Constants.ConversationEndWebChatMessageText, null);
                            await turnContext.SendActivityAsync(Constants.ConversationEndTeamsMessageText);
                        }

                        await DocumentDBRepository.DeleteItemAsync(conversationResource.Id);
                    }

                    break;
                case Constants.SubmitNewRequest:
                    await this.SubmitNewChatRequest(turnContext);
                    break;
                case Constants.Assign:
                    var customerInfo = await this.GetCustomerInformation(conversationId);
                    if (customerInfo != null)
                    {
                        await this.SubmitUpdatedChatRequest(turnContext, customerInfo, cancellationToken);
                        await this.SendToWebChatFromTeamsChannel(turnContext, cancellationToken, Constants.UpdateAssignmentStatusToUser, null);
                    }

                    break;
                default:
                    break;
            }
        }

        private async Task<CustomerInformation> GetCustomerInformation(string id)
        {
            return (await DocumentDBRepository.GetItemsAsync<CustomerInformation>(c => c.EmailAddress != null && (c.TeamsConversationId == id || c.WebConversationId == id))).FirstOrDefault();
        }

        private async Task SendResponse(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            switch (turnContext.Activity.Text.ToLower())
            {
                case Constants.Help:
                    var helpAttachment = this.cardHelper.HelpAttachment();
                    await turnContext.SendActivityAsync(MessageFactory.Attachment(helpAttachment), cancellationToken);
                    break;
                default:
                    break;
            }
        }

        private async Task HandleIncomingAttachment(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            try
            {
                var activity = turnContext.Activity;
                var conversationId = activity.Conversation.Id;
                var customerFolderInfo = (await DocumentDBRepository.GetItemsAsync<CustomerInformation>(c => c.FolderId != null && (c.TeamsConversationId == conversationId || c.WebConversationId == conversationId))).FirstOrDefault();
                if (customerFolderInfo != null)
                {
                    await this.UploadFileAndSendChannelNotification(turnContext, customerFolderInfo, cancellationToken);
                }
                else
                {
                    var customerInfo = await this.GetCustomerInformation(conversationId);
                    if (customerInfo != null)
                    {
                        var folder = await this.graph.CreateFolder(customerInfo);
                        if (folder != null)
                        {
                            customerInfo.FolderName = folder.Name;
                            customerInfo.FolderId = folder.Id;
                            customerInfo.FolderUrl = folder.WebUrl;
                            await this.UploadFileAndSendChannelNotification(turnContext, customerInfo, cancellationToken);
                            await DocumentDBRepository.UpdateItemAsync<CustomerInformation>(customerInfo.Id, customerInfo);
                        }
                    }
                    else
                    {
                        await turnContext.SendActivityAsync(Constants.AttachmentsHelpMessageText);
                    }
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + ' ' + e.StackTrace);
            }
        }

        private async Task UploadFileAndSendChannelNotification(ITurnContext<IMessageActivity> turnContext, CustomerInformation customerInfo, CancellationToken cancellationToken)
        {
            try
            {
                foreach (var attachment in turnContext.Activity.Attachments)
                {
                    using var client = this.httpClientFactory.CreateClient("AttachmentWebClient");
                    var responseMessage = await client.GetAsync(attachment.ContentUrl);
                    var attachmentStream = await responseMessage.Content.ReadAsStreamAsync();
                    var file = await this.graph.UploadFile(customerInfo.FolderId, attachment.Name, attachmentStream);
                    if (file != null)
                    {
                        await this.SendToTeamsChannelFromWebChat(turnContext, cancellationToken, $"New file [{file.Name}]({file.WebUrl}) uploaded at [{customerInfo.FolderName}]({customerInfo.FolderUrl})", null);
                    }
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + ' ' + e.StackTrace);
            }
        }
    }
}
