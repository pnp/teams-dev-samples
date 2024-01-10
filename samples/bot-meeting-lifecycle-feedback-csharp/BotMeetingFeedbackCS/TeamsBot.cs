using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Builder.Teams;
using Newtonsoft.Json;
using BotMeetingFfeedbackCS.Controllers;
using Microsoft.AspNetCore.Hosting.Server;
using Microsoft.AspNetCore.Hosting.Server.Features;
using Microsoft.Bot.Schema.Teams;
using BotMeetingFfeedbackCS.Model;
using Microsoft.Graph.Models;

namespace BotMeetingFfeedbackCS
{
    public class TeamsBot : TeamsActivityHandler
    {
        string _appId;
        private string _appPassword;
        protected string _hosturl;
        public TeamsBot(IConfiguration config, IServer server)
        {
            _appId = config["MicrosoftAppId"];
            _appPassword = config["MicrosoftAppPassword"];
            _hosturl = config["BotEndpoint"];
        }
        protected override async Task OnTeamsMeetingStartAsync(Microsoft.Bot.Schema.Teams.MeetingStartEventDetails meeting, Microsoft.Bot.Builder.ITurnContext<Microsoft.Bot.Schema.IEventActivity> turnContext, System.Threading.CancellationToken cancellationToken)
        {
            // Start ignored by sampple
            // await turnContext.SendActivityAsync("Meeting started");
        }

        protected override async Task OnTeamsMeetingEndAsync(Microsoft.Bot.Schema.Teams.MeetingEndEventDetails meeting, Microsoft.Bot.Builder.ITurnContext<Microsoft.Bot.Schema.IEventActivity> turnContext, System.Threading.CancellationToken cancellationToken)
        {
            AdaptiveCardsController adc = new AdaptiveCardsController(_hosturl);
            IMessageActivity initialCard = adc.GetInitialFeedback(meeting.Id);

            await turnContext.SendActivityAsync(initialCard);
        }

        protected override async Task<AdaptiveCardInvokeResponse> OnAdaptiveCardInvokeAsync(ITurnContext<IInvokeActivity> turnContext, AdaptiveCardInvokeValue invokeValue, CancellationToken cancellationToken)
        {
            string dataJson = invokeValue.Action.Data.ToString();
            Feedback feedback = JsonConvert.DeserializeObject<Feedback>(dataJson);            
            string verb = invokeValue.Action.Verb;
            AdaptiveCardsController adc = new AdaptiveCardsController(_hosturl);
            if (verb == "alreadyVoted")
            {
                if (feedback.votedPersons.Contains(turnContext.Activity.From.AadObjectId))
                {
                    IMessageActivity deativatedCard = adc.GetDeactivatedFeedback(feedback);
                    deativatedCard.Id = turnContext.Activity.ReplyToId;
                    await turnContext.UpdateActivityAsync(deativatedCard);
                }
                else
                {
                    // User did not vote, yet
                    IMessageActivity currentCard = adc.GetCurentFeedback(feedback);
                    currentCard.Id = turnContext.Activity.ReplyToId;
                    await turnContext.UpdateActivityAsync(currentCard);
                }                
            }
            else
            {
                switch (verb)
                {
                    case "vote_1":
                        feedback.votes1 += 1;
                        break;
                    case "vote_2":
                        feedback.votes2 += 1;
                        break;
                    case "vote_3":
                        feedback.votes3 += 1;
                        break;
                    case "vote_4":
                        feedback.votes4 += 1;
                        break;
                    case "vote_5":
                        feedback.votes5 += 1;
                        break;
                }
                List<string> voters = new List<string>(feedback.votedPersons);
                voters.Add(turnContext.Activity.From.AadObjectId);
                feedback.votedPersons = voters.ToArray();
                
                IMessageActivity deativatedCard = adc.GetDeactivatedFeedback(feedback);
                deativatedCard.Id = turnContext.Activity.ReplyToId;
                await turnContext.UpdateActivityAsync(deativatedCard);
            }
            return new AdaptiveCardInvokeResponse
            {
                StatusCode = 200
            }; 
        }
    }
}
