import { Configuration, OpenAIApi } from "openai"
import config from "../config";

const configuration = new Configuration({
    apiKey: config.openaiAPIKey
});
const openai = new OpenAIApi(configuration);

export const callOpenAI = async (messages: any[]) => {

    try {
        const response = await openai.createChatCompletion({
            model: config.gptModel,
            messages,
            functions: FUNCTIONS,
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

export const TRY_LATER_MESSAGE = "Sorry, I am unable to process your query at the moment. Please try again later.";
export const SYSTEM_MESSAGE = `You are a personal assistant. Your final reply must be in markdown format. Use ** for bold and * for italics and emojis where needed. For events and tasks note that today is ${new Date()}.`;

export const FUNCTIONS = [
    {
        "name": "GetMyDetails",
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
        "name": "GetMyEvents",
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
        "name": "GetMyTasks",
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
        "name": "ShowFunnyMessage",
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

export const getAssistantMessage = (functionName: string, functionArguments: any) => {
    return {
        role: 'assistant',
        content: "",
        function_call: {
            name: functionName,
            arguments: JSON.stringify(functionArguments)
        }
    };
}

export const getFunctionMessage = (functionName: string, functionResult: any) => {
    return {
        role: 'function',
        name: functionName,
        content: JSON.stringify(functionResult)
    };
}

export const getUserMessage = (userMessage: string) => {
    return {
        role: 'user',
        content: userMessage
    };
}

export const getSystemMessage = (systemMessage: string) => {
    return {
        role: 'system',
        content: systemMessage
    };
}