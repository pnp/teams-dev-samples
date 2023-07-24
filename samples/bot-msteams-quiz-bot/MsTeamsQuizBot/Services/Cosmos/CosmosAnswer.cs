using MsTeamsQuizBot.Models;
using Newtonsoft.Json;

namespace MsTeamsQuizBot.Services.Cosmos;

public class CosmosAnswer : Answer
{
    [JsonProperty("type")]
    public string Type { get; } = CosmosTypes.Answer;
}