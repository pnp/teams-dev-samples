using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Routing;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Builder;
using Microsoft.Extensions.Logging;
using Microsoft.TeamsFx.Conversation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.IO;

namespace MsTeamsQuizBot.Functions;
public sealed class MessageHandler
{
    private readonly ConversationBot _conversation;
    private readonly IBot _bot;
    private readonly ILogger<MessageHandler> _log;

    public MessageHandler(ConversationBot conversation, IBot bot, ILogger<MessageHandler> log)
    {
        _conversation = conversation;
        _bot = bot;
        _log = log;
    }

    [FunctionName("MessageHandler")]
    public async Task<EmptyResult> Run([HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "api/messages")] HttpRequest req)
    {
        _log.LogInformation("MessageHandler processes a request.");
        //var body = new StreamReader(req.Body).ReadToEnd();
        //req.Body.Position = 0;

        await (_conversation.Adapter as CloudAdapter).ProcessAsync(req, req.HttpContext.Response, _bot, req.HttpContext.RequestAborted);

        return new EmptyResult();
    }
}