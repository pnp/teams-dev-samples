using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Models;
public class Answer
{
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("quizId")]
    public string QuizId { get; set; }
    [JsonProperty("questionId")]
    public string QuestionId { get; set; }
    [JsonProperty("userId")]
    public string UserId { get; set; }
    [JsonProperty("userAnswer")]
    public char UserAnswer { get; set; }
    [JsonProperty("userName")]
    public string UserName { get; set; }
}
