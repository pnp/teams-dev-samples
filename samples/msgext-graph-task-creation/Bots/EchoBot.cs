// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.9.1
extern alias BetaLib;
using Beta = BetaLib.Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AdaptiveCards;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Configuration;
using Bot.Builder.Community.Samples.Teams.Models;
using Bot.Builder.Community.Samples.Teams.Services;
using Microsoft.Bot.Connector;
using Newtonsoft.Json.Linq;
using Microsoft.Bot.Connector.Authentication;
using System.IO;
using System.Text;
using System.Globalization;

namespace Bot.Builder.Community.Samples.Teams.Bots
{
    public class EchoBot : TeamsActivityHandler
    {
        readonly string _connectionName;
        private string plannerGroupId;
        public static string botClientID;
        public static string botClientSecret;
        private string tenantId;
        private string serviceUrl;

        public EchoBot(IConfiguration configuration)
        {
            _connectionName = configuration["ConnectionNameGraph"] ?? throw new NullReferenceException("ConnectionNameGraph");
            botClientID = configuration["MicrosoftAppId"];
            botClientSecret = configuration["MicrosoftAppPassword"];
            tenantId = configuration["tenantId"];
            serviceUrl = configuration["serviceUrl"];
        }

        // 1. Will be called when user triggers messaging extension which then calls CreateTaskModuleCommand
        protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            // Check if the bot has been installed in the team by getting the team rooster
            try
            {
                var teamsMembers = await TeamsInfo.GetMembersAsync(turnContext);
            }
            catch
            {
                // if not installed we will send out the card instructing the user to install the bot
                string jitCardPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Cards", "jitCard.json");
                var jitCard = File.ReadAllText(jitCardPath, Encoding.UTF8);
                string jitCardJson = jitCard;
                var jitCardTeams = AdaptiveCard.FromJson(jitCardJson);
                return await Task.FromResult(new MessagingExtensionActionResponse
                {
                    Task = new TaskModuleContinueResponse
                    {
                        Value = new TaskModuleTaskInfo
                        {
                            Card = new Attachment
                            {
                                Content = jitCardTeams.Card,
                                ContentType = AdaptiveCard.ContentType,
                            },
                            Height = 300,
                            Width = 600,
                            Title = "Install bot",
                        },
                    },
                });
            }
            

            var magicCode = string.Empty;
            var state = (turnContext.Activity.Value as Newtonsoft.Json.Linq.JObject).Value<string>("state");
            if (!string.IsNullOrEmpty(state))
            {
                int parsed = 0;
                if (int.TryParse(state, out parsed))
                {
                    magicCode = parsed.ToString();
                }
            }

