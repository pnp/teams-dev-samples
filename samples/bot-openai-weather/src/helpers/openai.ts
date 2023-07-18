import { Configuration, OpenAIApi } from "openai";
import { FUNCTIONS } from "../constants/openai";
import config from "../internal/config";

const configuration = new Configuration({
  apiKey: config.openAPIKey,
});
const openai = new OpenAIApi(configuration);

export const callOpenAI = async (messages: any[]) => {
  try {
    const response = await openai.createChatCompletion({
      model: config.gptModel,
      messages,
      functions: FUNCTIONS,
      max_tokens: 512,
    });

    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getAssistantMessage = (
  functionName: string,
  functionArguments: any
) => {
  return {
    role: "assistant",
    content: "",
    function_call: {
      name: functionName,
      arguments: JSON.stringify(functionArguments),
    },
  };
};

export const getFunctionMessage = (
  functionName: string,
  functionResult: any
) => {
  return {
    role: "function",
    name: functionName,
    content: JSON.stringify(functionResult),
  };
};

export const getUserMessage = (userMessage: string) => {
  return {
    role: "user",
    content: userMessage,
  };
};

export const getSystemMessage = (systemMessage: string) => {
  return {
    role: "system",
    content: systemMessage,
  };
};
