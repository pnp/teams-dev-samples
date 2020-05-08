using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.RegularExpressions;
using System.Threading;
using System.Threading.Tasks;

namespace ConsultingBot.Middleware
{
    public class StripBotMention : IMiddleware
    {

        public async Task OnTurnAsync(ITurnContext turnContext, NextDelegate next, CancellationToken cancellationToken)
        {
            if (turnContext.Activity.Type == ActivityTypes.Message)
            {
                // Strip off initial @mention of bot (if any)
                turnContext.Activity.Text = Regex.Replace(
                    turnContext.Activity.Text,
                    @"^<(at)\b[^>]*>(?:[^<]|<(?!/\1))*</\1>*", String.Empty);
            }
            await next(cancellationToken);
        }
    }
}
