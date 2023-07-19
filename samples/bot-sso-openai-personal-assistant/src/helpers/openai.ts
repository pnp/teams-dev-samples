import { Configuration, OpenAIApi } from "openai"
import config from "../internal/config";

export class OpenAIHelper {

    private static configuration: Configuration;
    private static openai: OpenAIApi;
    public static TRY_LATER_MESSAGE = "Sorry, I am unable to process your query at the moment. Please try again later.";
    public static SYSTEM_MESSAGE = `You are a personal assistant. Your final reply must be in markdown format. Use ** for bold and * for italics and emojis where needed. For events and tasks note that today is ${new Date()}.`;
    public static FUNCTIONS = [
        {
            "name": "getMyDetails",
            "description": "Get the details of the current user",
            "parameters": {
                "type": "object",
                "properties": {
                    "getNameOnly": {
                        "type": "boolean",
                        "description": "Get user's name only"
                    }
                },
                "required": [
                    "getNameOnly"
                ]
            }
        },
        {
            "name": "getMyEvents",
            "description": "Get the events in a calendar of the current user",
            "parameters": {
                "type": "object",
                "properties": {
                    "getFutureEventsOnly": {
                        "type": "boolean",
                        "description": "Get future events only"
                    }
                },
                "required": [
                    "getFutureEventsOnly"
                ]
            }
        },
        {
            "name": "getMyTasks",
            "description": "Get the tasks from the Microsoft planner of the current user",
            "parameters": {
                "type": "object",
                "properties": {
                    "getIncompleteTasksOnly": {
                        "type": "boolean",
                        "description": "Get incomplete only"
                    }
                },
                "required": [
                    "getIncompleteTasksOnly"
                ]
            }
        },
        {
            "name": "showFunnyMessage",
            "description": "If user's query is not related to work based personal assistance then show a funny message",
            "parameters": {
                "type": "object",
                "required": [
                    "funnyMessage"
                ],
                "properties": {
                    "funnyMessage": {
                        "type": "string",
                        "description": "A funny/sarcastic message to say why user's query is not related to work based personal assistance. Max 20 words."
                    }
                }
            }
        }
    ];

    public static async initialize() {
        this.configuration = new Configuration({
            apiKey: config.openaiAPIKey
        });
        this.openai = new OpenAIApi(this.configuration);
    }

    public static async callOpenAI(messages: any[]) {

        try {
            const response = await this.openai.createChatCompletion({
                model: config.gptModel,
                messages,
                functions: this.FUNCTIONS,
                max_tokens: 512,
                temperature: 0,
                top_p: 1
            });

            return response.data;

        } catch (error) {
            console.error(error);
            return null;
        }
    }

    // getAssistantMessage
    public static getAssistantMessage(functionName: string, functionArguments: any) {
        return {
            role: 'assistant',
            content: "",
            function_call: {
                name: functionName,
                arguments: JSON.stringify(functionArguments)
            }
        };
    }

    // getFunctionMessage
    public static getFunctionMessage(functionName: string, functionResult: any) {
        return {
            role: 'function',
            name: functionName,
            content: JSON.stringify(functionResult)
        };
    }

    // getUserMessage
    public static getUserMessage(userMessage: string) {
        return {
            role: 'user',
            content: userMessage
        };
    }

    // getSystemMessage
    public static getSystemMessage() {
        return {
            role: 'system',
            content: this.SYSTEM_MESSAGE
        };
    }
}