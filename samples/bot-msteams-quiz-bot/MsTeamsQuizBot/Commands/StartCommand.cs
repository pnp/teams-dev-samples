using Microsoft.Bot.Builder;
using Microsoft.Bot.Schema;
using Microsoft.TeamsFx.Conversation;
using MsTeamsQuizBot.Cards;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Commands;
public class StartCommand : ITeamsCommandHandler
{
    public IEnumerable<ITriggerPattern> TriggerPatterns => new List<ITriggerPattern>()
    {
        new StringTrigger("start"),
        new StringTrigger("go"),
        new StringTrigger("quiz"),
    };

    public Task<ICommandResponse> HandleCommandAsync(ITurnContext turnContext, CommandMessage message, CancellationToken cancellationToken = default)
    {
        var activity = new StartQuizCard().CreateActivity(new());
        return Task.FromResult<ICommandResponse>(new ActivityCommandResponse(activity));
    }
}