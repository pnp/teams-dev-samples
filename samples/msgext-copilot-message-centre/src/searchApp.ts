import { default as axios } from "axios";
import * as querystring from "querystring";
import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionQuery,
  MessagingExtensionResponse,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import * as statusMessageCard from "./adaptiveCards/statusMessageCard.json";
import * as messageCentreAnnounceCard from "./adaptiveCards/messageCentreAnnounceCard.json";
import config from "./config";
import { IServiceHealthMessage } from "./utility/iServiceHealthMessage";
import { IServiceAnnouncement } from "./utility/IServiceAnnouncement";
import { Logger } from './utility/Logging';

export class SearchApp extends TeamsActivityHandler {
  constructor() {
    super();
  }

  // Search
  public async handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
  ): Promise<MessagingExtensionResponse> {

    // Create an array to hold the results for the adaptive cards.
    const attachments = [];

    try {

      // Lets find the parameters that Copilot has sent us and formulate the URL for the PnP Azure Function.
      let searchParamsUrl: string = "";
      query.parameters.forEach(param => {
        switch (param.name) {
          case "searchId":
            Logger.info("searchId: " + param.value);
            searchParamsUrl += "SearchId=" + param.value + "&";
            break;
          case "searchWorkload":
            Logger.info("searchWorkload: " + param.value);
            searchParamsUrl += "SearchWorkload=" + param.value + "&";
            break;
          case "searchQuery":
            Logger.info("searchQuery: " + param.value);
            searchParamsUrl += "SearchQuery=" + param.value + "&";
            break;
          case "searchType":
            Logger.info("searchType: " + param.value);
            searchParamsUrl += "SearchType=" + param.value + "&";
            break;
        }
      });

      const finalUrl = `${config.functionAppUrl}?${searchParamsUrl}ResultsMax=8&code=${config.functionAppKey}`
      Logger.info("Final URL: " + finalUrl);
      // Call the PnP Azure Function.
      const response = await axios.get(finalUrl);

      // Iterate over the results and create an adaptive card for each, but the 
      // results will be contained within two objects - ServiceHealthMessages & MessageCentreAnnouncements.
      if (response.data.ServiceHealthMessages.length > 0) {

        Logger.info("Number of Service Health Messages found: " + response.data.ServiceHealthMessages.length);

        response.data.ServiceHealthMessages.forEach((shMsg: IServiceHealthMessage) => {
          const template = new ACData.Template(statusMessageCard);

          const card = template.expand({
            $root: shMsg,
          });

          const customCard = CardFactory.adaptiveCard(card);
          const preview = CardFactory.heroCard("🩺 " + shMsg.Title.replace("'", ""));
          const attachment = { ...customCard, preview };
          attachments.push(attachment);
        });
      }

      if (response.data.MessageCentreAnnouncements.length > 0) {

        Logger.info("Number of Message Centre Announcements found: " + response.data.MessageCentreAnnouncements.length);

        response.data.MessageCentreAnnouncements.forEach((mcaMsg: IServiceAnnouncement) => {
          const template = new ACData.Template(messageCentreAnnounceCard);
          const card = template.expand({
            $root: mcaMsg,
          });

          const customCard = CardFactory.adaptiveCard(card);
          const preview = CardFactory.heroCard("📢 " + mcaMsg.Title.replace("'", ""));

          const attachment = { ...customCard, preview };
          attachments.push(attachment);
        });
      }

    } catch (error) {

      Logger.error("Error: ", error);
    }

    // Return the result.
    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: attachments,
      },
    };
  }
}
