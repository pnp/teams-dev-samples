import { HelloWorldCommandHandler } from "../commands/helloworldCommandHandler";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import config from "./config";

import { SubmitActionHandler } from "../cardActions/SubmitActionHandler";
import { ProfileCommandHandler } from "../commands/profileCommandHandler";
import { BookmarkCommandHandler } from "../commands/BookmarkCommandHandler";

// Create the command bot and register the command handlers for your app.
// You can also use the commandApp.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor
export const commandApp = new ConversationBot({
  // The bot id and password to create CloudAdapter.
  // See https://aka.ms/about-bot-adapter to learn more about adapters.
  adapterConfig: {
    MicrosoftAppId: config.botId,
    MicrosoftAppPassword: config.botPassword,
    MicrosoftAppType: "MultiTenant",
  },
  // See https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk to learn more about ssoConfig
  ssoConfig: {
    aad: {
      scopes: ["User.Read"],
      initiateLoginEndpoint: `https://${config.botDomain}/auth-start.html`,
      authorityHost: config.authorityHost,
      clientId: config.clientId,
      tenantId: config.tenantId,
      clientSecret: config.clientSecret,
    }
  },
  command: {
    enabled: true,
    commands: [new HelloWorldCommandHandler()],    
    ssoCommands: [new ProfileCommandHandler(), new BookmarkCommandHandler()],
  },
  cardAction: {
    enabled: true,
    actions: [new SubmitActionHandler()],
  },
});
