using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Cards;
public class StartQuizCard : Card<StartQuiz>
{
    public override string Template => """
        {
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "type": "AdaptiveCard",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "size": "Medium",
                    "weight": "Bolder",
                    "text": "Start a Quiz",
                    "horizontalAlignment": "Center",
                    "wrap": true
                },
                {
                    "type": "Input.Text",
                    "id": "topic",
                    "label": "Select a topic",
                    "isRequired": true,
                    "errorMessage": "Topic is required"
                },
                {
                    "type": "Input.Text",
                    "id": "language",
                    "label": "Select a language",
                    "placeholder": "English"
                }
            ],
            "actions": [
                {
                    "type": "Action.Execute",
                    "title": "Start",
                    "verb": "quiz",
                    "data": {}
                }
            ]
        }
        """;
}

public class StartQuiz { }