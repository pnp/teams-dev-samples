using AdaptiveCards;
using Microsoft.Bot.Schema;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace TabWithAdpativeCardFlow.Helpers
{
    public static class AttachmentHelper
    {
        public static AdaptiveCard GetCardObject(string jsonContent)
        {
            try
            {
                return AdaptiveCard.FromJson(jsonContent).Card;
            }
            catch(Exception ex)
            {
                return null;
            }
            
        }
        public static Attachment GetAttachment(string jsonContent)
        {
            return new Attachment() { Content = JsonConvert.DeserializeObject(jsonContent), ContentType = AdaptiveCard.ContentType };
        }

        public static AdaptiveCard BuildAttachment(List<AdaptiveElement> elements)
        {
            var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 4));
            card.Body.AddRange(elements);
            return card;
        }

        public static Attachment BuildAttachment2(List<AdaptiveElement> elements)
        {
            var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 4));
            card.Body.AddRange(elements);
            return new Attachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = card
            };
        }
    }
}
