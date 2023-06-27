## Summary

The purpose of this sample app is to convert different types of documents into PDF via the Microsoft Graph API, and then merge them together in order to form one document pack. It utilizes a Microsoft Teams tab with single sign-on enabled and uses an Azure function as its backend to interact with the Graph API. 

*See below an app architecture*

## App architecture
![add bookmark form](./assets/architecture-diagram.png)

## Demo
![Document pack demo](./assets/DocumentPack.gif)

## Prerequisites

1. Set up and install Teams Toolkit for Visual Studio Code v5.0 [How to install Teams Toolkit v5.0](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode).

2. [Node.js](https://nodejs.org/), supported versions: 14, 16, 18

3. An [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)


## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|June 25, 2023|Ejaz Hussain|Initial release

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome


### Debug application

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
4. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.
5. Allow the following Graph API permissions via the consent prompt

    | Graph API Permissions |
    |-----------------------|
    | User.Read             |
    | Files.ReadWrite.All   |
    | offline_access        |
    | openid                |
    | profile               |


6. You need to copy the following parameters from the env.local and env.local.user files and paste them into local.settings.json <mark>under the api folder of the Azure Function project</mark>.

    | Variables 	| Description 	|
    |---	|---	|
    | M365_CLIENT_ID 	| Your AAD App client id. 	|
    | M365_CLIENT_SECRET 	| Your AAD App client secret. 	|
    | M365_AUTHORITY_HOST 	| Authority host for your AAD tenant. 	|
    | M365_TENANT_ID 	| Tenant id for your AAD tenant. 	|
    | ALLOWED_APP_IDS 	| List of client ids which are allowed to call the function app. Split by semicolon ';' 	|    

7. Navigate to the API folder and open the Azure function in Visual Studio. Start debugging the Azure function project parallelly as well.

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-webparts/samples/bot-graph-bookmark" />