import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { BotFunction } from "../helpers/botFunction";
import oboAuthConfig from "../authConfig";
import { TRY_LATER_MESSAGE, callOpenAI, getAssistantMessage, getFunctionMessage } from "../helpers/openai";

export class GetMyTasks extends BotFunction {
  private functionArguments: any;

  constructor(functionArguments: any, openAIMessages: any[]) {
    super();
    this.functionName = "GetMyTasks";
    this.operationWithSSOToken = this.getUserTasks.bind(this);
    this.operationResultProcessor = this.showUserTasks.bind(this);
    this.functionArguments = functionArguments;
    this.openAIMessages = openAIMessages;
  }

  async getUserTasks(context: TurnContext, ssoToken: string) {

    // Call Microsoft Graph on behalf of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
      "Tasks.Read",
    ]);
    const userTasks = await graphClient.api("/me/planner/tasks").select(["title", "startDateTime", "dueDateTime", "percentComplete"]).get();
    if (userTasks) {
      if (this.functionArguments && this.functionArguments.getIncompleteTasksOnly) {
        return userTasks.value.filter((task: any) => task.percentComplete !== 100);
      }
      return userTasks;
    } else {
      await context.sendActivity(
        "Could not retrieve tasks information from Microsoft Graph."
      );
    }
  }

  async showUserTasks(context: TurnContext, operationResult: any) {

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
        "Could not retrieve tasks information from Microsoft Graph."
      );
    }
  }
}
