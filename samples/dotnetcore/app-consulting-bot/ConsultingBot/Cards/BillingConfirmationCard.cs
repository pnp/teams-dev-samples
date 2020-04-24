using AdaptiveCards;
using ConsultingBot.Model;
using System.Collections.Generic;

namespace ConsultingBot.Cards
{
    public static class BillingConfirmationCard

    {
        public static AdaptiveCard GetCard(ConsultingRequestDetails value)
        {
            var project = value.project;
            var card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 0));
            card.Body.Add(new AdaptiveTextBlock($"You billed {value.workHours} hours to {project.Client.Name}")
            {
                Weight = AdaptiveTextWeight.Default,
                Size = AdaptiveTextSize.Large,
            });

            // Display details in a fact set
            var factSet = new AdaptiveFactSet();
            factSet.Facts.Add(new AdaptiveFact("Client", project.Client.Name));
            factSet.Facts.Add(new AdaptiveFact("Project", project.Name));
            factSet.Facts.Add(new AdaptiveFact("Hours", value.workHours.ToString()));
            factSet.Facts.Add(new AdaptiveFact("Date worked", value.workDate));

            card.Body.Add(new AdaptiveColumnSet()
            {
                Columns = new List<AdaptiveCards.AdaptiveColumn>()
                {
                    new AdaptiveColumn()
                    {
                        Width = "15%",
                        Items = new List<AdaptiveElement>()
                        {
                            new AdaptiveImage(value.project.Client.LogoUrl)
                        }
                    },
                    new AdaptiveColumn()
                    {
                        Width = "85%",
                        Items = new List<AdaptiveElement>()
                        {
                             factSet
                        }
                    },
                }
            });

            return card;
        }
    }
}
