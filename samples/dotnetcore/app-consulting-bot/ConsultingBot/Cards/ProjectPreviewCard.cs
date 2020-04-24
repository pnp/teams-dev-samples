using ConsultingData.Models;
using Microsoft.Bot.Schema;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConsultingBot.Cards
{
    public class ProjectPreviewCard
    {
        public static ThumbnailCard GetCard(ConsultingProject project)
        {
            var previewCard = new ThumbnailCard()
            {
                Title = $"{project.Client.Name} - {project.Name}",
                Text = project.Description,
                Images = new List<CardImage>() { new CardImage() { Url = project.Client.LogoUrl } }
            };
            return previewCard;
        }
    }
}
