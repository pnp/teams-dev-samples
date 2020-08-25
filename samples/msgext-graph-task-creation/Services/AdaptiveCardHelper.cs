// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.9.1
using System.Collections.Generic;
using AdaptiveCards;
using Newtonsoft.Json.Linq;
using AdaptiveCards;
using Bot.Builder.Community.Samples.Teams.Models;

namespace Bot.Builder.Community.Samples.Teams.Services
{
    public static class AdaptiveCardHelper
    {
        public static ExampleData CreateExampleData(AdaptiveCard adaptiveCard)
        {
            string userText = (adaptiveCard.Body[1] as AdaptiveTextBlock).Text;
            var choiceSet = adaptiveCard.Body[3] as AdaptiveChoiceSetInput;

            return new ExampleData
            {
                Question = userText,
                MultiSelect = choiceSet.IsMultiSelect ? "true" : "false",
                Option1 = choiceSet.Choices[0].Title,
                Option2 = choiceSet.Choices[1].Title,
                Option3 = choiceSet.Choices[2].Title,
            };
        }

        [System.Obsolete]
        public static AdaptiveCard CreateAdaptiveCardEditor(ExampleData exampleData)
        {
            var cardData = exampleData ?? new ExampleData();

            return new AdaptiveCard
            {
                Body = new List<AdaptiveElement>
                {
                    new AdaptiveTextBlock("Create a new task")
                    {
                        Weight = AdaptiveTextWeight.Bolder,
                    },
                    new AdaptiveTextBlock("Which type of task would you like to create?"),
                    new AdaptiveTextBlock() { Id = "TitleText", Text = "Task title", IsVisible = false },
                    new AdaptiveTextInput() { Id = "Title", Placeholder = "Task", IsVisible = false, IsRequired = true},
                    new AdaptiveDateInput() { Id = "StartDate", IsVisible = false, IsRequired = true, Placeholder = "Start date"},
                    new AdaptiveDateInput() { Id = "DueDate", IsVisible = false, IsRequired = true, Placeholder = "Due date"},
                    new AdaptiveChoiceSetInput
                    {
                        Type = AdaptiveChoiceSetInput.TypeName,
                        Id = "Choices",
                        IsVisible = false,
                        IsMultiSelect = bool.Parse(exampleData.MultiSelect),
                        Value = "Pick a plan",
                        Choices = new List<AdaptiveChoice>
                        {
                            new AdaptiveChoice() { Title = exampleData.Option1, Value = exampleData.Option1Value },
                            new AdaptiveChoice() { Title = exampleData.Option2, Value = exampleData.Option2Value },
                            new AdaptiveChoice() { Title = exampleData.Option3, Value = exampleData.Option3Value },
                            new AdaptiveChoice() { Title = exampleData.Option4, Value = exampleData.Option4Value },
                            new AdaptiveChoice() { Title = exampleData.Option5, Value = exampleData.Option5Value },
                        },
                    },
                    new AdaptiveActionSet()
                    {
                        Id = "SubmitTodoAction",
                        IsVisible = false,
                        Actions = new List<AdaptiveAction>
                        {
                            new AdaptiveSubmitAction
                            {
                                Type = AdaptiveSubmitAction.TypeName,
                                Title = "Create Todo task",
                                Id = "SubmitTodo",
                                Data = new JObject { { "Type", "todo" } },
                            },
                        },
                    },
                    new AdaptiveActionSet()
                    {
                        Id = "SubmitPlannerAction",
                        IsVisible = false,
                        Actions = new List<AdaptiveAction>
                        {
                            new AdaptiveSubmitAction
                            {
                                Type = AdaptiveSubmitAction.TypeName,
                                Title = "Create Planner task",
                                Id = "SubmitPlanner",
                                Data = new JObject { { "Type", "planner" } },
                            },
                        },
                    }
                },
                Actions = new List<AdaptiveAction>
                {
                    new AdaptiveToggleVisibilityAction
                    {
                        Type = AdaptiveToggleVisibilityAction.TypeName,
                        Title = "Todo Task",
                        TargetElements = new List<AdaptiveTargetElement>
                        {
                            new AdaptiveTargetElement(){ElementId = "TitleText", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "Title", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "StartDate", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "DueDate", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "SubmitTodoAction", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "Choices", IsVisible = false},
                            new AdaptiveTargetElement(){ElementId = "SubmitPlannerAction", IsVisible = false}
                        }
                    },
                    new AdaptiveToggleVisibilityAction
                    {
                        Type = AdaptiveToggleVisibilityAction.TypeName,
                        Title = "Planner Task",
                        TargetElements = new List<AdaptiveTargetElement>
                        {
                            new AdaptiveTargetElement(){ElementId = "TitleText", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "Title", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "StartDate", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "DueDate", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "Choices", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "SubmitPlannerAction", IsVisible = true},
                            new AdaptiveTargetElement(){ElementId = "SubmitTodoAction", IsVisible = false},
                        }
                    },
                },
            };
        }

        public static IList<IList<T>> SplitList<T>(this IList<T> list, int chunkSize)
        {
            var chunks = new List<IList<T>>();
            List<T> chunk = null;
            for (var i = 0; i < list.Count; i++)
            {
                if (i % chunkSize == 0)
                {
                    chunk = new List<T>(chunkSize);
                    chunks.Add(chunk);
                }
                chunk.Add(list[i]);
            }
            return chunks;
        }
    }
}