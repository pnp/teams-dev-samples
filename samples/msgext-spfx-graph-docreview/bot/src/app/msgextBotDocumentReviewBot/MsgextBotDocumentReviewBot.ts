import { BotDeclaration, MessageExtensionDeclaration, PreventIframe } from "express-msteams-host";
import * as debug from "debug";
import { DialogSet, DialogState } from "botbuilder-dialogs";
import { StatePropertyAccessor, CardFactory, TurnContext, MemoryStorage, ConversationState, ActivityTypes, TeamsActivityHandler, MessagingExtensionAction, CardAction, CardImage, MessagingExtensionActionResponse } from "botbuilder";
import HelpDialog from "./dialogs/HelpDialog";
import WelcomeCard from "./dialogs/WelcomeDialog";

// Initialize debug logging module
const log = debug("msteams");

/**
 * Implementation for Msgext Bot Document Review Bot
 */
@BotDeclaration(
    "/api/messages",
    new MemoryStorage(),
    process.env.MICROSOFT_APP_ID,
    process.env.MICROSOFT_APP_PASSWORD)

export class MsgextBotDocumentReviewBot extends TeamsActivityHandler {
  private readonly conversationState: ConversationState;
  private readonly dialogs: DialogSet;
  private dialogState: StatePropertyAccessor<DialogState>;

  /**
   * The constructor
   * @param conversationState
   */
  public constructor(conversationState: ConversationState) {
    super();        
  }

  /**
   * Handles the task/fetch operation
   * That is when the Bot hero card calls the 'Review' button
   * @param context 
   * @param value 
   */
  protected handleTeamsTaskModuleFetch(context: TurnContext, value: any): Promise<any> {
    console.log(context);
    console.log(value);
    const componentID = '75f1c63b-e3d1-46b2-957f-3d19a622c463';
    const itemID = value.data.item.key;
    return Promise.resolve({
      task: {
        type: "continue",
        value: {
          title: "Mark document as reviewed",
          height: 300,
          width: 400,
          url: `https://{teamSiteDomain}/_layouts/15/TeamsLogon.aspx?SPFX=true&dest=/_layouts/15/teamstaskhostedapp.aspx%3Fteams%26personal%26componentId=${componentID}%26forceLocale={locale}%26itemID=${itemID}`,
          fallbackUrl: `https://{teamSiteDomain}/_layouts/15/TeamsLogon.aspx?SPFX=true&dest=/_layouts/15/teamstaskhostedapp.aspx%3Fteams%26personal%26componentId=${componentID}%26forceLocale={locale}`
        }
      }
    });
  }

  /**
   * Handles the selection of a document from the task module
   * @param context 
   * @param action 
   */
  protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<any> {
    const docCard = CardFactory.adaptiveCard(
      {
        type: "AdaptiveCard",
        body: [
          {
            type: "ColumnSet",
            columns: [
                {
                  type: "Column",
                  width: 25,
                  items: [
                    {
                      type: "Image",
                      url: `https://${process.env.HOSTNAME}/assets/icon.png`,
                      style: "Person"
                    }
                  ]
                },
                {
                  type: "Column",
                  width: 75,
                  items: [
                    {
                      type: "TextBlock",
                      text: action.data.name,
                      size: "Large",
                      weight: "Bolder"
                    },
                    {
                      type: "TextBlock",
                      text: action.data.description,
                      size: "Medium"
                    },
                    {
                      type: "TextBlock",
                      text: `Author: ${action.data.author}`
                    },
                    {
                      type: "TextBlock",
                      text: `Modified: ${action.data.modified}`
                    }
                  ]
                }
            ]
          }
        ],
        actions: [
          {
              type: "Action.OpenUrl",
              title: "View",
              url: action.data.url
          },          
          {
            type: "Action.Submit",
            title: "Reviewed",
            data: {
              item: action.data,
              msteams: {
                type: "task/fetch"
              }  
            } 
                 
          }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.0"
      });
    const response: MessagingExtensionActionResponse = {
      composeExtension: {
        type: 'result',
        attachmentLayout: 'list',
        attachments:  [ docCard ]
      }
    }
    return Promise.resolve(response);
  }
}
