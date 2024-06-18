import {
  TeamsActivityHandler,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
  AdaptiveCardInvokeResponse,
} from "botbuilder";
import classifiedListingSearchCommand from "./messageExtensions/classifiedListingSearchCommand";
import actionHandler from "./adaptiveCards/cardHandler";
import { CreateActionErrorResponse } from "./adaptiveCards/utils";

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search.
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {
    switch (query.commandId) {
      case classifiedListingSearchCommand.COMMAND_ID: {
        return classifiedListingSearchCommand.handleTeamsMessagingExtensionQuery(context, query);
      }
    }
  }

  // Handle adaptive card actions
  public async onAdaptiveCardInvoke(context: TurnContext): Promise<AdaptiveCardInvokeResponse> {
    try {
      switch (context.activity.value.action.verb) {
        case 'addClassifiedItem': {
          return actionHandler.handleTeamsCardAddClassifiedItem(context);
        }
        case 'deleteClassifiedItem': {
          return actionHandler.handleTeamsCardDeleteClassifiedItem(context);
        }
        default:
          return CreateActionErrorResponse(200, 0, `ActionVerbNotSupported: ${context.activity.value.action.verb} is not a supported action verb.`);
      }
    }
    catch (err) {
      return CreateActionErrorResponse(500, 0, err.message);
    }
  }
}
