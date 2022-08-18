import { BotDeclaration } from "express-msteams-host";
import { ConversationState, MemoryStorage, TeamsActivityHandler, TeamsInfo, UserState } from "botbuilder";
import * as debug from "debug";
const log = debug("msteams");
const store = require('../api/store');

let ConversationID = "";
let serviceUrl = "";

@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    // eslint-disable-next-line no-undef
    process.env.MICROSOFT_APP_ID,
    // eslint-disable-next-line no-undef
    process.env.MICROSOFT_APP_PASSWORD)
export class BotActivityHandler extends TeamsActivityHandler {
  constructor(public conversationState: ConversationState, userState: UserState) {
    super();
    this.conversationState = conversationState;
    this.onMessage(async (context, next) => {        
        await context.sendActivity("Welcome to Meeting Details Application!");            
    });

    this.onConversationUpdate(async (context, next) => {
      serviceUrl = context.activity.serviceUrl;
      store.setItem("serviceUrl", serviceUrl);
      try {
        const meetingID = context.activity.channelData.meeting.id;
        const meetingDetails = await TeamsInfo.getMeetingInfo(context, meetingID);
        log(meetingDetails);
        store.setItem(`meetingDetails_${meetingID}`, meetingDetails);
      }
      catch(err) {
        log(err);
      };        
    });
  }
}
