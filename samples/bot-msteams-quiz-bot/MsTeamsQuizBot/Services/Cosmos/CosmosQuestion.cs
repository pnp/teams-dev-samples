using MsTeamsQuizBot.Models;
using Newtonsoft.Json;
using System;

namespace MsTeamsQuizBot.Services.Cosmos;

public class CosmosQuestion : Question
{
    [JsonProperty("type")]
    public string Type { get; } = CosmosTypes.Question;
}