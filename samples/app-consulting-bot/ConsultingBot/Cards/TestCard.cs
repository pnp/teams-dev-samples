using System.Collections.Generic;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Newtonsoft.Json.Linq;

namespace ConsultingBot.Cards
{
    public class TestCardx
    {
        //public Attachment GetCardAttachment(ITurnContext turnContext)
        //{
        //    var teamsContext = turnContext.TurnState.Get<ITeamsContext>();
        //    TaskModuleRequest query = teamsContext.GetTaskModuleRequestData();
        //    string textValue = null;

        //    if (query.Data != null)
        //    {
        //        var data = JObject.FromObject(query.Data);
        //        textValue = data["userText"]?.ToString();
        //    }

        //    return this.GetResponseCard(query, textValue);
        //}

        // Builds the response card displayed in the task module
        public Attachment GetCard(TaskModuleRequest query, string textValue)
        {
            AdaptiveCards.AdaptiveCard adaptiveCard = new AdaptiveCards.AdaptiveCard();

            adaptiveCard.Body.Add(new AdaptiveCards.AdaptiveTextBlock("Your Request:")
            {
                Size = AdaptiveCards.AdaptiveTextSize.Large,
                Weight = AdaptiveCards.AdaptiveTextWeight.Bolder,
            });

            adaptiveCard.Body.Add(new AdaptiveCards.AdaptiveContainer()
            {
                Style = AdaptiveCards.AdaptiveContainerStyle.Emphasis,
                Items = new List<AdaptiveCards.AdaptiveElement>
                {
                    new AdaptiveCards.AdaptiveTextBlock(JObject.FromObject(query).ToString())
                    {
                        Wrap = true,
                    },
                },
            });

            adaptiveCard.Body.Add(new AdaptiveCards.AdaptiveTextInput()
            {
                Id = "userText",
                Placeholder = "Type text here...",
                Value = textValue,
            });

            adaptiveCard.Actions.Add(new AdaptiveCards.AdaptiveSubmitAction()
            {
                Title = "Next",
                Data = JObject.Parse(@"{ ""done"": false }"),
            });

            adaptiveCard.Actions.Add(new AdaptiveCards.AdaptiveSubmitAction()
            {
                Title = "Submit",
                Data = JObject.Parse(@"{ ""done"": true }"),
            });

            return adaptiveCard.ToAttachment();
        }


    }
}
