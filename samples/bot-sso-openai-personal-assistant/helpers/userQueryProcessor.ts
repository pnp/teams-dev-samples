// get the text that user has enetered
// process that text with OpenAI
// based on OpenAI's respose, decide which function to call from the functions folder

import { SYSTEM_MESSAGE, callOpenAI, getAssistantMessage, getFunctionMessage, getSystemMessage, getUserMessage } from './openai';
import { GetMyDetails, GetMyEvents, GetMyTasks } from '../functions';

export class UserQueryProcessor {

    static openAIMessages: any[] = [];
    static context: any;

    static async showMessage(text: any) {
        await this.context.sendActivity({
            type: "message",
            text,
            textFormat: "markdown"
        });
    }

    static async run(userInput: string, parameters: any) {

        // clear the openAI messages
        this.openAIMessages = [];

        // get the context
        this.context = parameters.context;

        // get the system message
        const systemMessage = getSystemMessage(SYSTEM_MESSAGE);
        this.openAIMessages.push(systemMessage);

        const userMessage = getUserMessage(userInput);
        this.openAIMessages.push(userMessage);

        const openAIResponse = await callOpenAI(this.openAIMessages);
        await this.processOpenAIResponse(openAIResponse, parameters);
    }

    static async processOpenAIResponse(response: any, parameters: any) {


        try {
            const response_choice = response["choices"][0];
            const response_message = response_choice["message"];
            const response_finish_reason = response_choice["finish_reason"];

            switch (response_finish_reason) {
                case "stop":
                    const responseText = response_message["content"];
                    await this.showMessage(responseText);
                    break;
                case "function_call":
                    const function_name = response_message["function_call"]["name"];
                    const function_arguments = response_message["function_call"]["arguments"];
                    const function_arguments_json = JSON.parse(function_arguments);

                    switch (function_name) {
                        case "GetMyDetails":
                            const getMyDetails = new GetMyDetails(function_arguments_json, this.openAIMessages);
                            await getMyDetails.run(parameters);
                            break;
                        case "GetMyEvents":
                            const getMyEvents = new GetMyEvents(function_arguments_json, this.openAIMessages);
                            await getMyEvents.run(parameters);
                            break;
                        case "GetMyTasks":
                            const getMyTasks = new GetMyTasks(function_arguments_json, this.openAIMessages);
                            await getMyTasks.run(parameters);
                            break;
                        case "ShowFunnyMessage":
                            const responseText = function_arguments_json.funnyMessage
                            await this.showMessage(responseText);
                            break;
                        default:
                            await this.showMessage("Sorry, I didn't understand that.");
                            break;
                    }
                    break;
                default:
                    await this.showMessage("Sorry, I didn't understand that.");
                    break;
            }

        } catch (error) {
            console.log("error: ", error);
            await this.showMessage("Sorry, there was an error.");
        }
    }
}