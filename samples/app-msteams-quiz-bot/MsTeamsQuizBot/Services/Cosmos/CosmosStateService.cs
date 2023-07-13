using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Bot.Configuration;
using Microsoft.Extensions.Options;
using MsTeamsQuizBot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services.Cosmos;
internal class CosmosStateService : IStateService
{
    private readonly Container _container;
    private readonly CosmosClient _client;

    public CosmosStateService(IOptions<CosmosSettings> options)
    {
        var settings = options.Value;
        _client = new CosmosClient(settings.Endpoint, settings.Key, new()
        {
            ConnectionMode = ConnectionMode.Gateway,
            ConsistencyLevel = ConsistencyLevel.Eventual,
            SerializerOptions = new()
            {
                IgnoreNullValues = true,
            },
        });
        _container = _client.GetContainer(settings.Database, settings.Container);
    }

    public async Task<Question> GetQuestionAsync(string quizId, string questionId)
    {
        try
        {
            return await _container.ReadItemAsync<CosmosQuestion>(questionId, new(quizId));
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<Quiz> GetQuizAsync(string quizId)
    {
        try
        {
            return await _container.ReadItemAsync<CosmosQuiz>(quizId, new(quizId));
        }
        catch (CosmosException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            return null;
        }
    }

    public async Task<QuizResults> GetQuizResultsAsync(string quizId)
    {
        var questionIterator = _container
            .GetItemLinqQueryable<CosmosQuestion>(requestOptions: new() { PartitionKey = new(quizId) })
            .Where(x => x.Type == "question")
            .ToFeedIterator();

        var questions = new Dictionary<string, CosmosQuestion>();

        while (questionIterator.HasMoreResults)
        {
            foreach (var question in await questionIterator.ReadNextAsync())
            {
                questions[question.Id] = question;
            }
        }

        var answerIterator = _container
            .GetItemLinqQueryable<CosmosAnswer>(requestOptions: new() { PartitionKey = new(quizId) })
            .Where(x => x.Type == "answer")
            .ToFeedIterator();

        var users = new Dictionary<string, UserResult>();

        while (answerIterator.HasMoreResults)
        {
            foreach (var answer in await answerIterator.ReadNextAsync())
            {
                var correctAnswer = questions.TryGetValue(answer.QuestionId, out var question) && question.CorrectAnswer == answer.UserAnswer;

                if (users.TryGetValue(answer.UserId, out var user))
                {
                    user.Score += correctAnswer ? 1 : 0;
                }
                else
                {
                    users[answer.UserId] = new()
                    {
                        Name = answer.UserName,
                        Score = correctAnswer ? 1 : 0,
                    };
                }
            }
        }

        return new QuizResults()
        {
            QuizId = quizId,
            UserResults = users
                .Values
                .OrderByDescending(x => x.Score)
                .ToList(),
        };
    }

    public async Task<Question> LockQuestionAsync(string quizId, string questionId)
    {
        var patchOperations = new List<PatchOperation>()
        {
            PatchOperation.Set($"/{Question.LockedName}", true),
        };

        return await _container.PatchItemAsync<CosmosQuestion>(questionId, new(quizId), patchOperations);
    }

    public async Task SaveAnswerAsync(Answer answer)
    {
        var cosmosAnswer = new CosmosAnswer()
        {
            Id = answer.Id,
            QuestionId = answer.QuestionId,
            QuizId = answer.QuizId,
            UserAnswer = answer.UserAnswer,
            UserId = answer.UserId,
            UserName = answer.UserName,
        };

        await _container.UpsertItemAsync(cosmosAnswer, new(cosmosAnswer.QuizId), requestOptions: new() { EnableContentResponseOnWrite = false });
    }

    public async Task SaveQuestionAsync(Question question)
    {
        var cosmosQuestion = new CosmosQuestion()
        {
            Id = question.Id,
            QuizId = question.QuizId,
            Answers = question.Answers,
            CorrectAnswer = question.CorrectAnswer,
            Description = question.Description,
            Locked = question.Locked,
        };

        await _container.UpsertItemAsync(cosmosQuestion, new(cosmosQuestion.QuizId), requestOptions: new() { EnableContentResponseOnWrite = false });
    }

    public async Task SaveQuizAsync(Quiz quiz)
    {
        var cosmosQuiz = new CosmosQuiz()
        {
            Id = quiz.Id,
            Language = quiz.Language,
            Topic = quiz.Topic,
        };

        await _container.UpsertItemAsync(cosmosQuiz, new(cosmosQuiz.QuizId), requestOptions: new() { EnableContentResponseOnWrite = false });
    }
}