            var tokenResponse = await (turnContext.Adapter as IUserTokenProvider).GetUserTokenAsync(turnContext, _connectionName, magicCode, cancellationToken: cancellationToken);
            if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.Token))
            {
                // There is no token, so the user has not signed in yet.

                // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
                var signInLink = await (turnContext.Adapter as IUserTokenProvider).GetOauthSignInLinkAsync(turnContext, _connectionName, cancellationToken);

                return new MessagingExtensionActionResponse
                {
                    ComposeExtension = new MessagingExtensionResult
                    {
                        Type = "auth",
                        SuggestedActions = new MessagingExtensionSuggestedAction
                        {
                            Actions = new List<CardAction>
                                {
                                    new CardAction
                                    {
                                        Type = ActionTypes.OpenUrl,
                                        Value = signInLink,
                                        Title = "Sign in Please",
                                    },
                                },
                        },
                    },
                };
            }
            var accessToken = tokenResponse.Token;
            if (accessToken != null || !string.IsNullOrEmpty(accessToken))
            {
                // Create Graph Client
                var client = new SimpleGraphClient(accessToken);
                // Get Group details
                var channel = turnContext.Activity.TeamsGetChannelId();
                if (channel != null)
                {
                    var members = new List<TeamsChannelAccount>();
                    string continuationToken = null;
                    do
                    {
                        var currentPage = await TeamsInfo.GetPagedMembersAsync(turnContext, 100, continuationToken, cancellationToken);
                        continuationToken = currentPage.ContinuationToken;
                        members = members.Concat(currentPage.Members).ToList();
                    }
                    while (continuationToken != null);
                    TeamDetails teamDetails = await TeamsInfo.GetTeamDetailsAsync(turnContext, turnContext.Activity.TeamsGetTeamInfo().Id, cancellationToken);
                    if (teamDetails != null)
                    {
                        var groupId = teamDetails.AadGroupId;
                        plannerGroupId = groupId;
                        //Get Plans
                        var currentGroupPlan = await client.GetCurrentPlan(groupId);
                        var favoritePlans = await client.GetFavoritePlans();
                        // Fill Adaptive Card data
                        var exampleData = new ExampleData();
                        exampleData.MultiSelect = "false";
                        if (currentGroupPlan.CurrentPage.Count == 0)
                        {
                            exampleData.Option1 = favoritePlans.CurrentPage[4].Title;
                            exampleData.Option1Value = favoritePlans.CurrentPage[4].Id;
                        }
                        else
                        {
                            exampleData.Option1 = currentGroupPlan.CurrentPage[0].Title;
                            exampleData.Option1Value = currentGroupPlan.CurrentPage[0].Id;
                        }
                        exampleData.Option2 = favoritePlans.CurrentPage[0].Title;
                        exampleData.Option3 = favoritePlans.CurrentPage[1].Title;
                        exampleData.Option4 = favoritePlans.CurrentPage[2].Title;
                        exampleData.Option2Value = favoritePlans.CurrentPage[0].Id;
                        exampleData.Option3Value = favoritePlans.CurrentPage[1].Id;
                        exampleData.Option4Value = favoritePlans.CurrentPage[2].Id;
                        // Create and return card
                        var adaptiveCardEditor = AdaptiveCardHelper.CreateAdaptiveCardEditor(exampleData);
                        //var adaptiveCardEditor = CreateAdaptiveCard();

                        return await Task.FromResult(new MessagingExtensionActionResponse
                        {
                            Task = new TaskModuleContinueResponse
                            {
                                Value = new TaskModuleTaskInfo
                                {
                                    Card = new Microsoft.Bot.Schema.Attachment
                                    {
                                        Content = adaptiveCardEditor,
                                        ContentType = AdaptiveCard.ContentType,
                                    },
                                    Height = 600,
                                    Width = 600,
                                    Title = "Task creation",
                                },
                            },
                        });
                    }
                }
                else
                {
                    // Return only favorite plans without current plan as in 1:1 or group chat
                    var favoritePlans = await client.GetFavoritePlans();
                    // Fill Adaptive Card data
                    var exampleData = new ExampleData();
                    exampleData.MultiSelect = "false";
                    exampleData.Option1 = favoritePlans.CurrentPage[0].Title;
                    exampleData.Option2 = favoritePlans.CurrentPage[1].Title;
                    exampleData.Option3 = favoritePlans.CurrentPage[2].Title;

                    exampleData.Option1Value = favoritePlans.CurrentPage[0].Id;
                    exampleData.Option3Value = favoritePlans.CurrentPage[1].Id;
                    exampleData.Option4Value = favoritePlans.CurrentPage[2].Id;

                    // Create and return card
                    var adaptiveCardEditor = AdaptiveCardHelper.CreateAdaptiveCardEditor(exampleData);
                    //var adaptiveCardEditor = CreateAdaptiveCard();

                    return await Task.FromResult(new MessagingExtensionActionResponse
                    {
                        Task = new TaskModuleContinueResponse
                        {
                            Value = new TaskModuleTaskInfo
                            {
                                Card = new Microsoft.Bot.Schema.Attachment
                                {
                                    Content = adaptiveCardEditor,
                                    ContentType = AdaptiveCard.ContentType,
                                },
                                Height = 600,
                                Width = 600,
                                Title = "Task creation",
                            },
                        },
                    });
                }

            }
            //Needs to be replaced with OAuth Prompt
            return null;
        }

        // 2. Will be called after OnTeamsMessagingExtensionFetchTaskAsync when user has entered all data in the Messaging Extension Adaptive Card
        private async Task<MessagingExtensionActionResponse> CreateTaskModuleCommand(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            var msg = action.MessagePayload.Body.Content;
            var data = action.Data;
            var channel = turnContext.Activity.TeamsGetChannelId();
            var groupId = "";
            if (channel != null)
            {
                TeamDetails teamDetails = await TeamsInfo.GetTeamDetailsAsync(turnContext, turnContext.Activity.TeamsGetTeamInfo().Id, cancellationToken);
                groupId = teamDetails.AadGroupId;
            }
            var subject = ((JObject)action.Data)["Title"]?.ToString();
            var dueDate = ((JObject)action.Data)["DueDate"]?.ToString();
            var startDate = ((JObject)action.Data)["StartDate"]?.ToString();
            var type = ((JObject)action.Data)["Type"]?.ToString();
            var url = turnContext.Activity.Value.ToString();
            JObject jsonUrl = JObject.Parse(url);
            var link = jsonUrl["messagePayload"]["linkToMessage"];
            var magicCode = string.Empty;
            var state = (turnContext.Activity.Value as Newtonsoft.Json.Linq.JObject).Value<string>("state");
            if (!string.IsNullOrEmpty(state))
            {
                int parsed = 0;
                if (int.TryParse(state, out parsed))
                {
                    magicCode = parsed.ToString();
                }
            }
            var tokenResponse = await (turnContext.Adapter as IUserTokenProvider).GetUserTokenAsync(turnContext, _connectionName, magicCode, cancellationToken: cancellationToken);
            if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.Token))
            {
                // There is no token, so the user has not signed in yet.
                // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
                var signInLink = await (turnContext.Adapter as IUserTokenProvider).GetOauthSignInLinkAsync(turnContext, _connectionName, cancellationToken);
                return new MessagingExtensionActionResponse
                {
                    ComposeExtension = new MessagingExtensionResult
                    {
                        Type = "auth",
                        SuggestedActions = new MessagingExtensionSuggestedAction
                        {
                            Actions = new List<CardAction>
                                {
                                    new CardAction
                                    {
                                        Type = ActionTypes.OpenUrl,
                                        Value = signInLink,
                                        Title = "Bot Service OAuth",
                                    },
                                },
                        },
                    },
                };
            }
            var accessToken = tokenResponse.Token;
            if (accessToken != null || !string.IsNullOrEmpty(accessToken))
            {
                var client = new SimpleGraphClient(accessToken);
                if (type == "todo")
                {
                    var body = new Beta.ItemBody
                    {
                        Content = msg + " - " + link
                    };
                    var taskResult = await client.CreateTaskAsync(subject, dueDate, startDate, body);
                    var todoUrl = "https://to-do.office.com/tasks/id/" + taskResult.Id + "/details";
                    List<ChannelAccount> participants = new List<ChannelAccount>();
                    participants.Add(new ChannelAccount(turnContext.Activity.From.Id, turnContext.Activity.From.Name));
                    var connectorClient = new ConnectorClient(new Uri(serviceUrl), new MicrosoftAppCredentials(botClientID, botClientSecret));
                    var conversationParameters = new ConversationParameters()
                    {
                        ChannelData = new TeamsChannelData
                        {
                            Tenant = new TenantInfo
                            {
                                Id = tenantId,
                            }
                        },
                        Members = new List<ChannelAccount>() { participants[0] }
                    };
                    var response = await connectorClient.Conversations.CreateConversationAsync(conversationParameters);
                    string taskCardPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Cards", "todoCardTeams.json");
                    var r = File.ReadAllText(taskCardPath, Encoding.UTF8);
                    string taskCardJson = r;
                    taskCardJson = taskCardJson.Replace("replaceUrl", todoUrl ?? "", true, culture: CultureInfo.InvariantCulture);
                    taskCardJson = taskCardJson.Replace("ReplaceTitel", taskResult.Subject.ToString() ?? "", true, culture: CultureInfo.InvariantCulture);
                    var card = AdaptiveCard.FromJson(taskCardJson);
                    Attachment attachment = new Attachment()
                    {
                        ContentType = AdaptiveCard.ContentType,
                        Content = card.Card
                    };
                    IMessageActivity cardMsg = MessageFactory.Attachment(attachment);
                    await connectorClient.Conversations.SendToConversationAsync(response.Id, (Activity)cardMsg, cancellationToken);
                }
                if (type == "planner")
                {
                    var username = turnContext.Activity.From.AadObjectId;
                    var taskTitle = ((JObject)action.Data)["Title"]?.ToString();
                    var taskStartDate = ((JObject)action.Data)["StartDate"]?.ToString();
                    var taskDueDate = ((JObject)action.Data)["DueDate"]?.ToString();
                    var taskSPlanId = ((JObject)action.Data)["Choices"]?.ToString();
                    var planResult = await client.CreatePlannerTaskAsync(taskSPlanId, taskTitle, taskDueDate, taskStartDate, username);
                    if (!string.IsNullOrEmpty(groupId))
                    {
                        var taskUrl = "https://tasks.office.com/solviondemo.net/en-US/Home/Planner/#/plantaskboard?groupId=" + groupId + "&planId=" + planResult.PlanId + "&taskId=" + planResult.Id;
                        List<ChannelAccount> participants = new List<ChannelAccount>();
                        participants.Add(new ChannelAccount(turnContext.Activity.From.Id, turnContext.Activity.From.Name));
                        var connectorClient = new ConnectorClient(new Uri(serviceUrl), new MicrosoftAppCredentials(botClientID, botClientSecret));
                        var conversationParameters = new ConversationParameters()
                        {
                            ChannelData = new TeamsChannelData
                            {
                                Tenant = new TenantInfo
                                {
                                    Id = tenantId,
                                }
                            },
                            Members = new List<ChannelAccount>() { participants[0] }
                        };
                        var response = await connectorClient.Conversations.CreateConversationAsync(conversationParameters);
                        string taskCardPath = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "Cards", "plannerCardTeams.json");
                        var r = File.ReadAllText(taskCardPath, Encoding.UTF8);
                        string taskCardJson = r;
                        taskCardJson = taskCardJson.Replace("replaceUrl", taskUrl ?? "", true, culture: CultureInfo.InvariantCulture);
                        taskCardJson = taskCardJson.Replace("ReplaceTitel", planResult.Title.ToString() ?? "", true, culture: CultureInfo.InvariantCulture);
                        var card = AdaptiveCard.FromJson(taskCardJson);
                        Attachment attachment = new Attachment()
                        {
                            ContentType = AdaptiveCard.ContentType,
                            Content = card.Card
                        };
                        IMessageActivity cardMsg = MessageFactory.Attachment(attachment);
                        await connectorClient.Conversations.SendToConversationAsync(response.Id, (Activity)cardMsg, cancellationToken);
                    }
                    else
                    {
                        List<ChannelAccount> participants = new List<ChannelAccount>();
                        participants.Add(new ChannelAccount(turnContext.Activity.From.Id, turnContext.Activity.From.Name));
                        var connectorClient = new ConnectorClient(new Uri(serviceUrl), new MicrosoftAppCredentials(botClientID, botClientSecret));
                        var conversationParameters = new ConversationParameters()
                        {
                            ChannelData = new TeamsChannelData
                            {
                                Tenant = new TenantInfo
                                {
                                    Id = tenantId,
                                }
                            },
                            Members = new List<ChannelAccount>() { participants[0] }
                        };
                        var response = await connectorClient.Conversations.CreateConversationAsync(conversationParameters);
                        var personalMessageActivity = MessageFactory.Text($"I've created a new Planner task with the title **" + planResult.Title.ToString() + "** in the Plan you have chosen");
                        await connectorClient.Conversations.SendToConversationAsync(response.Id, personalMessageActivity);
                    }
                }
            }
            return null;
        }

        protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionSubmitActionAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            // check if we previousy requested to install the bot - if true we will present the messaging extension
            if (action.Data.ToString().Contains("justInTimeInstall"))
            {
                return await OnTeamsMessagingExtensionFetchTaskAsync(turnContext, action, cancellationToken);
            }
            else
            {
                switch (action.CommandId)
                {
                    case "createTaskModule":
                        // This command will first call OnTeamsMessagingExtensionFetchTaskAsync and then CreateTaskModuleCommand
                        return await CreateTaskModuleCommand(turnContext, action, cancellationToken);
                    default:
                        throw new NotImplementedException($"Invalid CommandId: {action.CommandId}");
                }
            }
        }

        protected override async Task OnMessageActivityAsync(ITurnContext<IMessageActivity> turnContext, CancellationToken cancellationToken)
        {
            var replyText = $"Echo: {turnContext.Activity.Text}";
            await turnContext.SendActivityAsync(MessageFactory.Text(replyText, replyText), cancellationToken);
        }

        protected override async Task OnMembersAddedAsync(IList<ChannelAccount> membersAdded, ITurnContext<IConversationUpdateActivity> turnContext, CancellationToken cancellationToken)
        {
            var welcomeText = "Hello and welcome!";
            foreach (var member in membersAdded)
            {
                if (member.Id != turnContext.Activity.Recipient.Id)
                {
                    await turnContext.SendActivityAsync(MessageFactory.Text(welcomeText, welcomeText), cancellationToken);
                }
            }
        }
    }
}
