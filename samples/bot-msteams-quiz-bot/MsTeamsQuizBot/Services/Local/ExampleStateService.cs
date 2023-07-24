using MsTeamsQuizBot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services.Local;
internal class ExampleStateService : IStateService
{
    public Task<Question> GetQuestionAsync(string quizId, string questionId)
    {
        throw new NotImplementedException();
    }

    public Task<Quiz> GetQuizAsync(string quizId)
    {
        throw new NotImplementedException();
    }

    public Task<QuizResults> GetQuizResultsAsync(string quizId)
    {
        return Task.FromResult(new QuizResults()
        {
            QuizId = quizId,
            UserResults = new UserResult[]
            {
                new()
                {
                    Name = "Jane",
                    Score = 10,
                },
                new()
                {
                    Name = "John",
                    Score = 8,
                },
                new()
                {
                    Name = "Janice",
                    Score = 7,
                },
                new()
                {
                    Name = "James",
                    Score = 5,
                },
                new()
                {
                    Name = "Jot",
                    Score = 5,
                },
            },
        });
    }

    public Task<Question> LockQuestionAsync(string quizId, string questionId)
    {
        return Task.FromResult(new Question()
        {
            Id = questionId,
            Answers = new[] { "1", "2", "3", "4" },
            Description = "Example description",
            CorrectAnswer = 'B',
        });
    }

    public Task SaveAnswerAsync(Answer answer)
    {
        return Task.CompletedTask;
    }

    public Task SaveQuestionAsync(Question question)
    {
        return Task.CompletedTask;
    }

    public Task SaveQuizAsync(Quiz quiz)
    {
        return Task.CompletedTask;
    }
}
