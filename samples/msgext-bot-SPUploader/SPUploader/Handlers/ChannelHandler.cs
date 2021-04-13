using MeetingExtension_SP.Helpers;
using MeetingExtension_SP.Models;
using MessageExtension_SP.Helpers;
using MessageExtension_SP.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using Microsoft.Identity.Client;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Constants = MessageExtension_SP.Helpers.Constants;

namespace MessageExtension_SP.Handlers
{
    public class ChannelHandler
    {
        public async Task SendConversation(IConfiguration configuration, bool IsApprover, FileUploaderViewModel model)
        {
            var tempFilePath = @"Temp/UserFile.txt";
            UserModel user = await Common.GetMe(configuration);
            if (user != null)
            {
                System.IO.File.WriteAllText(tempFilePath, user.displayName + "," + user.mail);
                Microsoft.Bot.Schema.Attachment card = CardHelper.CreateAdaptiveCardAttachment(Constants.UserCard, configuration);
                await Common.SendChannelData(card, configuration);
            }
        }
    }
}