using Microsoft.Extensions.Caching.Memory;
using MsTeamsQuizBot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services.Local;
internal class MemoryCacheStateService<T> : IStateService where T : IStateService
{
    private readonly IStateService _service;
    private readonly MemoryCache _cache;
    private readonly MemoryCacheEntryOptions _options;

    public MemoryCacheStateService(T service)
    {
        _service = service;
        _cache = new MemoryCache(new MemoryCacheOptions()
        {
            CompactionPercentage = 0.25,
            ExpirationScanFrequency = TimeSpan.FromMinutes(1),
            SizeLimit = 10_000,
        });
        _options = new MemoryCacheEntryOptions()
        {
            SlidingExpiration = TimeSpan.FromMinutes(30),
            Size = 1,
        };
    }

    public async Task<Question> GetQuestionAsync(string quizId, string questionId)
    {
        if (_cache.TryGetValue(questionId, out var result) && result is Question cachedQuestion)
        {
            return cachedQuestion;
        }
        else
        {
            var question = await _service.GetQuestionAsync(quizId, questionId);
            _cache.Set(questionId, question, _options);
            return question;
        }
    }

    public async Task<Quiz> GetQuizAsync(string quizId)
    {
        if (_cache.TryGetValue(quizId, out var result) && result is Quiz cachedQuiz)
        {
            return cachedQuiz;
        }
        else
        {
            var quiz = await _service.GetQuizAsync(quizId);
            _cache.Set(quizId, quiz, _options);
            return quiz;
        }
    }

    public async Task<QuizResults> GetQuizResultsAsync(string quizId)
    {
        return await _service.GetQuizResultsAsync(quizId);
    }

    public async Task<Question> LockQuestionAsync(string quizId, string questionId)
    {
        var lockTask = _service.LockQuestionAsync(quizId, questionId);
        if (_cache.TryGetValue(questionId, out var result) && result is Question cachedQuestion)
        {
            cachedQuestion.Locked = true;
        }
        return await lockTask;
    }

    public async Task SaveAnswerAsync(Answer answer)
    {
        await _service.SaveAnswerAsync(answer);
        _cache.Set(answer.Id, answer, _options);
    }

    public async Task SaveQuestionAsync(Question question)
    {
        await _service.SaveQuestionAsync(question);
        _cache.Set(question.Id, question, _options);
    }

    public async Task SaveQuizAsync(Quiz quiz)
    {
        await _service.SaveQuizAsync(quiz);
        _cache.Set(quiz.Id, quiz, _options);
    }
}
