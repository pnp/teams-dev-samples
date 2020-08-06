import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import CustomerSearchMessageExtension from "../customerSearchMessageExtension/CustomerSearchMessageExtension";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler } from "botbuilder";



// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for CustomerSearch Message Extension Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class CustomerSearchMessageExtensionBot extends TeamsActivityHandler {
    private readonly conversationState: ConversationState;
    /** Local property for CustomerSearchMessageExtension */
    @MessageExtensionDeclaration("customerSearchMessageExtension")
    private _customerSearchMessageExtension: CustomerSearchMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension CustomerSearchMessageExtension
        this._customerSearchMessageExtension = new CustomerSearchMessageExtension();


        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);


    }


}
