
# Card Bot - Bot showcasing the Adaptive Card Universal Action Model in Node/TypeScript

This bot demonstrates [UAM](https://aka.ms/universal-actions-model) capabilities.

# Summary

A bot that lets an initiator ask a question in a Team/Group chat. The team mates can respond to the question with a form input. The initiator and the team mates see card updates in real time based on the actions or refresh feature of the adaptive card.

See it work!

![uam-image](./assets/uam.gif)

## Used Bot Framework Version

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.14.0-green.svg)

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```
- [Microsoft 365 dev tenant](https://developer.microsoft.com/en-us/microsoft-365/dev-program?WT.mc_id=m365-35338-rwilliams)

- [A bot](https://dev.botframework.com/bots/) with ` Messaging endpoint` as the ngrok url appended with `api/messages`

## Solution

Solution|Author(s)
--------|---------
bot-uam-cardbot | Rabia Williams

## Version history

Version|Date|Comments
-------|----|--------
1.0|July 19, 2021|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Install modules

    ```bash
    npm install
    ```
- Start the bot

    ```bash
    npm start
    ```
- Start [ngrok](https://ngrok.com/) with command below

```bash
ngrok http-host-header=localhost:3978 
```
- Copy the ngrok url with https and paste it in the BOT configuration under `Messaging endpoint`

- Update the `botId`, `validDomains` and other necessary properties in the `manifest.json` file in the folder `Manifest`.

- Zip the three files (manifest.json and the icons) which is now your `Microsoft Teams app`

- Upload it to `Microsoft Teams` and use it in a `Team` or `Group chat` to further test it.


## Further reading

- [Bot Framework Documentation](https://docs.botframework.com?WT.mc_id=m365-35338-rwilliams)
- [Bot in Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots?WT.mc_id=m365-35338-rwilliams)
- [Universal action model](https://docs.microsoft.com/en-us/microsoftteams/platform/task-modules-and-cards/cards/universal-actions-for-adaptive-cards/overview?WT.mc_id=m365-35338-rwilliams)
- [Bot generator](https://www.npmjs.com/package/generator-botbuilder)

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/bot-uamcardbot" />
