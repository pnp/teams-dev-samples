import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
    createMicrosoftGraphClientWithCredential,
    OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { BotFunction } from "../helpers/botFunction";
import oboAuthConfig from "../authConfig";
import { TRY_LATER_MESSAGE, callOpenAI, getAssistantMessage, getFunctionMessage } from "../helpers/openai";

export class GetMyEvents extends BotFunction {
    private functionArguments: any;

    constructor(functionArguments: any, openAIMessages: any[]) {
        super();
        this.functionName = "GetMyEvents";
        this.operationWithSSOToken = this.getUserEvents.bind(this);
        this.operationResultProcessor = this.showUserEvents.bind(this);
        this.functionArguments = functionArguments;
        this.openAIMessages = openAIMessages;
    }

    async getUserEvents(context: TurnContext, ssoToken: string) {

        // Call Microsoft Graph on behalf of user
        const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
        const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
            "Calendars.Read",
        ]);
        const userEvents = await graphClient.api("/me/events").select(["subject", "start", "end", "attendees", "location"]).get();
        if (userEvents) {
            if (this.functionArguments && this.functionArguments.futureEventsOnly) {
                return userEvents.value.filter((event: any) => {
                    return new Date(event.end.dateTime) > new Date();
                });
            }
            return userEvents;
        } else {
            await context.sendActivity(
                "Could not retrieve events information from Microsoft Graph."
            );
        }
    }

    async showUserEvents(context: TurnContext, operationResult: any) {

        if (operationResult) {

            const assistantMessage = getAssistantMessage(this.functionName, this.functionArguments);
            const functionMessage = getFunctionMessage(this.functionName, operationResult);

            this.openAIMessages.push(assistantMessage);
            this.openAIMessages.push(functionMessage);

            // get the response from openAI
            const response = await callOpenAI(this.openAIMessages);

            // if the response is undefined then show TRY_LATER_MESSAGE
            if (!response) {
                await context.sendActivity(TRY_LATER_MESSAGE);
                return;
            }

            // process the response
            const response_choice = response["choices"][0];
            const response_message = response_choice["message"];
            const response_finish_reason = response_choice["finish_reason"];

            // assume that the response_finish_reason is always "stop"
            if (response_finish_reason === "stop") {
                const responseText = response_message["content"];
                // show adaptive card if needed
                await context.sendActivity({
                    type: "message",
                    text: responseText,
                    textFormat: "markdown"
                });
            } else {
                await context.sendActivity(TRY_LATER_MESSAGE);
            }

        } else {
            await context.sendActivity(
                "Could not retrieve events information from Microsoft Graph."
            );
        }
    }
}
