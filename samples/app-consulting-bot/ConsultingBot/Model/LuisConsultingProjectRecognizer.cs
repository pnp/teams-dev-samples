using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using ConsultingBot.Model;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.AI.Luis;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Recognizers.Text;
using Microsoft.Recognizers.Text.DateTime;
using Microsoft.Recognizers.Text.Number;
using Newtonsoft.Json.Linq;

namespace ConsultingBot
{
    public static class LuisConsultingProjectRecognizer
    {
        public static async Task<ConsultingRequestDetails> ExecuteQuery(IConfiguration configuration, ILogger logger, ITurnContext turnContext, CancellationToken cancellationToken)
        {
            var result = new ConsultingRequestDetails();

            try
            {
                // Create the LUIS settings from configuration.
                var luisApplication = new LuisApplication(
                    configuration["LuisAppId"],
                    configuration["LuisAPIKey"],
                    "https://" + configuration["LuisAPIHostName"]
                );
                var recognizer = new LuisRecognizer(luisApplication);

                // The actual call to LUIS
                var recognizerResult = await recognizer.RecognizeAsync(turnContext, cancellationToken);
                var (intent, score) = recognizerResult.GetTopScoringIntent();

                // Get all the possible values for each entity from the Entities JObject
                // (GetEntityValueOptions is an extension method, see below)
                var personNameValues = recognizerResult.GetPossibleEntityValues<string>("personName");
                var projectNameValues = recognizerResult.GetPossibleEntityValues<string>("projectName");
                var dateTimeValues = recognizerResult.GetPossibleEntityValues<string>("datetime");
                var dayWorkedValues = recognizerResult.GetPossibleEntityValues<string>("day_worked");
                if (dayWorkedValues.Count == 0) dayWorkedValues = dateTimeValues;
                var timeWorkedValues = recognizerResult.GetPossibleEntityValues<string>("time_worked");
                if (timeWorkedValues.Count == 0) timeWorkedValues = dateTimeValues;

                // Now based on the intent, fill in the result as best we can
                switch (intent)
                {
                    case "AddPersonToProject":
                        {
                            result.intent = Intent.AddToProject;
                            result.personName = personNameValues?.FirstOrDefault();
                            result.projectName = projectNameValues?.FirstOrDefault();
                            break;
                        }
                    case "BillToProject":
                        {
                            result.intent = Intent.BillToProject;
                            result.projectName = projectNameValues?.FirstOrDefault();
                            result.workDate = TryExtractWorkDate(dayWorkedValues);
                            result.workHours = TryExtractWorkHours(timeWorkedValues);
                            break;
                        }
                    default:
                        {
                            result.intent = Intent.Unknown;
                            break;
                        }
                }
            }
            catch (Exception e)
            {
                logger.LogWarning($"LUIS Exception: {e.Message} Check your LUIS configuration.");
            }

            return result;
        }

        private static string TryExtractWorkDate(List<string> possibleValues)
        {
            string timex = null;

            foreach (string val in possibleValues)
            {
                var culture = Culture.English;
                var r = DateTimeRecognizer.RecognizeDateTime(val, culture);
                if (r.Count > 0 && r.First().TypeName.StartsWith("datetimeV2"))
                {
                    var first = r.First();
                    var resolutionValues = (IList<Dictionary<string, string>>)first.Resolution["values"];
                    timex = resolutionValues[0]["timex"];
                }
            }
            return timex;
        }

        private static double TryExtractWorkHours(List<string> possibleValues)
        {
            var hourTokens = new[] { "hours", "hrs", "hr", "h" };
            var minuteTokens = new[] { "minutes", "min", "mn", "m" };
            var result = 0.0;

            foreach (var val in possibleValues)
            {
                var hours = 0.0;
                var hoursMultiplier = 0.0;
                foreach (var token in hourTokens)
                {
                    if (val.ToLower().Contains(token))
                    {
                        hoursMultiplier = 1.0;
                    }
                }

                foreach (var token in minuteTokens)
                {
                    if (val.ToLower().Contains(token))
                    {
                        hoursMultiplier = 1.0 / 60.0;
                    }
                }

                if (double.TryParse(val.Split(' ')[0], out hours))
                {
                    if (result <= 0)
                    {
                        result = hours * hoursMultiplier;
                    }
                }
                else
                {
                    var possibleHours = NumberRecognizer.RecognizeNumber(val.Split(' ')[0], Culture.English);
                    if (possibleHours.Count > 0)
                    {
                        possibleHours.FirstOrDefault().Resolution.TryGetValue("value", out var hoursString);
                        result = Convert.ToDouble(hoursString) * hoursMultiplier;
                    }
                }
            }

            return result;
        }

        private static List<T> GetPossibleEntityValues<T>(this RecognizerResult luisResult, string entityKey, string valuePropertyName = "text")
        {
            // Parsing the dynamic JObjects returned by LUIS is never easy
            // Adapted from https://pauliom.com/2018/11/06/extracting-an-entity-from-luis-in-bot-framework/
            var result = new List<T>();

            if (luisResult != null)
            {
                //// var value = (luisResult.Entities["$instance"][entityKey][0]["text"] as JValue).Value;
                var data = luisResult.Entities as IDictionary<string, JToken>;

                if (data.TryGetValue("$instance", out JToken value))
                {
                    var entities = value as IDictionary<string, JToken>;
                    if (entities.TryGetValue(entityKey, out JToken targetEntity))
                    {
                        var entityArray = targetEntity as JArray;
                        if (entityArray.Count > 0)
                        {
                            for (int i=0; i<entityArray.Count;i++)
                            {
                                var values = entityArray[i] as IDictionary<string, JToken>;
                                if (values.TryGetValue(valuePropertyName, out JToken textValue))
                                {
                                    var text = textValue as JValue;
                                    if (text != null)
                                    {
                                        result.Add((T)text.Value);
                                    }
                                }
                            }
                        }
                    }
                }
            }

            return result;
        }
    }
}
