# Teams Toolkit v5.0 Pre-release

### What does pre-release mean?
Pre-release is meant for those who are eager to try the latest Teams Toolkit features and fixes. Even though pre-releases are not intended for use in production, they are at a sufficient quality level for you to generally use and [provide feedback](https://aka.ms/ttk-feedback). However, pre-release versions can and probably will change, and those changes could be major.

We've addressed a number of reported bugs and added major changes in this release based on your feedback to make Teams Toolkit more flexible. Some of the key highlights to these changes include:

- Use existing infrastructure, resource groups, and more when provisioning
- Use an existing Teams app ID
- Use an existing Azure AD app registration ID
- Use a different tunneling solution or customize the defaults
- Add custom steps to debugging, provisioning, deploying, publishing, etc.

### What about my existing Teams Toolkit projects?
The changes in this pre-release require upgrades to the TeamsFx configuration files. We recommend that you create a new app using this version. In the future, we'll provide a way to automatically upgrade existing Teams apps that were created with a previous version of Teams Toolkit.

Learn more about the changes in this pre-release at [https://aka.ms/teamsfx-v5.0-guide](https://aka.ms/teamsfx-v5.0-guide).

# Overview of the Command bot template

This template showcases an app that responds to chat commands by displaying UI using an Adaptive Card. This enables your users to type in simple messages in Teams and your application can provide an appropriate response based on the contents of the message.

The app template is built using the TeamsFx SDK, which provides a simple set of functions over the Microsoft Bot Framework to implement this scenario.

## Get Started with the Command bot

> **Prerequisites**
>
> To run the command bot template in your local dev machine, you will need:
>
> - [Node.js](https://nodejs.org/), supported versions: 14, 16, 18
> - An [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
>
> **Note**
>
> Your app can be installed into a team, or a group chat, or as personal app. See [Installation and Uninstallation](https://aka.ms/teamsfx-command-new#customize-installation).

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
4. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.
5. Type or select `helloWorld` in the chat to send it to your bot - this is the default command provided by the template.

The bot will respond to the `helloWorld` command with an Adaptive Card:

![Command and Response in Teams](https://user-images.githubusercontent.com/11220663/165891754-16916b68-c1b5-499d-b6a8-bdfb195f1fd0.png)

## What's included in the template

| Folder / File | Contents |
| - | - |
| `teamsapp.yml` | Main project file describes your application configuration and defines the set of actions to run in each lifecycle stages |
| `teamsapp.local.yml`| This overrides `teamsapp.yml` with actions that enable local execution and debugging |
| `env/`| Name / value pairs are stored in environment files and used by `teamsapp.yml` to customize the provisioning and deployment rules |
| `.vscode/` | VSCode files for debugging |
| `appPackage/` | Templates for the Teams application manifest |
| `infra/` | Templates for provisioning Azure resources |
| `src/` | The source code for the application |

The following files can be customized and demonstrate an example implementation to get you started.

| File | Contents |
| - | - |
| `src/index.ts` | Application entry point and `restify` handlers for command and response |
| `src/teamsBot.ts`  | An empty teams activity handler for bot customization |
| `src/adaptiveCards/helloworldCommand.json` | A generated Adaptive Card that is sent to Teams |
| `src/helloworldCommandHandler.ts` | The business logic to handle a command |
| `src/cardModels.ts` | The default Adaptive Card data model |

## Extend the command bot template with more commands and responses

Follow the steps below to add more commands and responses to extend the command bot:

1. [Step 1: Add a command definition in manifest](#step-1-add-a-command-definition-in-manifest)
2. [Step 2: Respond with an Adaptive Card](#step-2-respond-with-an-adaptive-card)
3. [Step 3: Handle the command](#step-3-handle-the-command)
4. [Step 4: Register the new command](#step-4-register-the-new-command)

### Step 1: Add a command definition in manifest

You can edit the manifest template file `appPackage\manifest.json` to include definitions of a `doSomething` command with its title and description in the `commands` array:

```json
"commandLists": [
  {
    "commands": [
        {
            "title": "helloWorld",
            "description": "A helloworld command to send a welcome message"
        },
        {
            "title": "doSomething",
            "description": "A sample do something command"
        }
    ]
  }
]
```

### Step 2: Respond with an Adaptive Card

To respond with an Adaptive Card, define your card in its JSON format. Create a new file `src/adaptiveCards/doSomethingCommandResponse.json`:

```json
{
  "type": "AdaptiveCard",
  "body": [
    {
      "type": "TextBlock",
      "size": "Medium",
      "weight": "Bolder",
      "text": "Your doSomething Command is added!"
    },
    {
      "type": "TextBlock",
      "text": "Congratulations! Your hello world bot now includes a new DoSomething Command",
      "wrap": true
    }
  ],
  "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
  "version": "1.4"
}
```

You can use the [Adaptive Card Designer](https://adaptivecards.io/designer/) to help visually design your Adaptive Card UI.

> Please note:

> - Respond with an Adaptive Card is optional, you can simply respond with plain texts.
> - If you'd like to send adaptive card with dynamic data, please refer to [this document](https://aka.ms/teamsfx-command-new#how-to-build-command-response-using-adaptive-card-with-dynamic-content).

### Step 3: Handle the command

The TeamsFx SDK provides a convenient class, `TeamsFxBotCommandHandler`, to handle when an command is triggered from Teams conversation message. Create a new file, `src/doSomethingCommandHandler.ts`:

```typescript
import { Activity, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import {
  CommandMessage,
  TeamsFxBotCommandHandler,
  TriggerPatterns,
  MessageBuilder,
} from "@microsoft/teamsfx";
import doSomethingCard from "./adaptiveCards/doSomethingCommandResponse.json";
import { AdaptiveCards } from "@microsoft/adaptivecards-tools";
import { CardData } from "./cardModels";

export class DoSomethingCommandHandler implements TeamsFxBotCommandHandler {
  triggerPatterns: TriggerPatterns = "doSomething";

  async handleCommandReceived(
    context: TurnContext,
    message: CommandMessage
  ): Promise<string | Partial<Activity>> {
    // verify the command arguments which are received from the client if needed.
    console.log(`App received message: ${message.text}`);

    const cardData: CardData = {
      title: "doSomething command is added",
      body: "Congratulations! You have responded to doSomething command",
    };

    const cardJson = AdaptiveCards.declare(doSomethingCard).render(cardData);
    return MessageFactory.attachment(CardFactory.adaptiveCard(cardJson));
  }
}
```

You can customize what the command does here, including calling an API, process data, etc.

### Step 4: Register the new command

Each new command needs to be configured in the `ConversationBot`, which powers the conversational flow of the command bot template. Navigate to the `src/internal/initialize.ts` file and update the `commands` array of the `command` property:

```typescript
import { HelloWorldCommandHandler } from "../helloworldCommandHandler";
import { DoSomethingCommandHandler } from "../doSomethingCommandHandler";
import { BotBuilderCloudAdapter } from "@microsoft/teamsfx";
import ConversationBot = BotBuilderCloudAdapter.ConversationBot;

const commandApp = new ConversationBot({
  //...
  command: {
    enabled: true,
    commands: [new HelloWorldCommandHandler(), new DoSomethingCommandHandler()],
  },
});
```

Congratulations, you've just created your own command! To learn more about the command bot template, [visit the documentation on GitHub](https://aka.ms/teamsfx-command-new). You can find more scenarios like:

- [Customize the trigger pattern](https://aka.ms/teamsfx-command-new#customize-the-trigger-pattern)
- [Customize the Adaptive Card with dynamic content](https://aka.ms/teamsfx-command-new#how-to-build-command-response-using-adaptive-card-with-dynamic-content)
- [Change the way to initialize the bot](https://aka.ms/teamsfx-command-new#customize-initialization)
- [Connect to an existing API](https://aka.ms/teamsfx-command-new#connect-to-existing-api)
- [Access Microsoft Graph](https://aka.ms/teamsfx-add-sso)

## Extend command bot with other bot scenarios

Command bot is compatible with other bot scenarios like notification bot and workflow bot.

### Add notifications to your command bot

The notification feature adds the ability for your application to send Adaptive Cards in response to external events. Follow the [steps here](https://aka.ms/teamsfx-command-new#how-to-extend-my-command-and-response-bot-to-support-notification) to add the notification feature to your command bot. Refer [the notification document](https://aka.ms/teamsfx-notification-new) for more information.

### Add workflow to your command bot

Adaptive cards can be updated on user action to allow user progress through a series of cards that require user input. Developers can define actions and use a bot to return an Adaptive Cards in response to user action. This can be chained into sequential workflows. Follow the [steps here](https://aka.ms/teamsfx-workflow-new#add-more-card-actions) to add workflow feature to your command bot. Refer [the workflow document](https://aka.ms/teamsfx-workflow-new) for more information.

## Additional information and references

- [Manage multiple environments](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-multi-env)
- [Collaborate with others](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-collaboration)
- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-cli)
- [TeamsFx SDK](https://docs.microsoft.com/microsoftteams/platform/toolkit/teamsfx-sdk)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)
