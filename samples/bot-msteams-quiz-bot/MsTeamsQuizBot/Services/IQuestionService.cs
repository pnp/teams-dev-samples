using MsTeamsQuizBot.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services;
public interface IQuestionService
{
    public Task<Question> CreateQuestionAsync(string quizId, string topic, string language);
}
