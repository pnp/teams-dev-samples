---
page_type: sample
products:
- teams
languages:
- javascript
extensions:
  contentType: samples
  technologies:
  - Bot Framework SDK
  platforms:
  - Restify
createdDate: 5/1/2019 12:00:00 AM
---
# StateBot

## Summary

This simple bot demonstrates conversation state and user state in Bot Framework v4

## Used Bot Framework Version

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.8.0-green.svg)

## Applies to

* [Azure Bot Framework 4.6+](#)
* [NodeJS 10.14.1+](https://nodejs.org/)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

## Prerequisites

- [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```

## Solution

Solution|Author(s)
--------|---------
bot-statebot | Bob German

## Version history

Version|Date|Comments
-------|----|--------
1.0|August 12, 2019|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* in the command line run:
  * `npm install`
  * `npm start`

### Testing the bot using Bot Framework Emulator

[Bot Framework Emulator](https://github.com/microsoft/botframework-emulator) is a desktop application that allows bot developers to test and debug their bots on localhost or running remotely through a tunnel.

- Install the Bot Framework Emulator version 4.3.0 or greater from [here](https://github.com/Microsoft/BotFramework-Emulator/releases)

#### Connect to the bot using Bot Framework Emulator

- Launch Bot Framework Emulator
- File -> Open Bot
- Enter a Bot URL of `http://localhost:3978/api/messages`

### Deploy the bot to Azure

To learn more about deploying a bot to Azure, see [Deploy your bot to Azure](https://aka.ms/azuredeployment) for a complete list of deployment instructions.

## Features

Description of the project with possible additional details than in short summary. 

This project illustrates the following concepts:

* Use of user state in a bot
* Use of conversation state in a bot

For illustrative purposes, try restarting the conversation with and without a new User ID in the Bot Framework Emulator.

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-webparts/samples/readme-template" />