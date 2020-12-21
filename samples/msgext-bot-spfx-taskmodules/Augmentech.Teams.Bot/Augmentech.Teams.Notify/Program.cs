using AdaptiveCards;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using System;
using System.IO;
using System.Threading.Tasks;

namespace Augmentech.Teams.Notify
{
    class Program
    {
        static async Task Main(string[] args)
        {

            //The Bot Service Url needs to be dynamically stored and fetched from the Team. 
            //This Url is present in every payload which Teams sends to the Bot after the Bot is added to the Team.
            //Recommendation is to store the serviceUrl from the bot payload and later re-use it to send proactive messages.
            string serviceUrl = "https://smba.trafficmanager.net/emea/";

            //From the Bot Channel Registration
            string botClientID = "<client-id>";
            string botClientSecret = "<client-secret>";

            //Teams channel id in which to create the post.
            string teamsChannelId = "19:76682c58fc414f6daf32938dee564a72@thread.tacv2";


            MicrosoftAppCredentials.TrustServiceUrl(serviceUrl);
            var connectorClient = new ConnectorClient(new Uri(serviceUrl), new MicrosoftAppCredentials(botClientID, botClientSecret));


            string adaptiveCardJsonFilePath = @"AdaptiveCard.json";

            string json = File.ReadAllText(adaptiveCardJsonFilePath);

            AdaptiveCardParseResult result = AdaptiveCard.FromJson(json);

            // Get card from result
            AdaptiveCard adaptiveCard = result.Card;

            var cardAttachment = new Attachment
            {
                Content = adaptiveCard,
                ContentType = AdaptiveCard.ContentType,
            };

            var messageActivity = MessageFactory.Attachment(cardAttachment);

            //Send the activity to Teams.
            var conversationParameters = new ConversationParameters
            {
                IsGroup = true,
                ChannelData = new TeamsChannelData
                {
                    Channel = new ChannelInfo(teamsChannelId),
                },
                Activity = (Activity)messageActivity
            };
            await connectorClient.Conversations.CreateConversationAsync(conversationParameters);
        }
    }
}
