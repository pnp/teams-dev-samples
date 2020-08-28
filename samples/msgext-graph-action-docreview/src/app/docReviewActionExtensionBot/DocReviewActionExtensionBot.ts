import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import DocReviewActionExtensionMessageExtension from "../docReviewActionExtensionMessageExtension/DocReviewActionExtensionMessageExtension";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler } from "botbuilder";



// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Doc Review Action Extension Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class DocReviewActionExtensionBot extends TeamsActivityHandler {
    private readonly conversationState: ConversationState;
    /** Local property for DocReviewActionExtensionMessageExtension */
    @MessageExtensionDeclaration("docReviewActionExtensionMessageExtension")
    private _docReviewActionExtensionMessageExtension: DocReviewActionExtensionMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension DocReviewActionExtensionMessageExtension
        this._docReviewActionExtensionMessageExtension = new DocReviewActionExtensionMessageExtension();


        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);


    }


}
