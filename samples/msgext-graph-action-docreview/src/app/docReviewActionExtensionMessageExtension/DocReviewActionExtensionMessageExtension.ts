import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { TaskModuleRequest, TaskModuleContinueResponse } from "botbuilder";
import { JsonDB } from "node-json-db";
// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/docReviewActionExtensionMessageExtension/config.html")
@PreventIframe("/docReviewActionExtensionMessageExtension/action.html")
export default class DocReviewActionExtensionMessageExtension implements IMessagingExtensionMiddlewareProcessor {

    public async onFetchTask(context: TurnContext, value: MessagingExtensionQuery): Promise<MessagingExtensionResult | TaskModuleContinueResponse> {
      const configFilename = process.env.CONFIG_FILENAME;
      const settings = new JsonDB(configFilename ? configFilename : "settings", true, false);
      if (value.state) {
        const settngs = JSON.parse(value.state);
        settings.push(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/siteID`, settngs.siteID);
        settings.push(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/listID`, settngs.listID);
      }
      let siteID: string;
      let listID: string;
      try {
        siteID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/siteID`);
        listID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/listID`);
      } 
      catch (err) {
        siteID = process.env.SITE_ID ? process.env.SITE_ID : '';
        listID = process.env.LIST_ID ? process.env.LIST_ID : '';
        return Promise.resolve<MessagingExtensionResult>({
          type: "config",
          suggestedActions: {
            actions: [
              {
                type: "openUrl",
                value: `https://${process.env.HOSTNAME}/docReviewActionExtensionMessageExtension/config.html?siteID=${siteID}&listID=${listID}`,
                title: "Configuration"
              }
            ]
          }
        });
      }

      return Promise.resolve<TaskModuleContinueResponse>({
        type: "continue",
        value: {
            title: "Input form",
            url: `https://${process.env.HOSTNAME}/docReviewActionExtensionMessageExtension/action.html`
        }
      });
    }


    // handle action response in here
    // See documentation for `MessagingExtensionResult` for details
    public async onSubmitAction(context: TurnContext, value: TaskModuleRequest): Promise<MessagingExtensionResult> {
      const card = CardFactory.adaptiveCard(
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
                      text: value.data.doc.name,
                      size: "Large",
                      weight: "Bolder"
                    },
                    {
                      type: "TextBlock",
                      text: value.data.doc.description,
                      size: "Medium"
                    },
                    {
                      type: "TextBlock",
                      text: `Author: ${value.data.doc.author}`
                    },
                    {
                      type: "TextBlock",
                      text: `Modified: ${value.data.doc.modified}`
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
              url: value.data.doc.url
          }
        ],
        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
        version: "1.0"
      });
      return Promise.resolve({
          type: "result",
          attachmentLayout: "list",
          attachments: [card]
      } as MessagingExtensionResult);
    }



    // this is used when canUpdateConfiguration is set to true
    public async onQuerySettingsUrl(context: TurnContext): Promise<{ title: string, value: string }> {
        return Promise.resolve({
            title: "Doc Review Action Extension Configuration",
            value: `https://${process.env.HOSTNAME}/docReviewActionExtensionMessageExtension/config.html`
        });
    }

    public async onSettings(context: TurnContext): Promise<void> {
        // take care of the setting returned from the dialog, with the value stored in state
        const setting = context.activity.value.state;
        log(`New setting: ${setting}`);
        return Promise.resolve();
    }

}
