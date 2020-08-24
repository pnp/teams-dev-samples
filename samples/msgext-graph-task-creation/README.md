# Microsoft Graph Task Creation Messaging Extension

## Summary

This Teams messaging extension lets you create To Do or Planner tasks directly within a Teams conversation (1:1, group or teams conversation)!

![picture of the app in action](docs/MsgExt0.png)

A complete step-by-step walkthrough of this sample is provided [here](https://bisser.io/bot-framework-teams-messaging-extensions-walkthrough/).
This sample was originally taken from the [Bot Builder Community repo](https://github.com/BotBuilderCommunity/botbuilder-community-dotnet).

## Frameworks

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.9-green.svg)
![drop](https://img.shields.io/badge/.NET&nbsp;Core-3.1-green.svg)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Azure subscription](https://azure.microsoft.com/en-us/free/) (only needed if you want to deploy your bot to Azure)
* [Ngrok](https://ngrok.com/)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|August 24, 2020|[Stephan Bisser](https://bisser.io)|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* Start ngrok in the command line:
  * `ngrok http -host-header=rewrite 3978` and note your ngrok URL
* [Register an Azure AD application](#Create-Azure-AD-App-Registration)
* [Create Azure Bot Channels Registration](#Create-Azure-Bot-Channels-Registration)
* [Update App Settings](#Update-App-Settings)
* Create your Teams app following [this tutorial](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload)
* Run your bot:
  * In the command line run:
    * `dotnet restore`
    * `dotnet run`
  * OR hit `F5` in Visual Studio
* Use your bot in Teams

## Features

This messaging extension lets you create a task for the fowolling services directly within a conversation using the Microsoft Graph endpoints:

* [Microsoft To Do](https://todo.microsoft.com/tasks/)
* [Microsoft Planner](https://tasks.office.com/SolvionAT.onmicrosoft.com/en-US/Home/Planner/)

## Create Azure AD App Registration

The first thing we need is to setup a new Azure AD app registration, as we want to use the [Microsoft Graph](https://docs.microsoft.com/en-us/graph/overview) to handle the task management processing. Therefore we need to go over to our Azure portal and create a new Azure AD App registration (like shown [here](https://docs.microsoft.com/en-us/azure/active-directory/develop/howto-create-service-principal-portal#create-an-azure-active-directory-application)):

![Create AAD app registation](docs/msgExt1.png)

While creating your app registration you need to provied the url `https://token.botframework.com/.auth/web/redirect` as a redirect URI to establish a conncetion to the Bot Framework for grabbing your authentication token.

Next up, we need to add some API permissions to our app to make sure we can use the Graph to perform certain tasks (don't forget to grant admin consent for those permissions after adding them):

![Add app permissions](docs/msgExt2.png)

## Create Azure Bot Channels Registration

After the Azure AD App Registration has been created, you can create a new Bot Channels Registration in the Azure portal (make sure to insert your ngrok URL as messaging endpoint in the format `https://yourngrokURL/api/messages`):

![Create BCR](docs/msgExt3.png)

After it has been created, you need to add our previously created app registration to the OAuth Connection Settings of your bot:

![Add OAuth settings](docs/msgExt4.png)

From here you need to provide the following details:

![Add OAuth settings](docs/msgExt5.png)

After saving you can validate your service provider connection setting to see if you can connect to your AAD app registration and get a token from there:

![Test OAuth settings](docs/msgExt6.png)

The last thing you need to grab is the Microsoft App ID and App secret for the Bot Channels Registration which can be found from the Azure AD App Registration pane as well.

## Update App Settings

Update the appsettings.json with the correct values:

```json
{
  "MicrosoftAppId": "yourBotAppID",
  "MicrosoftAppPassword": "yourBotAppSecret",
  "ConnectionNameGraph": "yourABSConnectionSettingName",
  "tenantId": "yourAADTenantID",
  "serviceUrl": "https://smba.trafficmanager.net/emea/"
}
```

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/msgext-graph-task-creation" />
