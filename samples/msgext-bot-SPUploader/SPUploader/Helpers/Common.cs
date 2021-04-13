using MeetingExtension_SP.Models;
using MeetingExtension_SP.Models.Sharepoint;
using MeetingExtension_SP.Repositories;
using MessageExtension_SP.Models;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.CodeAnalysis.CSharp.Syntax;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading;
using System.Threading.Tasks;
using Attachment = Microsoft.Bot.Schema.Attachment;

namespace MessageExtension_SP.Helpers
{
    public class Common
    {
        public static async Task SendChannelData(Attachment card, IConfiguration configuration)
        {
            //Teams channel id in which to create the post.
            string teamsChannelId = configuration["ChannelId"];

            //The Bot Service Url needs to be dynamically fetched (and stored) from the Team. Recommendation is to capture the serviceUrl from the bot Payload and later re-use it to send proactive messages.
            string serviceUrl = configuration["BotServiceUrl"];

            //From the Bot Channel Registration
            string botClientID = configuration["MicrosoftAppId"];
            string botClientSecret = configuration["MicrosoftAppPassword"];

            MicrosoftAppCredentials.TrustServiceUrl(serviceUrl);
            var connectorClient = new ConnectorClient(new Uri(serviceUrl), new MicrosoftAppCredentials(botClientID, botClientSecret));
            var topLevelMessageActivity = MessageFactory.Attachment(card);
            var conversationParameters = new ConversationParameters
            {
                IsGroup = true,
                ChannelData = new TeamsChannelData
                {
                    Channel = new ChannelInfo(teamsChannelId),
                },
                Activity = (Activity)topLevelMessageActivity
            };

            await connectorClient.Conversations.CreateConversationAsync(conversationParameters);
        }

        public static async Task<AssetData> GetAssetDetails(IConfiguration configuration)
        {
            SharePointRepository repository = new SharePointRepository(configuration);
            var data = await repository.GetAllItemsAsync<DocumentLibrary>("UserDocuments");
            string readFileFromTemp = System.IO.File.ReadAllText(@"Temp/TempFile.txt");
            string filename = Path.GetFileName(readFileFromTemp).Split('_')[1];

            var recentFile = data.ToList().Where(x => x.Name.ToLower().Contains(filename.ToLower())).FirstOrDefault();           

            string[] submitter= System.IO.File.ReadAllText(@"Temp/UserFile.txt").Split(',');
            string ownerId = await GetManagerId(configuration);
            var approverName = await GetUserDetails(configuration, ownerId);

            AssetData data1 = new AssetData();
            data1.ApproverName = approverName;
            data1.DateOfSubmission = recentFile.TimeLastModified;
            data1.NameOfDocument = recentFile.Name;
            data1.SubmittedBy = submitter[0];
            data1.SubitteTo = "User Documents";
            data1.DocName = filename;
            data1.url = configuration["BaseURL"] + recentFile.ServerRelativeUrl;
            data1.userMRI = ownerId;
            data1.userChat = "https://teams.microsoft.com/l/chat/0/0?users="+submitter[1];
            return data1;
        }


        public static async Task<UserModel> GetMe(IConfiguration configuration)
        {
            string tenantId = configuration["TenantId"];
            try
            {
                var token = await GetToken(tenantId, configuration);

                GraphServiceClient graphClient = GetAuthenticatedClient(token.ToString());

                var user = await graphClient.Me
                    .Request()
                    .GetAsync();

                var result = new UserModel
                {
                    displayName = user.DisplayName,
                    mail = user.Mail
                };
                return result;
            }
            catch(Exception ex)
            {

            }
            return null;
        }

        public static async Task<string> GetManagerId(IConfiguration configuration)
        {
            string tenantId = configuration["TenantId"];
            string groupId= configuration["TeamId"];
            try
            {
                var token = await GetToken(tenantId, configuration);
                GraphServiceClient graphClient = GetAuthenticatedClient(token.ToString());

                var result = await graphClient.Groups[groupId].Owners
                 .Request()
                 .GetAsync();

                return result.FirstOrDefault().Id;
            }
            catch(Exception ex)
            {

            }

            return string.Empty;

        }

        public static async Task<string> GetUserDetails(IConfiguration configuration,string userId)
        {
            string tenantId = configuration["TenantId"];

            try
            {
                var token = await GetToken(tenantId, configuration);
                GraphServiceClient graphClient = GetAuthenticatedClient(token.ToString());

                var user = await graphClient.Users[userId]
                    .Request()
                    .GetAsync();
               
                return user.DisplayName;
            }
            catch (Exception ex)
            {

            }

            return string.Empty;

        }

        public static async Task<string> GetToken(string tenantId,IConfiguration configuration)
        {

            IConfidentialClientApplication app = ConfidentialClientApplicationBuilder.Create(configuration["MicrosoftAppId"])
                                                  .WithClientSecret(configuration["MicrosoftAppPassword"])
                                                  .WithAuthority($"https://login.microsoftonline.com/{tenantId}")
                                                  .WithRedirectUri("https://daemon")
                                                  .Build();

            string[] scopes = new string[] { "https://graph.microsoft.com/.default" };

            var result = await app.AcquireTokenForClient(scopes).ExecuteAsync();

            return result.AccessToken;
        }

        public static GraphServiceClient GetAuthenticatedClient(string token)
        {
            var graphClient = new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    requestMessage =>
                    {
                        // Append the access token to the request.
                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                        // Get event times in the current time zone.
                        requestMessage.Headers.Add("Prefer", "outlook.timezone=\"" + TimeZoneInfo.Local.Id + "\"");

                        return Task.CompletedTask;
                    }));
            return graphClient;
        }
    }
}
