# Teams SSO Bot - Personal Assistant - OpenAI Function Calling with Microsoft Graph

## Summary

- This sample Teams bot that provides information to the current logged in user. 
- The information can be the user's basic details or user's calendar details or user's tasks. - The information exchanged between the user and the chatbot is in natural language. 
- The chatbot uses [OpenAI's function calling feature](https://openai.com/blog/function-calling-and-other-api-updates) to understand whether a function in the code needs to be called based on user's query. 
- The chatbot uses Microsoft Graph API to get the user's details or details from calendar or tasks.
- Single Sign-on is implemented using `botbuilder` and Teams Framework to call Microsoft Graph API.
- That JSON response from Microsoft Graph is the transformed into a natural language response by OpenAI and sent back to the user.


![Personal Assistant Bot](assets/images/bot-pa.gif)

## Prerequisites
- [Node.js](https://nodejs.org/), supported versions: 16, 18
- A Microsoft 365 tenant in which you have permission to upload Teams apps. You can get a free Microsoft 365 developer tenant by joining the [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program).
- [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.0.0 and higher or [TeamsFx CLI](https://aka.ms/teamsfx-cli)
- Open AI API key. You can get a key from <https://platform.openai.com/account/api-keys>

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|July 10, 2023|Anoop T|Initial release

## Credits

Credits to Microsoft for creating a the [Teams Bot SSO sample](https://github.com/OfficeDev/TeamsFx-Samples/tree/dev/bot-sso) that demonstrates using SSO in a Teams bot.

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal path to awesome
- In the `env/.env.local` and `env/.env.dev` file, fill in the value for `OPENAI_API_KEY` with your Open AI API key.
       ```
       OPENAI_API_KEY=<your-openai-api-key>
       ```
### Run the app locally
- From VS Code:
    1. hit `F5` to start debugging. Alternatively open the `Run and Debug Activity` Panel and select `Debug (Edge)` or `Debug (Chrome)`.
- From TeamsFx CLI:
    1. Install [ngrok](https://ngrok.com/download).
    1. Sign up an ngrok account in https://dashboard.ngrok.com/signup. Copy your personal ngrok authtoken from https://dashboard.ngrok.com/get-started/your-authtoken.
    1. Start your local tunnel service by running the command `ngrok http 3978 --authtoken=<your-personal-ngrok-authtoken>`.
    1. In the `env/.env.local` file, fill in the values for `BOT_DOMAIN` and `BOT_ENDPOINT` with your ngrok URL.
       ```
       BOT_DOMAIN=sample-id.ngrok.io
       BOT_ENDPOINT=https://sample-id.ngrok.io
       ```
    1. Run command: `teamsfx provision --env local` .
    1. Run command: `teamsfx deploy --env local` .
    1. Run command: `teamsfx preview --env local` .

### Deploy the app to Azure
- From VS Code:
    1. Sign into Azure by clicking the `Sign in to Azure` under the `ACCOUNTS` section from sidebar.
    1. Click `Provision` from `LIFECYCLE` section or open the command palette and select: `Teams: Provision`.
    1. Click `Deploy` or open the command palette and select: `Teams: Deploy`.
- From TeamsFx CLI:
    1. Run command: `teamsfx account login azure`.
    1. Run command: `teamsfx provision --env dev`.
    1. Run command: `teamsfx deploy --env dev`.

### Preview the app in Teams
- From VS Code:
    1. Open the `Run and Debug Activity` Panel. Select `Launch Remote (Edge)` or `Launch Remote (Chrome)` from the launch configuration drop-down.
- From TeamsFx CLI:
    1. Run command: `teamsfx preview --env dev`.

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/bot-sso-openai-personal-assistant" />