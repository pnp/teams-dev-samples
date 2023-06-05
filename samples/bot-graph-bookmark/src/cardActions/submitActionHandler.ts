import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { TurnContext, InvokeResponse } from "botbuilder";
import { TeamsFxAdaptiveCardActionHandler, InvokeResponseFactory, AppCredential, createMicrosoftGraphClientWithCredential } from "@microsoft/teamsfx";
import responseCard from "../adaptiveCards/submitActionResponse.json";
import { CardData, IBookmarkForm } from "../cardModels";
import { GraphService } from "../services/GraphService";

/**
 * The `SubmitActionHandler` registers an action with the `TeamsFxBotActionHandler` and responds
 * with an Adaptive Card if the user clicks the Adaptive Card action with `triggerVerb`.
 */
export class SubmitActionHandler implements TeamsFxAdaptiveCardActionHandler {
  /**
   * A global unique string associated with the `Action.Execute` action.
   * The value should be the same as the `verb` property which you define in your adaptive card JSON.
   */
  triggerVerb = "submit";

  async handleActionInvoked(context: TurnContext, actionData: any): Promise<InvokeResponse> {
    /**
     * You can send an adaptive card to respond to the card action invoke.
     */
    const formData: IBookmarkForm = actionData;
    
    const result = await GraphService.createListItem(formData);
  
    const cardData: CardData = {
      title: "Bookmark bot",
      body: "Congratulations! Item has been added successfully in the SharePoint list.",
    };

    const cardJson = AdaptiveCards.declare(responseCard).render(cardData);
    return InvokeResponseFactory.adaptiveCard(cardJson);

    /**
     * If you want to send invoke response with text message, you can:
     * 
     return InvokeResponseFactory.textMessage("[ACK] Successfully!");
    */

    /**
     * If you want to send invoke response with error message, you can:
     *
     * return InvokeResponseFactory.errorResponse(InvokeResponseErrorCode.BadRequest, "The incoming request is invalid.");
     */
  }
}
