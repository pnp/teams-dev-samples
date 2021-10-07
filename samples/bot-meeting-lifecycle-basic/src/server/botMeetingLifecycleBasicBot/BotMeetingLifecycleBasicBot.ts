import { BotDeclaration } from "express-msteams-host";
import * as debug from "debug";
import { MemoryStorage, ConversationState, TeamsActivityHandler } from "botbuilder";
// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for bot meeting lifacycle basic Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    // eslint-disable-next-line no-undef
    process.env.MICROSOFT_APP_ID,
    // eslint-disable-next-line no-undef
    process.env.MICROSOFT_APP_PASSWORD)

export class BotMeetingLifecycleBasicBot extends TeamsActivityHandler {
    /**
     * The constructor
     * @param conversationState
     */
     public constructor(conversationState: ConversationState) {
        super();
    }

    async onEventActivity(context) {
        if (context.activity.type == 'event' && context.activity.name == "application/vnd.microsoft.meetingStart") {
            var meetingObject = context.activity.value;
            await context.sendActivity(`Meeting ${meetingObject.Title} started at ${meetingObject.StartTime}`);
        }
    
        if (context.activity.type == 'event' && context.activity.name == "application/vnd.microsoft.meetingEnd") {
            var meetingObject = context.activity.value;
            await context.sendActivity(`Meeting ${meetingObject.Title} ended at ${meetingObject.EndTime}`);
        }
    };
}
