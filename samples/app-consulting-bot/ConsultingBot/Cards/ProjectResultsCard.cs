using ConsultingData.Models;
using Microsoft.Bot.Schema;
using System.Collections.Generic;

namespace ConsultingBot.Cards
{
    public class ProjectResultsCard
    {
        public static HeroCard GetCard(ConsultingProject project, string imageUrl)
        {
            var resultCard = new HeroCard()
            {
                Title = $"{ project.Client.Name } - { project.Name }",
                Subtitle = $"{ project.Description }",
                Text = $"{ project.Address }<br />{ project.City }, { project.State }, { project.Zip }<br />Contact is { project.Contact }",
                Images = new List<CardImage>() { new CardImage() { Url = imageUrl } },
                Buttons = new List<CardAction>()
                    {
                        new CardAction() { Title = "Project Team" , Type = "openUrl", Value = project.TeamUrl },
                        new CardAction() { Title = "Project Documents" , Type = "openUrl", Value = project.DocumentsUrl }
                    }
            };
            return resultCard;
        }
    }
}
