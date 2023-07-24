using Microsoft.Extensions.Options;
using MsTeamsQuizBot.Models;
using OpenAI;
using OpenAI.Managers;
using OpenAI.ObjectModels.RequestModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services.OpenAi;
public class OpenAiQuestionService : IQuestionService
{
    private readonly OpenAIService _client;

    public OpenAiQuestionService(IOptions<OpenAiOptions> options, HttpClient httpClient)
    {
        _client = new OpenAIService(options, httpClient);
    }

    public async Task<Question> CreateQuestionAsync(string quizId, string topic, string language)
    {
        var question = $"""
            Ask a multiple choice question about the topic '{topic}'{(string.IsNullOrEmpty(language) ? "" : $" using '{language}' as language")}.
            Use the following format ONLY:
            [question]

            A) [answer]
            B) [answer]
            C) [answer]
            D) [answer]

            Correct answer: [A|B|C|D]
            """;

        var maxAttempts = 3;
        for (var i = 0; i < maxAttempts; i ++)
        {
            var response = await _client.CreateCompletion(
                new ChatCompletionCreateRequest()
                {
                    Messages = new List<ChatMessage>()
                    {
                        ChatMessage.FromSystem("You are a quiz master"),
                        ChatMessage.FromUser(question),
                    },
                    Model = OpenAI.ObjectModels.Models.ChatGpt3_5Turbo,
                    MaxTokens = 1024,
                    Temperature = 1.5f,
                    FrequencyPenalty = 1.0f,
                });

            if (!response.Successful)
            {
                continue;
            }

            var questionText = response.Choices.First().Message.Content;

            var regex = Regex.Match(
                questionText,
                @"(.*?)\s*A\)(.*?)\s*B\)(.*?)\s*C\)(.*?)\s*D\)(.*?)\s*Correct answer:.*?([A-D])", 
                RegexOptions.Multiline | RegexOptions.IgnoreCase);

            if (!regex.Success)
            {
                continue;
            }

            return new Question()
            {
                Id = Guid.NewGuid().ToString(),
                QuizId = quizId,
                Description = regex.Groups[1].Value,
                Answers = new[]
                {
                    regex.Groups[2].Value,
                    regex.Groups[3].Value,
                    regex.Groups[4].Value,
                    regex.Groups[5].Value,
                },
                CorrectAnswer = regex.Groups[6].Value[0],
            };
        }

        throw new Exception("Unable to generate question");
    }
}
