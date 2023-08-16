import { CardFactory, MessagingExtensionAction, MessagingExtensionActionResponse, TeamsActivityHandler, TurnContext } from "botbuilder";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { DateTime } from "luxon";
import * as sendMessageCard from "../cards/sendMessage.json";
import { Graph } from "./Graph";
import { CosmosDB } from "./Cosmos";

interface ICardData {
    createdByName: string;
    name: string;
    description: string;
    submittedDate: string;
    joinMeetingId: string;
    joinWebUrl: string;
}

export class Bot extends TeamsActivityHandler {

    protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        try {
            const cardData = action.data as ICardData;
            // Create onlineMeeting
            const graph = new Graph();
            // Create startDateTime and endDateTime for onlineMeeting (default 1 hour)
            const startDateTime = DateTime.now().startOf("hour").toUTC().toISO();
            const endDateTime = DateTime.now().endOf("hour").toUTC().toISO();
            // Create onlineMeeting
            const onlineMeeting = await graph.createOnlineMeeting(context.activity.from.aadObjectId, startDateTime, endDateTime);
            // Add to CosmosDB
            const cosmos = new CosmosDB(process.env.COSMOS_DB_ENDPOINT, process.env.COSMOS_DB_KEY);
            await cosmos.init();
            await cosmos.upsertTeamsMeeting(onlineMeeting);
            // Update card data
            cardData.createdByName = context.activity.from.name;
            cardData.submittedDate = new Date().toISOString();
            cardData.joinMeetingId = onlineMeeting.joinMeetingIdSettings.joinMeetingId;
            cardData.joinWebUrl = onlineMeeting.joinWebUrl;
            // Create Adaptive Card
            const card = AdaptiveCards.declare<ICardData>(sendMessageCard).render(cardData);
            // Send card to Teams
            const responseActivity = {
                type: 'message',
                attachments: [CardFactory.adaptiveCard(card)],
                channelData: {
                    onBehalfOf: [
                        {
                            itemId: 0,
                            mentionType: 'person',
                            mri: context.activity.from.id,
                            displayname: context.activity.from.name
                        }
                    ]
                }
            };
            await context.sendActivity(responseActivity);
            return Promise.resolve({} as MessagingExtensionActionResponse);
        } catch (error) {
            const responseActivity = {
                type: 'message',
                attachments: [CardFactory.heroCard('Error', error.message)],
                channelData: {
                    onBehalfOf: [
                        {
                            itemId: 0,
                            mentionType: 'person',
                            mri: context.activity.from.id,
                            displayname: context.activity.from.name
                        }
                    ]
                }
            };
            await context.sendActivity(responseActivity);
            return Promise.resolve({} as MessagingExtensionActionResponse);
        }
    }

}