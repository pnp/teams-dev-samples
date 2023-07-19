import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;
import { TeamsActivityHandler } from "botbuilder";
import { MessageBuilder } from "@microsoft/teamsfx";
import welcomeCard from "../adaptiveCards/welcome.json";
import config from "./config";
import { UserQueryHandler } from "../userQueryHandler";

// Create the command bot and register the command handlers for your app.
// You can also use the commandBot.command.registerCommands to register other commands
// if you don't want to register all of them in the constructor

export const commandBot = new ConversationBot({
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
      scopes: ["User.Read", "Calendars.Read", "Tasks.Read"],
      initiateLoginEndpoint: `https://${config.botDomain}/auth-start.html`,
      authorityHost: config.authorityHost,
      clientId: config.clientId,
      tenantId: config.tenantId,
      clientSecret: config.clientSecret,
    },
  },
  command: {
    enabled: true,
    commands: [],
    ssoCommands: [new UserQueryHandler()],
  }
});

class WelcomeBot extends TeamsActivityHandler {

  constructor() {
    super();

    this.onMembersAdded(async (context, next) => {
      const membersAdded = context.activity.membersAdded;
      for (let cnt = 0; cnt < membersAdded.length; cnt++) {
        if (membersAdded[cnt].id) {
          await context.sendActivity(MessageBuilder.attachAdaptiveCard(welcomeCard, null));
          break;
        }
      }
      await next();
    });
  }

  async run(context) {
    await super.run(context);
  }
}

export const welcomeBot = new WelcomeBot();
