// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using System.Xml;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;

namespace Microsoft.BotBuilderSamples.Bots
{
    public class ProactiveMessagingSampleBot : ActivityHandler
    {
        private readonly IConfiguration Configuration;

        public ProactiveMessagingSampleBot(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            switch (turnContext.Activity.Text.Trim())
            {
                case "Hello":
                    turnContext.Activity.RemoveRecipientMention();

                    await MentionActivityAsync(turnContext, cancellationToken);

                    break;

                case "GetInfo":
                    await SendProactiveInfoAsync(turnContext, cancellationToken);
                    break;

                default:
                    break;
            }
        }

        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            var welcomeText = "Welcome!";
            
            foreach (var member in membersAdded)
            {
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await turnContext.SendActivityAsync(MessageFactory.Text(welcomeText), cancellationToken);

                    await SendProactiveInfoAsync(turnContext, cancellationToken);
                }
            }
        }

        protected async Task MentionActivityAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var mention = new Mention
            {
                Mentioned = turnContext.Activity.From,
                Text = $"<at>{XmlConvert.EncodeName(turnContext.Activity.From.Name)}</at>",
            };

            var replyActivity = MessageFactory.Text($"Hi {mention.Text}.");
            replyActivity.Entities = new List<Entity> { mention };

            await turnContext.SendActivityAsync(replyActivity, cancellationToken);
        }

        protected async Task SendProactiveInfoAsync(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var conversationId = turnContext.Activity.Conversation.Id;
            var serviceUrl = turnContext.Activity.ServiceUrl;
            var aadObjectId = turnContext.Activity.From.AadObjectId;
            var teamsAppId = Configuration["TeamsAppId"];
            var tabEntityId = Configuration["ProactiveTabEntityId"];
            var subEntityIdEncoded = conversationId + "|" + serviceUrl;
            var encodedContext = WebUtility.UrlEncode("{\"subEntityId\": \"" + subEntityIdEncoded + "\"}");
            var deepLinkUrl = $"https://teams.microsoft.com/l/entity/{teamsAppId}/{tabEntityId}?&context={encodedContext}";

            await turnContext.SendActivityAsync(MessageFactory.Text($"The serviceUrl for this conversation is: **{serviceUrl}**"), cancellationToken);
            await turnContext.SendActivityAsync(MessageFactory.Text($"The conversationId for this conversation is: **{conversationId}**"), cancellationToken);
            await turnContext.SendActivityAsync(MessageFactory.Text($"The aadObjectId for this user is: **{aadObjectId}**"), cancellationToken);
            await turnContext.SendActivityAsync(MessageFactory.Text("You should store the conversationId and serviceUrl in your data store, perhaps using the aadObjectId as a key for the record"), cancellationToken);
            await turnContext.SendActivityAsync(MessageFactory.Text($"Click **[here]({deepLinkUrl})** to go to the tab for this app, where you can send a test pro-active message."), cancellationToken);
        }

    }
}
