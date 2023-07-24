using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
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
public class AnswerAction : IAdaptiveCardActionHandler
{
    public const string Verb = "answer";
    private readonly IStateService _stateService;

    public string TriggerVerb => Verb;

    public AdaptiveCardResponse AdaptiveCardResponse => AdaptiveCardResponse.ReplaceForInteractor;

    public AnswerAction(IStateService stateService)
    {
        _stateService = stateService;
    }

    public async Task<InvokeResponse> HandleActionInvokedAsync(ITurnContext turnContext, object cardData, CancellationToken cancellationToken = default)
    {
        var data = ((JObject)cardData).ToObject<CardData>();

       var question = await _stateService.GetQuestionAsync(data.QuizId, data.QuestionId);

        if (question is null)
        {
            return new StatusCard().CreateResponse(new()
            {
                Text = "Oops! Something went wrong"
            });
        }
        else if (question.Locked)
        {
            return new StatusCard().CreateResponse(new()
            {
                Text = "You submitted your answer too late 😥"
            });
        }
        else
        {
            await _stateService.SaveAnswerAsync(new Models.Answer()
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = data.QuizId,
                QuestionId = data.QuestionId,
                UserAnswer = data.Answer,
                UserId = turnContext.Activity.From.Id,
                UserName = turnContext.Activity.From.Name,
            });
            return new StatusCard().CreateResponse(new()
            {
                Text = "Your answer has been submitted!"
            });
        }
    }

    private class CardData
    {
        public char Answer { get; set; }
        public string QuizId { get; set; }
        public string QuestionId { get; set; }
    }
}