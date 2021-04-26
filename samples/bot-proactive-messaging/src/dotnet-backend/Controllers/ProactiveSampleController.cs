// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Bot.Connector;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Microsoft.BotBuilderSamples.Controllers
{
    // This ASP Controller is created to handle a request. Dependency Injection will provide the Adapter and IBot
    // implementation at runtime. Multiple different IBot implementations running at different endpoints can be
    // achieved by specifying a more specific type for the bot constructor argument.
    [Route("api/sendProactiveTextMessage")]
    [EnableCors("MyTabPolicy")]
    [ApiController]
    public class ProactiveSampleController : ControllerBase
    {
        private readonly IConfiguration Configuration;

        public ProactiveSampleController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        [HttpPost]
        public async Task<ActionResult> PostAsync()
        {
            string requestBody = await new System.IO.StreamReader(HttpContext.Request.Body).ReadToEndAsync();
            dynamic bodyData = JsonConvert.DeserializeObject(requestBody);

            string conversationId = bodyData?.conversationId;
            string serviceUrl = bodyData?.serviceUrl;
           
            var uri = new Uri(serviceUrl);
            ConnectorClient connector = new ConnectorClient(uri, Configuration["MicrosoftAppId"], Configuration["MicrosoftAppPassword"]);
            MicrosoftAppCredentials.TrustServiceUrl(serviceUrl);

            var activity = new Activity()
            {
                Text = "Proactively saying **Hello**",
                Type = ActivityTypes.Message,
                Conversation = new ConversationAccount(false, "personal", conversationId)
            };

            try
            {
                var result = await connector.Conversations.SendToConversationAsync(conversationId, activity);

                return new OkResult();
            }
            catch (Exception ex)
            {
                return new BadRequestObjectResult(ex.Message);
            }
        }
    }
}
