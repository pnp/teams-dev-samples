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
public class NextAction : IAdaptiveCardActionHandler
{
    public const string Verb = "next";
    private readonly IQuestionService _questionService;
    private readonly IStateService _stateService;

    public string TriggerVerb => Verb;

    public AdaptiveCardResponse AdaptiveCardResponse => AdaptiveCardResponse.ReplaceForInteractor;

    public NextAction(IQuestionService questionService, IStateService stateService)
    {
        _questionService = questionService;
        _stateService = stateService;
    }

    public async Task<InvokeResponse> HandleActionInvokedAsync(ITurnContext turnContext, object cardData, CancellationToken cancellationToken = default)
    {
        var data = ((JObject)cardData).ToObject<CardData>();

        var previousQuestionTask = _stateService.LockQuestionAsync(data.QuizId, data.QuestionId);
        var quiz = await _stateService.GetQuizAsync(data.QuizId);
        var nextQuestion = await _questionService.CreateQuestionAsync(data.QuizId, quiz.Topic, quiz.Language);
        var setQuestionTask =_stateService.SaveQuestionAsync(nextQuestion);

        var previousQuestion = await previousQuestionTask;

        var activity = new QuestionCard().CreateActivity(new()
        {
            Title = quiz.Topic,
            Description = nextQuestion.Description,
            Answers = nextQuestion.Answers,
            InstigatorId = turnContext.Activity.From.Id,
            QuestionId = nextQuestion.Id,
            QuizId = quiz.Id,
            Previous = new()
            {
                Answer = previousQuestion.CorrectAnswer,
                Description = previousQuestion.Answers[previousQuestion.CorrectAnswer - 'A'],
            },
        });

        await turnContext.SendActivityAsync(activity, cancellationToken);
        await setQuestionTask;

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
