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
    @MessageExtensionDeclaration("actionPreviewMessageExtension")
    private _actionPreviewMessageExtension: ActionPreviewMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension ActionPreviewMessageExtension
        this._actionPreviewMessageExtension = new ActionPreviewMessageExtension();

        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);


    }

    protected async handleTeamsTaskModuleFetch(context: TurnContext, action: any): Promise<any> {
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
