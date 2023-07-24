using Microsoft.Bot.Builder;
using Microsoft.TeamsFx.Conversation;
using MsTeamsQuizBot.Cards;
using MsTeamsQuizBot.Services;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Actions;
public class ForwardInstigatorAction : IAdaptiveCardActionHandler
{
    public const string Verb = "forward-instigator";

    public string TriggerVerb => Verb;

    public AdaptiveCardResponse AdaptiveCardResponse => AdaptiveCardResponse.ReplaceForInteractor;

    public Task<InvokeResponse> HandleActionInvokedAsync(ITurnContext turnContext, object cardData, CancellationToken cancellationToken = default)
    {
        var data = ((JObject)cardData).ToObject<CardData>();

        var response = new QuestionInstigatorCard().CreateResponse(new()
        {
            Title = data.Title,
            Description = data.Description,
            Answers = data.Answers,
            QuizId = data.QuizId,
            QuestionId = data.QuestionId,
            InstigatorId = data.InstigatorId,
            Previous = data.Previous,
        });

        return Task.FromResult(response);
    }

    private class CardData
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public IEnumerable<string> Answers { get; set; }
        public string InstigatorId { get; set; }
        public string QuizId { get; set; }
        public string QuestionId { get; set; }
        public PreviousAnswer Previous { get; set; }
    }
}
