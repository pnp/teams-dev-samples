import { BotDeclaration, MessageExtensionDeclaration } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import ActionConfigInAzureMessageExtension from "../actionConfigInAzureMessageExtension/ActionConfigInAzureMessageExtension";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler } from "botbuilder";



// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Action Config in Azure Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class ActionConfigInAzureBot extends TeamsActivityHandler {
    private readonly conversationState: ConversationState;
    /** Local property for ActionConfigInAzureMessageExtension */
    @MessageExtensionDeclaration("actionConfigInAzureMessageExtension")
    private _actionConfigInAzureMessageExtension: ActionConfigInAzureMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension ActionConfigInAzureMessageExtension
        this._actionConfigInAzureMessageExtension = new ActionConfigInAzureMessageExtension();


        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);


    }


}
