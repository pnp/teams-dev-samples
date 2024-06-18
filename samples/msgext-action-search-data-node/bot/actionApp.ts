import {
  TeamsActivityHandler,
  CardFactory,
  TurnContext,
  MessagingExtensionAction,
  MessagingExtensionActionResponse,
  AdaptiveCardInvokeResponse,
  AdaptiveCardInvokeValue,
  MessageFactory,
} from "botbuilder";
import * as ACData from "adaptivecards-templating";
import { updateOrders } from "./services/azServices";
import DisplayProductOrder from "./adaptiveCards/DisplayProductOrder.json";
import OderCard from "./adaptiveCards/OrderForm.json";
import IProduct from "./Model/IProduct";

export class ActionApp extends TeamsActivityHandler {
  
  public async handleTeamsMessagingExtensionFetchTask(_context: TurnContext, _action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
    const taskModuleUrl = `${process.env.TAB_ENDPOINT}/index.html#/initialaction`;
    const resp: MessagingExtensionActionResponse = {
      task: {
        type: 'continue',
        value: {
          width: "large",
          height: "large",
          title: "Select a Product",
          url: taskModuleUrl
        }
      }
    }
    return resp;
  }

  public async handleTeamsMessagingExtensionSubmitAction(
    context: TurnContext,
    action: MessagingExtensionAction
  ): Promise<MessagingExtensionActionResponse> {
    
    const template = new ACData.Template(OderCard);
    const card = template.expand({
      $root: {
        Id: action.data.product.Id ?? "",
        Category: action.data.product.Category ?? "",
        Name: action.data.product.Name ?? "",
        Orders: action.data.product.Orders ?? "",
      },
    });
    const attachment = CardFactory.adaptiveCard(card);
    return {
      composeExtension: {
        type: "result",
        attachmentLayout: "list",
        attachments: [attachment],
      },
    };
  }

  public async onAdaptiveCardInvoke(_context: TurnContext, _invokeValue: AdaptiveCardInvokeValue): Promise<AdaptiveCardInvokeResponse> {
    const cardData: Record<string, unknown> =  _invokeValue.action.data;
    const prodUpdate: IProduct = await updateOrders(cardData);

    const template = new ACData.Template(DisplayProductOrder);
    const card = template.expand({
      $root: {
        Category: prodUpdate.Category,
        Name: prodUpdate.Name,
        Orders: prodUpdate.Orders.toString()
      },
    });
    const attachment = CardFactory.adaptiveCard(card);
    var messageActivity = MessageFactory.attachment(attachment);
    await _context.sendActivity(messageActivity);

    const resp: AdaptiveCardInvokeResponse = {
      statusCode: 200,
      value: null,
      type: "result"
    }
    return Promise.resolve(resp);
  }
}
