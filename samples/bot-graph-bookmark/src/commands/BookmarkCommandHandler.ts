import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import { CommandMessage, OnBehalfOfUserCredential, TeamsBotSsoPromptTokenResponse, TeamsFxBotCommandHandler, TeamsFxBotSsoCommandHandler, TriggerPatterns, createMicrosoftGraphClientWithCredential } from "@microsoft/teamsfx";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import BookmarkCard from "../adaptiveCards/BookmarkCard.json";
import { BookmarkData, CardData } from "../cardModels";
import oboAuthConfig from "../authConfig";
import { GraphService } from "../services/GraphService";

/**
 * The `BookmarkCommandHandler` registers a pattern with the `TeamsFxBotCommandHandler` and responds
 * with an Adaptive Card if the user types the `triggerPatterns`.
 */
export class BookmarkCommandHandler implements TeamsFxBotSsoCommandHandler {
  triggerPatterns: TriggerPatterns = "bookmark";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage,
    tokenResponse: TeamsBotSsoPromptTokenResponse,
    ): Promise<string | Partial<Activity> | void> {
    console.log(`App received message: ${message.text}`);
     
    GraphService.Init(tokenResponse.ssoToken);      
    
    // Render your adaptive card for reply message
    const cardData: BookmarkData = {
      header: "Add bookmark"      
    };

    const cardJson = AdaptiveCards.declare(BookmarkCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}
