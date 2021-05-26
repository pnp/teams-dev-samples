import { BotDeclaration, MessageExtensionDeclaration } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import ActionPreviewMessageExtension from "../actionPreviewMessageExtension/ActionPreviewMessageExtension";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler, MessagingExtensionActionResponse, MessagingExtensionAction, MessageFactory, InputHints } from "botbuilder";
import AdaptiveCardSvc from "../../controller/AdaptiveCardSvc";



// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Action Preview Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class ActionPreviewBot extends TeamsActivityHandler {
    private readonly conversationState: ConversationState;
    /** Local property for ActionPreviewMessageExtension */
    // @MessageExtensionDeclaration("actionPreviewMessageExtension")
    // private _actionPreviewMessageExtension: ActionPreviewMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension ActionPreviewMessageExtension
        // this._actionPreviewMessageExtension = new ActionPreviewMessageExtension();


        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);


    }

    public async handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: any): Promise<any> {
        return Promise.resolve({
            task: {
                type: "continue",
                value: {
                    title: "Input form",
                    url: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
                    height: "medium"
                }
            }
        });
    }

    protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<any> {
        const card = CardFactory.adaptiveCard(AdaptiveCardSvc.getInitialCard(action.data.email));
        
        return Promise.resolve({
            composeExtension: {                
                activityPreview: MessageFactory.attachment(card, "", "", InputHints.ExpectingInput),
                type: 'botMessagePreview'
            }
        });
    }

    public async handleTeamsMessagingExtensionBotMessagePreviewSend(context: TurnContext, action: any): Promise<MessagingExtensionActionResponse> {
        const activityPreview = action.botActivityPreview[0];
        const attachmentContent = activityPreview.attachments[0].content;
        const eMail = attachmentContent.body[0].text;
        const url = attachmentContent.body[3].url;

        const card = CardFactory.adaptiveCard(AdaptiveCardSvc.incrementVotes(eMail, url, 0));
        var responseActivity: any = { type: 'message', attachments: [card] };
        if (false) {
            responseActivity = {
                type: 'message',
                attachments: [card],
                channelData: {
                    onBehalfOf: [
                      { itemId: 0, mentionType: 'person', mri: context.activity.from.id, displayname: context.activity.from.name }
                    ]
                  }
            }
        }
        var response = await context.sendActivity(responseActivity);
        return Promise.resolve(response as MessagingExtensionActionResponse);
    }

    protected async handleTeamsMessagingExtensionBotMessagePreviewEdit(context: TurnContext, action: any): Promise<MessagingExtensionActionResponse> {
        const activityPreview = action.botActivityPreview[0];
        const attachmentContent = activityPreview.attachments[0].content;
        const eMail = attachmentContent.body[0].text;

        return Promise.resolve({
            task: {
                type: "continue",
                value: {
                    title: "Input form",
                    url: `https://${process.env.HOSTNAME}/actionPreviewMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}&email=${eMail}`,
                    height: "medium"
                }
            }
        });
    }

    protected async handleTeamsTaskModuleFetch(context: TurnContext, action: any): Promise<any> {
        // const activityPreview = action.botActivityPreview[0];
        // const attachmentContent = activityPreview.attachments[0].content;
        const eMail = action.data.cardVariables.email;
        const url = action.data.cardVariables.url;
        const votesStr = action.data.cardVariables.votes;
        let newVotes = parseInt(votesStr);
        newVotes++;

        const card = CardFactory.adaptiveCard(AdaptiveCardSvc.incrementVotes(eMail, url, newVotes));
        const message = MessageFactory.attachment(card);
        message.id = context.activity.replyToId;
        
        var response = await context.updateActivity(message);
        return Promise.resolve(response);
    }
}
