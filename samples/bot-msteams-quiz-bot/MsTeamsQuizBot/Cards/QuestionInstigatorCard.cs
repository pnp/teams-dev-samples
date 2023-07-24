using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Cards;
internal class QuestionInstigatorCard : Card<NextQuestion>
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
                    "text": "${title}",
                    "horizontalAlignment": "Center",
                    "wrap": true
                },
                {
                    "type": "TextBlock",
                    "size": "Default",
                    "text": "${description}",
                    "wrap": true
                },
                {
                    "type": "FactSet",
                    "facts": [
                        {
                            "title": "A)",
                            "value": "${answers[0]}"
                        },
                        {
                            "title": "B)",
                            "value": "${answers[1]}"
                        },
                        {
                            "title": "C)",
                            "value": "${answers[2]}"
                        },
                        {
                            "title": "D)",
                            "value": "${answers[3]}"
                        }
                    ]
                },
                {
                    "type": "ColumnSet",
                    "columns": [
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "ActionSet",
                                    "actions": [
                                        {
                                            "type": "Action.Execute",
                                            "title": "A",
                                            "verb": "answer-instigator",
                                            "data": {
                                                "answer": "A",
                                                "questionId": "${questionId}",
                                                "quizId": "${quizId}"
                                            },
                                            "style": "positive"
                                        }
                                    ],
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "ActionSet",
                                    "actions": [
                                        {
                                            "type": "Action.Execute",
                                            "title": "B",
                                            "verb": "answer-instigator",
                                            "data": {
                                                "answer": "B",
                                                "questionId": "${questionId}",
                                                "quizId": "${quizId}"
                                            },
                                            "style": "positive"
                                        }
                                    ],
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "ActionSet",
                                    "actions": [
                                        {
                                            "type": "Action.Execute",
                                            "title": "C",
                                            "verb": "answer-instigator",
                                            "data": {
                                                "answer": "C",
                                                "questionId": "${questionId}",
                                                "quizId": "${quizId}"
                                            },
                                            "style": "positive"
                                        }
                                    ],
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        },
                        {
                            "type": "Column",
                            "width": "stretch",
                            "items": [
                                {
                                    "type": "ActionSet",
                                    "actions": [
                                        {
                                            "type": "Action.Execute",
                                            "title": "D",
                                            "verb": "answer-instigator",
                                            "data": {
                                                "answer": "D",
                                                "questionId": "${questionId}",
                                                "quizId": "${quizId}"
                                            },
                                            "style": "positive"
                                        }
                                    ],
                                    "horizontalAlignment": "Center"
                                }
                            ]
                        }
                    ]
                },
                {
                    "type": "Container",
                    "$when": "${$root.previous.answer != 'X'}",
                    "items": [
                        {
                            "type": "TextBlock",
                            "text": "Previous answer",
                            "wrap": true,
                            "weight": "Bolder",
                            "horizontalAlignment": "Center"
                        },
                        {
                            "type": "FactSet",
                            "facts": [
                                {
                                    "title": "${previous.answer}",
                                    "value": "${previous.description}"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
        """;
}
