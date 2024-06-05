import {
    TurnContext,
    CardFactory
} from "botbuilder";

import followSuccessCard from '../adaptiveCards/followSuccessMessageCard.json';
import * as ACData from "adaptivecards-templating";

import { CreateActionErrorResponse, CreateAdaptiveCardInvokeResponse } from './adaptiveCardResponseHandler';
import { Logger } from "./Logging";
import config from "../config";
import { default as axios } from "axios";


/**
 * Handles the adaptive card action for following up on an item.
 * 
 * @param context The turn context.
 * @returns A promise that resolves to the adaptive card invoke response.
 */
async function handleAdaptiveCardActionFollow(context: TurnContext) {

    const request = context.activity.value;
    const who = context.activity.from;
    const data = request.action.data;
    Logger.info(`⚙️ following up on action: ${JSON.stringify(data)}`);

    if (data.issueId && data.itemId && data.issueType) {

        // Call the web service to follow the item
        const followUrl = `${config.functionAppFollowUrl}?`+
           `IssueId=${data.issueId}&` +
           `ItemId=${data.itemId}&` +
           `IssueType=${data.issueType}&` +
           `UserId=${who.aadObjectId}&` +
           `code=${config.functionAppKey}`

        Logger.info("Follow URL: " + followUrl);

        try {

            // Call the PnP Azure Function.
            const response = await axios.get(followUrl);

            if (response.status == 200) {

                var template = new ACData.Template(followSuccessCard);
                var card = template.expand({
                    $root: {
                        Id: data.issueId,
                        IssueType: data.issueType
                    }
                });
                return CreateAdaptiveCardInvokeResponse(200, card);

            } else {
                return CreateActionErrorResponse(200, 0, "Cannot follow this item - API error");

            }
        } catch (error) {

            return CreateActionErrorResponse(200, 0, "Cannot follow this item - Calling API error");
        }

    } else {

        return CreateActionErrorResponse(200, 0, "Cannot follow this item - missing values");
    }
}


export default { handleAdaptiveCardActionFollow }