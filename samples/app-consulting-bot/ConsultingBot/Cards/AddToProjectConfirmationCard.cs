using AdaptiveCards;
using AdaptiveCards.Templating;
using ConsultingBot.Model;
using Microsoft.Bot.Builder;
using Newtonsoft.Json;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace ConsultingBot.Cards
{
    public static class AddToProjectConfirmationCard
    {
        public class AddToProjectCardActionValue : ConsultingRequest, ICardActionValue
        {
            public string submissionId { get; set; }
            public string command { get; set; }
        }

        public static async Task<AdaptiveCard> GetCardAsync(ITurnContext turnContext, AddToProjectCardActionValue payload)
        {
            var templateJson = String.Empty;
            var assembly = Assembly.GetEntryAssembly();
            var resourceStream = assembly.GetManifestResourceStream("ConsultingBot.Cards.AddToProjectConfirmationCard.json");
            using (var reader = new StreamReader(resourceStream, Encoding.UTF8))
            {
                templateJson = await reader.ReadToEndAsync();
            }

            var dataJson = JsonConvert.SerializeObject(payload);

            var transformer = new AdaptiveTransformer();
            var cardJson = transformer.Transform(templateJson, dataJson);

            return AdaptiveCard.FromJson(cardJson).Card;

        }


    }
}
