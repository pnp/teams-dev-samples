// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;

namespace Augmentech.Teams.Bot
{
    public class TeamsBot : TeamsActivityHandler
    {
        protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction messagingExtensionAction, CancellationToken cancellationToken)
        {
            //Id message on which the message action was invoked.
            string messageId = messagingExtensionAction.MessagePayload.Id;

            //Id of the parent message if the message action was invoked on a reply to a top level message
            string replyToId = messagingExtensionAction.MessagePayload.ReplyToId;

            return new MessagingExtensionActionResponse
            {
                Task = new TaskModuleContinueResponse()
                {
                    Type = "continue",
                    Value = new TaskModuleTaskInfo()
                    {
                        Height = 500,
                        Width = 800,
                        Url = $"https://simedev057.sharepoint.com/_layouts/15/TeamsLogon.aspx?SPFX=true&dest=/_layouts/15/teamstaskhostedapp.aspx%3Fteams%26personal%26componentId=919277ea-54da-451b-a5eb-de94fc14dd39%26forceLocale={{locale}}%26augMessageId={messageId}%26augReplyToId={replyToId}",
                    }
                }
            };
        }

        protected override async Task<TaskModuleResponse> OnTeamsTaskModuleFetchAsync(ITurnContext<IInvokeActivity> turnContext, TaskModuleRequest taskModuleRequest, CancellationToken cancellationToken)
        {

            return new TaskModuleResponse
            {
                Task = new TaskModuleContinueResponse()
                {
                    Type = "continue",
                    Value = new TaskModuleTaskInfo()
                    {
                        Height = 500,
                        Width = 800,
                        Url = $"https://simedev057.sharepoint.com/_layouts/15/TeamsLogon.aspx?SPFX=true&dest=/_layouts/15/teamstaskhostedapp.aspx%3Fteams%26personal%26componentId=919277ea-54da-451b-a5eb-de94fc14dd39%26forceLocale={{locale}}"
                    }

                }
            };
        }

    }
}
