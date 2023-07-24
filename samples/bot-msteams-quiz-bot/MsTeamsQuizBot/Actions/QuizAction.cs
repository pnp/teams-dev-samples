using Microsoft.Bot.Builder;
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
internal class QuizAction : IAdaptiveCardActionHandler
{
    public const string Verb = "quiz";
    private readonly IQuestionService _questionService;
    private readonly IStateService _stateService;

    public string TriggerVerb => Verb;

    public AdaptiveCardResponse AdaptiveCardResponse => AdaptiveCardResponse.ReplaceForAll;

    public QuizAction(IQuestionService questionService, IStateService stateService)
    {
        _questionService = questionService;
        _stateService = stateService;
    }

    public async Task<InvokeResponse> HandleActionInvokedAsync(ITurnContext turnContext, object cardData, CancellationToken cancellationToken = default)
    {
        var data = ((JObject)cardData).ToObject<CardData>();

        data.Topic = "Video Games";

        var quiz = new Quiz()
        {
            Id = Guid.NewGuid().ToString(),      
            Topic = data.Topic,
            Language = data.Language,
        };

        var tasks = new List<Task>
        {
            _stateService.SaveQuizAsync(quiz)
        };
        var question = await _questionService.CreateQuestionAsync(quiz.Id, quiz.Topic, quiz.Language);
        tasks.Add(_stateService.SaveQuestionAsync(question));

        var response = new QuestionCard().CreateResponse(new()
        {
            QuizId = quiz.Id,
            QuestionId = question.Id,
            Title = quiz.Topic,
            Description = question.Description,
            Answers = question.Answers,
            InstigatorId = turnContext.Activity.From.Id,
        });

        await Task.WhenAll(tasks);
        return response;
    }

    private class CardData
    {
        public string Topic { get; set; }
        public string Language { get; set; }
    }
}
