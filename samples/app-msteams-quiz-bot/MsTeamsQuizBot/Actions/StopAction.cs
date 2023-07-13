using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.TeamsFx.Conversation;
using MsTeamsQuizBot.Cards;
using MsTeamsQuizBot.Models;
using MsTeamsQuizBot.Services;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Actions;
public class StopAction : IAdaptiveCardActionHandler
{
    public const string Verb = "stop";
    private readonly IStateService _stateService;

    public string TriggerVerb => Verb;

    public AdaptiveCardResponse AdaptiveCardResponse => AdaptiveCardResponse.ReplaceForInteractor;

    public StopAction(IStateService stateService)
    {
        _stateService = stateService;
    }

    public async Task<InvokeResponse> HandleActionInvokedAsync(ITurnContext turnContext, object cardData, CancellationToken cancellationToken = default)
    {
        var data = ((JObject)cardData).ToObject<CardData>();

        var previousQuestionTask = _stateService.LockQuestionAsync(data.QuizId, data.QuestionId);
        var results = await _stateService.GetQuizResultsAsync(data.QuizId);

        var activity = new RankingCard().CreateActivity(new()
        {
            Ranking = results
                .UserResults
                .Take(10) //top 10 only
                .Select(x => new Entry() { Name = x.Name, Score = x.Score }),
        });

        await turnContext.SendActivityAsync(activity, cancellationToken);
        await previousQuestionTask;

        var response = new StatusCard().CreateResponse(new()
        {
            Text = "Your action has been registered"
        });
        return response;
    }

    private class CardData
    {
        public string QuizId { get; set; }
        public string QuestionId { get; set; }
    }
}

