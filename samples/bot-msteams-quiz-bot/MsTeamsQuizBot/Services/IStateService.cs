using MsTeamsQuizBot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services;
public interface IStateService
{
    public Task<Question> GetQuestionAsync(string quizId, string questionId);
    public Task<Quiz> GetQuizAsync(string quizId);
    public Task<QuizResults> GetQuizResultsAsync(string quizId);
    public Task<Question> LockQuestionAsync(string quizId, string questionId);
    public Task SaveAnswerAsync(Answer answer);
    public Task SaveQuestionAsync(Question question);
    public Task SaveQuizAsync(Quiz quiz);
}
