using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Models;
public class Question
{
    internal const string LockedName = "locked";

    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("quizId")]
    public string QuizId { get; set; }
    [JsonProperty("description")]
    public string Description { get; set; }
    [JsonProperty("answers")]
    public string[] Answers { get; set; }
    [JsonProperty("correctAnswer")]
    public char CorrectAnswer { get; set; }
    [JsonProperty(LockedName)]
    public bool Locked { get; set; }
}
