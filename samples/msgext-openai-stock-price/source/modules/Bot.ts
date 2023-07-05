import { Activity, CardFactory, InputHints, MessageFactory, MessagingExtensionAction, MessagingExtensionActionResponse, TeamsActivityHandler, TurnContext } from "botbuilder";
import rawPromptCard from "../adaptiveCards/prompt.json";
import rawStockCard from "../adaptiveCards/stock.json";
import rawMessageCard from "../adaptiveCards/message.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { callOpenAI, getAssistantMessage, getFunctionMessage, getSystemMessage, getUserMessage } from '../helpers/openai';
import { getQuote } from "../helpers/finnhub";
import { SYSTEM_MESSAGE, TRY_LATER_MESSAGE, ERROR_MESSAGE } from '../constants/openai';
import { IStock, IQuote } from "../interfaces";

export class StockPirceBotActivityHandler extends TeamsActivityHandler {

    private stock: IStock;
    private openAIMessages: any[] = [
        getSystemMessage(SYSTEM_MESSAGE)
    ];
    private showQuote: boolean = false;

    constructor() {
        super();
        this.stock = {
            symbol: "",
            companyName: "",
            primaryExchange: "",
            quote: {
                open: 0,
                high: 0,
                low: 0,
                current: 0,
                latestUpdate: 0,
                change: 0,
                changePercent: 0
            },
            summary: ""
        };
    }

    private async callFunction(functionName: string, functionArguments: any) {
        let functionResult: any;

        if (functionName === "getQuote") {
            functionResult = await getQuote(functionArguments.symbol);
            this.stock.quote = functionResult;
            this.stock.symbol = functionArguments.symbol;
            this.stock.companyName = functionArguments.companyName;
            this.stock.primaryExchange = functionArguments.primaryExchange;
            this.showQuote = true;
        }

        return functionResult;
    }

    private async processOpenAIResponse(messages: any[], response: any) {

        // if respose in null or undefined, return TRY_LATER_MESSAGE
        if (!response) {
            return TRY_LATER_MESSAGE;
        }

        try {

            const response_choice = response["choices"][0];
            const response_message = response_choice["message"];
            const response_finish_reason = response_choice["finish_reason"];

            switch (response_finish_reason) {
                case "stop": {
                    const responseText = response_message["content"];
                    return responseText;
                }
                case "function_call": {
                    const function_name = response_message["function_call"]["name"];
                    const function_arguments = response_message["function_call"]["arguments"];
                    const function_arguments_json = JSON.parse(function_arguments);

                    switch (function_name) {
                        case "getQuote": {
                            const functionResult = await this.callFunction(function_name, function_arguments_json);
                            if (process.env.ShowSummary !== "true") {
                                return "";
                            }
                            const assistantMessage = getAssistantMessage(function_name, function_arguments_json);
                            const functionMessage = getFunctionMessage(function_name, functionResult);
                            messages.push(assistantMessage);
                            messages.push(functionMessage);

                            const secondResponse = await callOpenAI(messages);
                            return await this.processOpenAIResponse(messages, secondResponse);

                        }
                        default:
                            return TRY_LATER_MESSAGE;
                    }
                    break;
                }
                default:
                    return TRY_LATER_MESSAGE;
            }

        } catch (error) {
            console.error(error);
            return ERROR_MESSAGE;
        }
    }

    // Handle opening of message extension
    protected handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        return Promise.resolve(this.generatePromptCardResponse());
    }

    // Handle submission of message extension
    protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {

        const userMessage = getUserMessage(action.data.stockQuery);
        this.openAIMessages.push(userMessage);

        const openAIresponse = await callOpenAI(this.openAIMessages);
        const processedOpenAIResponse = await this.processOpenAIResponse(this.openAIMessages, openAIresponse);

        let card: any;

        // if showQuote is true, show quote card
        if (this.showQuote) {
            this.stock.summary = processedOpenAIResponse;
            card = AdaptiveCards.declare<IStock>(rawStockCard).render(this.stock);
        } else {
            card = AdaptiveCards.declare<{ message: string }>(rawMessageCard).render({ message: processedOpenAIResponse });
        }
        
        const attachment = CardFactory.adaptiveCard(card);

        const response: MessagingExtensionActionResponse = {
            composeExtension: {
                activityPreview: MessageFactory.attachment(attachment, null, null, InputHints.ExpectingInput) as Activity,
                type: 'botMessagePreview'
            }
        };

        return Promise.resolve(response);

    }

    // Handle editing of result
    protected async handleTeamsMessagingExtensionBotMessagePreviewEdit(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        return Promise.resolve(this.generatePromptCardResponse());
    }

    // Handle sending of result
    protected async handleTeamsMessagingExtensionBotMessagePreviewSend(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        const activityPreview = action.botActivityPreview[0];
        const responseActivity = {
            type: 'message',
            attachments: activityPreview.attachments,
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

    // Helper to generate prompt card
    protected generatePromptCardResponse(): MessagingExtensionActionResponse {
        const card = CardFactory.adaptiveCard(rawPromptCard);
        const response: MessagingExtensionActionResponse = {
            task: {
                type: "continue",
                value: {
                    card,
                    title: "Ask your question about a stock",
                    height: 400,
                    width: 512
                }
            }
        };

        return response;
    }

}