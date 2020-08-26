import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import DocumentReviewMessageMessageExtension from "../documentReviewMessageMessageExtension/DocumentReviewMessageMessageExtension";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler } from "botbuilder";



// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Document Review Message Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class DocumentReviewMessageBot extends TeamsActivityHandler {
    private readonly conversationState: ConversationState;
    /** Local property for DocumentReviewMessageMessageExtension */
    @MessageExtensionDeclaration("documentReviewMessageMessageExtension")
    private _documentReviewMessageMessageExtension: DocumentReviewMessageMessageExtension;
    private readonly dialogs: DialogSet;
    private dialogState: StatePropertyAccessor<DialogState>;

    /**
     * The constructor
     * @param conversationState
     */
    public constructor(conversationState: ConversationState) {
        super();
        // Message extension DocumentReviewMessageMessageExtension
        this._documentReviewMessageMessageExtension = new DocumentReviewMessageMessageExtension();

        this.conversationState = conversationState;
        this.dialogState = conversationState.createProperty("dialogState");
        this.dialogs = new DialogSet(this.dialogState);
    }
}
