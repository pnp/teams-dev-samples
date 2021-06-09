import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult } from "botbuilder";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { TaskModuleRequest, TaskModuleContinueResponse } from "botbuilder";
import { AppConfigurationClient } from "@azure/app-configuration";
import Utilities from "../api/Utilities";
import { Config } from "../../model/Config";
// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/actionConfigInAzureMessageExtension/config.html")
@PreventIframe("/actionConfigInAzureMessageExtension/action.html")
export default class ActionConfigInAzureMessageExtension implements IMessagingExtensionMiddlewareProcessor {
  public async onFetchTask(context: TurnContext, value: MessagingExtensionQuery): Promise<MessagingExtensionResult | TaskModuleContinueResponse> {
    const config = await Utilities.retrieveConfig();
    if(value.state && value.state?.indexOf("siteID") > -1){
      const newConfig = JSON.parse(value.state);
      config.SiteID = newConfig.siteID;
      config.ListID = newConfig.listID;
      await Utilities.saveConfig(config);
    }
    if (config.SiteID==="" || config.ListID ==="") { // 
      return Promise.resolve<MessagingExtensionResult>({
        type: "config", // use "config" or "auth" here
        suggestedActions: {
            actions: [
                {
                    type: "openUrl",
                    value: `https://${process.env.HOSTNAME}/actionConfigInAzureMessageExtension/config.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
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
          url: `https://${process.env.HOSTNAME}/actionConfigInAzureMessageExtension/action.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}`,
          height: "medium"
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
      const config = await Utilities.retrieveConfig();
      if (config.SiteID === "") {
        config.SiteID = process.env.SITE_ID!;
      }
      if (config.ListID === "") {
        config.ListID = process.env.LIST_ID!;
      }
      return Promise.resolve({
          title: "Action Config in Azure Configuration",
          value: `https://${process.env.HOSTNAME}/actionConfigInAzureMessageExtension/config.html?name={loginHint}&tenant={tid}&group={groupId}&theme={theme}&siteID=${config.SiteID}&listID=${config.ListID}`
      });
    }

    public async onSettings(context: TurnContext): Promise<void> {
        // take care of the setting returned from the dialog, with the value stored in state
        const setting = JSON.parse(context.activity.value.state);
        log(`New setting: ${setting}`);
        await Utilities.saveConfig({SiteID: setting.siteID, ListID: setting.listID});
        return Promise.resolve();
    }
}
