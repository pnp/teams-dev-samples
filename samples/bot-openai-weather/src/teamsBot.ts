import {
  ActivityTypes,
  CardFactory,
  TeamsActivityHandler,
  TurnContext,
} from "botbuilder";
import config from "./internal/config";
import {
  callOpenAI,
  getAssistantMessage,
  getFunctionMessage,
  getSystemMessage,
  getUserMessage,
} from "./helpers/openai";
import { SYSTEM_MESSAGE, TRY_LATER_MESSAGE } from "./constants/openai";
import {
  getCurrentWeatherDetail,
  getWeatherForecastData,
} from "./servies/weatherservice";
import { IWeatherData } from "./interfaces/IWeatherData";
import weatherCard from "./adaptiveCards/weatherCard.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";

// An empty teams activity handler.
// You can add your customization code here to extend your bot logic if needed.
export class TeamsBot extends TeamsActivityHandler {
  private openAIMessages: any[] = [];
  constructor() {
    super();

    // add system message to openAI messages
    this.openAIMessages.push(getSystemMessage(SYSTEM_MESSAGE));

    this.onMessage(async (context, next) => {
      console.log("Running with Message Activity.");

      await context.sendActivity({ type: ActivityTypes.Typing });
      let txt = context.activity.text;
      const removedMentionText = TurnContext.removeRecipientMention(
        context.activity
      );
      if (removedMentionText) {
        // Remove the line break
        txt = removedMentionText.toLowerCase().replace(/\n|\r/g, "").trim();
      }
      const userMessage = getUserMessage(txt);
      this.openAIMessages.push(userMessage);

      const response = await callOpenAI(this.openAIMessages);
      const finalResponse = await this.processOpenAIResponse(
        this.openAIMessages,
        response
      );

      if (typeof finalResponse === "string") {
        await context.sendActivity(finalResponse);
      } else {
        const card =
          AdaptiveCards.declare<IWeatherData>(weatherCard).render(
            finalResponse
          );
        await context.sendActivity({
          attachments: [CardFactory.adaptiveCard(card)],
        });
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }

  private async callFunction(functionName: string, functionArguments: any) {
    let functionResult: any;

    if (functionName === "getCurrentWeatherDetail") {
      functionResult = await getCurrentWeatherDetail(
        functionArguments.locationName
      );
    } else if (functionName === "getWeatherForecastData") {
      functionResult = getWeatherForecastData(
        functionArguments.locationName,
        functionArguments.daysForecast
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
          const function_arguments =
            response_message["function_call"]["arguments"];
          const function_arguments_json = JSON.parse(function_arguments);

          switch (function_name) {
            case "getCurrentWeatherDetail": {
              const functionResult = await this.callFunction(
                function_name,
                function_arguments_json
              );
              const assistantMessage = getAssistantMessage(
                function_name,
                function_arguments_json
              );
              const functionMessage = getFunctionMessage(
                function_name,
                functionResult
              );
              messages.push(assistantMessage);
              messages.push(functionMessage);

              const secondResponse = await callOpenAI(messages);
              return await this.processOpenAIResponse(messages, secondResponse);
            }

            case "getWeatherForecastData": {
              const functionResult = await this.callFunction(
                function_name,
                function_arguments_json
              );
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
