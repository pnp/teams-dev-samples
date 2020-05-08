using AdaptiveCards;
using ConsultingBot.Cards;
using ConsultingBot.Model;
using ConsultingData.Models;
using ConsultingData.Services;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace ConsultingBot.TeamsActivityHandlers
{
    public class ProjectMessagingExtension
    {
        private readonly IConfiguration configuration;
        public ProjectMessagingExtension(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        // Called when the messaging extension query is entered
        public async Task<MessagingExtensionResponse> HandleMessagingExtensionQueryAsync(ITurnContext turnContext, MessagingExtensionQuery query)
        {
            var queryText = "";
            queryText = query?.Parameters.FirstOrDefault(p => p.Name == "queryText").Value as string;

            var consultingDataService = new ConsultingDataService();
            var projects = await consultingDataService.GetProjects(queryText);
            var attachments = new List<MessagingExtensionAttachment>();
            foreach (var project in projects)
            {
                var resultCard = ProjectResultsCard.GetCard(project, getMapUrl(project.Client));
                var previewCard = ProjectPreviewCard.GetCard(project);
                attachments.Add(resultCard.ToAttachment().ToMessagingExtensionAttachment(previewCard.ToAttachment()));
            }

            return new MessagingExtensionResponse
            {
                ComposeExtension = new MessagingExtensionResult()
                {
                    Type = "result",
                    AttachmentLayout = "list",
                    Attachments = attachments
                }
            };
        }

        // Called when the task module is fetched for an action
        public async Task<MessagingExtensionActionResponse> HandleMessagingExtensionFetchTaskAsync(ITurnContext turnContext, MessagingExtensionAction query)
        {
            var emptyRequest = new ConsultingRequestDetails();
            ConsultingDataService dataService = new ConsultingDataService();
            emptyRequest.possibleProjects = await dataService.GetProjects("");
            IEnumerable<TeamsChannelAccount> members = await TeamsInfo.GetMembersAsync(turnContext);
            emptyRequest.possiblePersons = members.Select((w) => new Person
                                                   {
                                                      name = w.Name,
                                                      email = w.Email
                                                   })
                                                   .ToList();

            var card = await AddToProjectCard.GetCardAsync(turnContext, emptyRequest);
            var response = new Microsoft.Bot.Schema.Teams.TaskModuleContinueResponse()
            {
                Type = "continue",
                Value = new TaskModuleTaskInfo()
                {
                    Title = "Select a sample",
                    Card = card.ToAttachment()
                }
            };

            return new MessagingExtensionActionResponse
            {
                Task = response
            };
        }

        // Called when the task module from an action messaging extension  is submitted
        public async Task<MessagingExtensionActionResponse> HandleMessagingExtensionSubmitActionAsync(ITurnContext turnContext, CancellationToken cancellationToken, MessagingExtensionAction action)
        {
            var val = JObject.FromObject(action.Data); // turnContext.Activity.Value as JObject;
            var payload = val.ToObject<AddToProjectConfirmationCard.AddToProjectCardActionValue>();
            var submitData = val["msteams"]["value"];
            payload.submissionId = submitData.Value<string>("submissionId");
            payload.command = submitData.Value<string>("command");
            payload.monthZero = submitData.Value<string>("monthZero");
            payload.monthOne = submitData.Value<string>("monthOne");
            payload.monthTwo = submitData.Value<string>("monthTwo");

            // FROM SAMPLE
            dynamic Data = JObject.Parse(action.Data.ToString());
            var response = new MessagingExtensionActionResponse
            {
                ComposeExtension = new MessagingExtensionResult
                {
                    Type = "botMessagePreview",
                    ActivityPreview = MessageFactory.Attachment(new Attachment
                    {
                        Content = await AddToProjectConfirmationCard.GetCardAsync(turnContext, payload),
                        ContentType = AdaptiveCard.ContentType
                    }) as Activity
                },
                
            };

            return response;

        }

        public async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionBotMessagePreviewEditAsync(
  ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            return await HandleMessagingExtensionFetchTaskAsync(turnContext, action);
        }

        public async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionBotMessagePreviewSendAsync(
          ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
        {
            var activityPreview = action.BotActivityPreview[0];
            var attachmentContent = activityPreview.Attachments[0].Content;
            var previewedCard = JsonConvert.DeserializeObject<AdaptiveCard>(attachmentContent.ToString(),
                    new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore });

            previewedCard.Version = "1.0";

            var responseActivity = Activity.CreateMessageActivity();
            Attachment attachment = new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = previewedCard
            };
            responseActivity.Attachments.Add(attachment);
            await turnContext.SendActivityAsync(responseActivity);

            return new MessagingExtensionActionResponse();
        }
        private string getMapUrl(ConsultingClient client)
        {
            string coordinates = $"{ client.Latitude.ToString() },{ client.Longitude.ToString()}";

            string bingMapsKey = this.configuration["BingMapsAPIKey"];
            string result = $"https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/?{ coordinates }mapSize=450,600&pp={ coordinates }&key={ bingMapsKey }";

            return result;
        }
    }
}
