using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Cards;
public class AnsweredInstigatorCard : Card<AnsweredInstigator>
{
    public override string Template => """
        {
            "type": "AdaptiveCard",
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.5",
            "body": [
                {
                    "type": "TextBlock",
                    "text": "Your answer has been submitted",
                    "wrap": true,
                    "size": "Medium",
                    "horizontalAlignment": "Center"
                },
                {
                    "type": "Container",
                    "separator": true,
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Options",
                            "wrap": true,
                            "separator": true,
                            "weight": "Bolder",
                            "horizontalAlignment": "Center"
                        },
                        {
                            "type": "TextBlock",
                            "text": "Performing any action will lock answers for the previous question!",
                            "wrap": true,
                            "isSubtle": true,
                            "color": "Warning"
                        },
                        {
                            "type": "ActionSet",
                            "horizontalAlignment": "Center",
                            "actions": [
                                {
                                    "type": "Action.Execute",
                                    "title": "Next Question",
                                    "tooltip": "Go to the next question",
                                    "verb": "next",
                                    "data": {
                                        "quizId": "${quizId}",
                                        "questionId": "${questionId}"
                                    }
                                },
                                {
                                    "type": "Action.Execute",
                                    "title": "Stop Quiz",
                                    "tooltip": "Ends the quiz and will display the results in the chat",
                                    "verb": "stop",
                                    "data": {
                                        "quizId": "${quizId}",
                                        "questionId": "${questionId}"
                                    }
                                }
                            ]
                        }
                    ],
                    "spacing": "Medium"
                }
            ]
        }
        """;
}

public class AnsweredInstigator
{
    public string QuizId { get; set; }
    public string QuestionId { get; set; }
}