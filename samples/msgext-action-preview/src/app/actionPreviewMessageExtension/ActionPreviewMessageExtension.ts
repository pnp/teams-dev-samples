import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, MessageFactory, InputHints } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { TaskModuleRequest, TaskModuleContinueResponse } from "botbuilder";
import AdaptiveCardSvc from "../../controller/AdaptiveCardSvc";
// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/actionPreviewMessageExtension/config.html")
@PreventIframe("/actionPreviewMessageExtension/action.html")
export default class ActionPreviewMessageExtension implements IMessagingExtensionMiddlewareProcessor {
    public async onFetchTask(context: TurnContext, value: MessagingExtensionQuery): Promise<MessagingExtensionResult | TaskModuleContinueResponse> {
        return Promise.resolve<TaskModuleContinueResponse>({
            type: "continue",
            value: {
                title: "Input form",
                url: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                height: "medium"
            }
        });
    }

    /**
     * This function handles the initial submit (Email entered) of the Messaging extension
     * @param context 
     * @param value 
     * @returns 
     */
    public async onSubmitAction(context: TurnContext, value: TaskModuleRequest): Promise<MessagingExtensionResult> {
        const card = CardFactory.adaptiveCard(AdaptiveCardSvc.getInitialCard(value.data.email));

        return Promise.resolve({
            type: "botMessagePreview",
            activityPreview: MessageFactory.attachment(card, "", "", InputHints.ExpectingInput)
        } as MessagingExtensionResult);        
    }
    /**
   * This function handles the accepted preview message
   * @param context 
   * @param action 
   * @returns 
   */
    public async onBotMessagePreviewSend(context: TurnContext, action: any): Promise<MessagingExtensionResult>  {
        const activityPreview = action.botActivityPreview[0];
        const attachmentContent = activityPreview.attachments[0].content;
        const eMail = attachmentContent.body[0].text;
        const url = attachmentContent.body[3].url;

        const card = CardFactory.adaptiveCard(AdaptiveCardSvc.incrementVotes(eMail, url, 0));
        var responseActivity: any = { type: 'message', attachments: [card] };
        var response = await context.sendActivity(responseActivity);
        return Promise.resolve(response as MessagingExtensionResult);
    }    

    /**
     * This function handles a rejected preview message (offers another file selection)
     * @param context 
     * @param action 
     * @returns 
     */
    public async onBotMessagePreviewEdit(context: TurnContext, action: any): Promise<any>  {
        return Promise.resolve({
        type: "continue",
        value: {
            title: "Input form",
            url: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
            height: "medium",
            width: "medium"
        }
        });
    }
}
