import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, MessageFactory, InputHints } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { TaskModuleRequest, TaskModuleContinueResponse } from "botbuilder";
// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/actionPreviewMessageExtension/config.html")
@PreventIframe("/actionPreviewMessageExtension/action.html")
export default class ActionPreviewMessageExtension implements IMessagingExtensionMiddlewareProcessor {



    public async onFetchTask(context: TurnContext, value: MessagingExtensionQuery): Promise<MessagingExtensionResult | TaskModuleContinueResponse> {


        if (!value.state) { 
            return Promise.resolve<MessagingExtensionResult>({
                type: "config", // use "config" or "auth" here
                suggestedActions: {
                    actions: [
                        {
                            type: "openUrl",
                            value: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/config.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                            title: "Configuration"
                        }
                    ]
                }
            });
        }

        return Promise.resolve<TaskModuleContinueResponse>({
            type: "continue",
            value: {
                title: "Input form",
                url: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                height: "medium"
            }
        });


    }

    // handle action response in here
    // See documentation for `MessagingExtensionResult` for details
    public async onSubmitAction(context: TurnContext, value: TaskModuleRequest): Promise<MessagingExtensionResult> {
        const card = CardFactory.adaptiveCard(
            {
                type: "AdaptiveCard",
                body: [
                    {
                        type: "TextBlock",
                        size: "Large",
                        text: value.data.email
                    },
                    {
                        type: "Image",
                        url: `https://randomuser.me/api/portraits/thumb/women/${Math.round(Math.random() * 100)}.jpg`
                    }
                ],
                actions: [
                    {
                        type: "Action.OpenUrl",
                        title: "Step 1",
                        url: 'https://randomuser.me/api/portraits/thumb/women/',
                    }
                  ],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.2"
            });
        return Promise.resolve({
            type: "result",
            attachmentLayout: "list",
            attachments: [card]
        } as MessagingExtensionResult);        
    }

    // public async onBotMessagePreviewSend(context: TurnContext, action: any): Promise<MessagingExtensionResult>  {
    //     const activityPreview = action.botActivityPreview[0];
    //     const attachmentContent = activityPreview.attachments[0].content;

    //     const card = CardFactory.adaptiveCard(attachmentContent);

    //     return Promise.resolve({
    //         type: "message",
    //         attachments: [card],
    //         channelData: {
    //           onBehalfOf: [
    //             { itemId: 0, mentionType: 'person', mri: context.activity.from.id, displayname: context.activity.from.name }
    //           ]
    //         }
    //       } as MessagingExtensionResult);
    // }
}
