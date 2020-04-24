using AdaptiveCards;
using AdaptiveCards.Templating;
using ConsultingBot.Model;
using Microsoft.Bot.Builder;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.IO;
using System.Reflection;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace ConsultingBot.Cards
{
    public static class AddToProjectCard
    {
        public const string SubmissionId = "AddToProjectSubmit";

        public static async Task<AdaptiveCard> GetCardAsync(ITurnContext turnContext, ConsultingRequestDetails requestDetails)
        {
            var templateJson = String.Empty;
            var assembly = Assembly.GetEntryAssembly();
            var resourceStream = assembly.GetManifestResourceStream("ConsultingBot.Cards.AddToProjectCard.json");
            using (var reader = new StreamReader(resourceStream, Encoding.UTF8))
            {
                templateJson = await reader.ReadToEndAsync();
            }

            requestDetails.monthZero = GetMonthFromNow(0).ToString("MMMM, yyyy");
            requestDetails.monthOne = GetMonthFromNow(1).ToString("MMMM, yyyy");
            requestDetails.monthTwo = GetMonthFromNow(2).ToString("MMMM, yyyy");
            var dataJson = JsonConvert.SerializeObject(requestDetails);

            var transformer = new AdaptiveTransformer();
            var cardJson = transformer.Transform(templateJson, dataJson);

            var result = AdaptiveCard.FromJson(cardJson).Card;
            return result;
        }

        public static async Task<InvokeResponse> OnSubmit(ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var val = turnContext.Activity.Value as JObject;
            var payload = val.ToObject<AddToProjectConfirmationCard.AddToProjectCardActionValue>();

            if (payload.command == "submit")
            {
                var card = await AddToProjectConfirmationCard.GetCardAsync(turnContext, payload);
                var newActivity = MessageFactory.Attachment(card.ToAttachment());
                newActivity.Id = turnContext.Activity.ReplyToId;
                await turnContext.UpdateActivityAsync(newActivity, cancellationToken);

                return new InvokeResponse() { Status = 200 };
            }
            else
            {
                var newActivity = MessageFactory.Text("Cancelled request");
                newActivity.Id = turnContext.Activity.ReplyToId;
                await turnContext.UpdateActivityAsync(newActivity, cancellationToken);

                return new InvokeResponse() { Status = 200 };
            }
        }

        // GetMonthFromNow() - returns the 1st of the month +/- delta months
        private static DateTime GetMonthFromNow(int delta)
        {
            var now = DateTime.Now;
            var month = ((now.Month - 1 + delta) % 12) + 1;
            var year = (now.Year + (month < now.Month ? 1 : 0));
            return new DateTime(year, month, 1);
        }

    }
}
