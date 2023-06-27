import {
  TeamsActivityHandler,
  CardFactory,
  ActivityTypes,
} from "botbuilder";
import rawTfLLineCard from "../adaptiveCards/tflLine.json";
import rawWelcomeCard from "../adaptiveCards/welcomeCard.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { callOpenAI, getAssistantMessage, getFunctionMessage, getSystemMessage, getUserMessage } from '../helpers/openai';
import { getLineStatus, displayLineStatus } from '../helpers/tfl';
import { SYSTEM_MESSAGE, TRY_LATER_MESSAGE } from '../constants/openai';
import { ILineStatus } from "../interfaces";

export class TfLStatusBot extends TeamsActivityHandler {
  private openAIMessages: any[] = [];

  constructor() {
    super();

    // add system message to openAI messages
    this.openAIMessages.push(getSystemMessage(SYSTEM_MESSAGE));

    this.onMessage(async (context, next) => {
      await context.sendActivity({ type: ActivityTypes.Typing });
      const userMessage = getUserMessage(context.activity.text);
      this.openAIMessages.push(userMessage);

      const response = await callOpenAI(this.openAIMessages);
      const finalResponse = await this.processOpenAIResponse(this.openAIMessages, response);
      // finalResponse can be either a string or ILineStatus
      // if it's a string then send it as a message
      // if it's an ILineStatus then send it as an adaptive card
      if (typeof finalResponse === 'string') {
        await context.sendActivity(finalResponse);
      }
      else {
        const card = AdaptiveCards.declare<ILineStatus>(rawTfLLineCard).render(finalResponse);
        await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
      }

      await next();
    });

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          const card = AdaptiveCards.declareWithoutData(rawWelcomeCard).render();
          await context.sendActivity({ attachments: [CardFactory.adaptiveCard(card)] });
          break;
        }
      }
      await next();
    });

  }

  private async callFunction(functionName: string, functionArguments: any) {
    let functionResult: any;

    if (functionName === "getLineStatus") {
      functionResult = await getLineStatus(functionArguments.lineId);
    } else if (functionName === "displayLineStatus") {
      functionResult = displayLineStatus(
        functionArguments.lineId,
        functionArguments.lineName,
        functionArguments.lineHexColour,
        functionArguments.status,
        functionArguments.statusColour,
        functionArguments.funnyResponseToUserQuery
      );
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
            case "getLineStatus": {
              const functionResult = await this.callFunction(function_name, function_arguments_json);
              const assistantMessage = getAssistantMessage(function_name, function_arguments_json);
              const functionMessage = getFunctionMessage(function_name, functionResult);
              messages.push(assistantMessage);
              messages.push(functionMessage);

              const secondResponse = await callOpenAI(messages);
              return await this.processOpenAIResponse(messages, secondResponse);

            }

            case "displayLineStatus": {
              const functionResult = await this.callFunction(function_name, function_arguments_json);
              return functionResult;
            }


            case "showFunnyMessage": {
              const funnyMessage = function_arguments_json.funnyMessage;
              return funnyMessage;
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
      return TRY_LATER_MESSAGE;
    }
  }
}