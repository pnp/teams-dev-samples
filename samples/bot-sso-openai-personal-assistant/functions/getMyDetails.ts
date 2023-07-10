import { ResponseType } from "@microsoft/microsoft-graph-client";
import { CardFactory, TurnContext } from "botbuilder";
import {
  createMicrosoftGraphClientWithCredential,
  OnBehalfOfUserCredential,
} from "@microsoft/teamsfx";
import { BotFunction } from "../helpers/botFunction";
import oboAuthConfig from "../authConfig";
import { TRY_LATER_MESSAGE, callOpenAI, getAssistantMessage, getFunctionMessage } from "../helpers/openai";
import { Utils } from "../helpers/utils";
const rawProfileCard = require("../adaptiveCards/profile.json");


export class GetMyDetails extends BotFunction {
  private functionArguments: any;
  private showPicture: boolean;
  private pictureUrl: string;

  constructor(functionArguments: any, openAIMessages: any[]) {
    super();
    this.functionName = "GetMyDetails";
    this.operationWithSSOToken = this.getUserInfo.bind(this);
    this.operationResultProcessor = this.showUserInfo.bind(this);
    this.functionArguments = functionArguments;
    this.openAIMessages = openAIMessages;
    this.showPicture = false;
  }

  async getUserInfo(context: TurnContext, ssoToken: string) {

    // Call Microsoft Graph on behalf of user
    const oboCredential = new OnBehalfOfUserCredential(ssoToken, oboAuthConfig);
    const graphClient = createMicrosoftGraphClientWithCredential(oboCredential, [
      "User.Read",
    ]);
    const me = await graphClient.api("/me").get();
    if (me) {
      if (this.functionArguments && this.functionArguments.getNameOnly) {

        this.showPicture = true;

        // show user picture
        let photoBinary: ArrayBuffer;
        try {
          photoBinary = await graphClient
            .api("/me/photo/$value")
            .responseType(ResponseType.ARRAYBUFFER)
            .get();
        } catch {
          return;
        }

        const buffer = Buffer.from(photoBinary);
        this.pictureUrl = "data:image/png;base64," + buffer.toString("base64");

        return {
          givenName: me.givenName,
          surname: me.surname,
          jobTitle: me.jobTitle,
        }
      }
      return me;
    } else {
      await context.sendActivity(
        "Could not retrieve profile information from Microsoft Graph."
      );
    }
  }

  async showUserInfo(context: TurnContext, operationResult: any) {

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

        if (this.showPicture) {
          const card = Utils.renderAdaptiveCard(rawProfileCard, {
            imageUrl: this.pictureUrl,
            details: responseText
          });
          await context.sendActivity({ attachments: [card] });

        } else {
          await context.sendActivity({
            type: "message",
            text: responseText,
            textFormat: "markdown"
          });
        }
      } else {
        await context.sendActivity(TRY_LATER_MESSAGE);
      }

    } else {
      await context.sendActivity(
        "Could not retrieve profile information from Microsoft Graph."
      );
    }
  }
}
