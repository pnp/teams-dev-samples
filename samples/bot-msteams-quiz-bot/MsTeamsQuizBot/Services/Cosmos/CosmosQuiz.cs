using MsTeamsQuizBot.Models;
using Newtonsoft.Json;

namespace MsTeamsQuizBot.Services.Cosmos;

public class CosmosQuiz : Quiz
{
    [JsonProperty("type")]
    public string Type { get; } = CosmosTypes.Quiz;
    [JsonProperty("quizId")]
    public string QuizId { get => Id; }
}