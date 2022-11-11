---
page_type: sample
products:
- teams
languages:
- csharp
extensions:
  contentType: samples
  technologies:
  - Microsoft Teams
  - Bot Framework
  - Adaptive Cards
  platforms:
  - ASP.NET Core MVC
  createdDate: 5/1/2019 12:00:00 AM
---
# Consulting Bot

## Summary

This app demonstrates two styles of Bot conversation - using natural language (best for 1:1 conversation) and using adaptive cards (best for Teams channels and group chat). It also includes a simple query messaging extension and an action messaging extension using a task dialog.

![picture of the bot in action](assets/using-bot2-detail.png)

## Used Bot Framework Version

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.6-green.svg)

## Applies to

* [Azure Bot Framework 4.0+](#)
* [.NET Core 2.1 or greater](#)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

> Update accordingly as needed.

## Prerequisites

* Azure subscription including LUIS and QnA Maker resources
* For local/debug execution, use of the [ngrok](https://ngrok.com/) tunneling service is recommended to provide access to your local debugger from the Azure Bot Channel Service (on the internet)

## Solution

Solution|Author(s)
--------|---------
Consulting Bot | Bob German

## Version history

Version|Date|Comments
-------|----|--------
1.0|April 23, 2020|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* Set up [LUIS](https://luis.ai)
  * If you don't already have one, create a [LUIS Authoring Resource](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/luis-how-to-azure-subscription)
  * Import the [Consulting Bot LUIS Model](ConsultingBot/Model/LuisConsultingProjectModel.json) into a new app in your LUIS authoring resource
  * Train and publish the app, noting the application ID, and the Prediction Resource primary or secondary key and endpoint URL
* Set up [QnA Maker](https://qnamaker.ai)
  * If you don't already have one, create a [QnA Maker Service](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/how-to/set-up-qnamaker-service-azure#create-a-new-qna-maker-service)
  * Create a knowledge base with the content of your choice. If the LUIS model is unable to determine the user's intent, this knowledge base will be used to respond. Note the knowledge base ID, the authorization endpoint key, and the endpoint host.
* Obtain a [Bing Maps Key](https://docs.microsoft.com/en-us/bingmaps/getting-started/bing-maps-dev-center-help/getting-a-bing-maps-key) for rendering maps of consulting locations in the messaging extension adaptive cards
* Set up the Azure Bot registration
  * [Create a new Azure Bot registration](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0) resource in your Azure subscription, noting the Bot's App ID. Follow the instructions and also get the [registration password](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-quickstart-registration?view=azure-bot-service-3.0#get-registration-password) for the bot registration.
* To run the solution locally:
  * Copy appSettings.sample.json to a new file, appSettings.json. Enter the values you noted above into appSettings.json (it will not be checked into source control). 
  
| Setting | Description |
|--|--|
|MicrosoftAppId|Bot Application ID from the Azure Bot registration|
|MicrosoftAppPassword|Bot Application password (secret) from the Azure Bot registration|
|LuisAppId|The app ID for the LUIS app|
|LuisAPIKey|The API key for the LUIS app|
|LuisAPIHostName|The API hostname (not the whole URL) for your LUIS app, such as "westus.api.cognitive.microsoft.com"|
|QnAKnowledgebaseId|The QnA Maker knowledge base ID for your knowledge base|
|QnAEndpointKey|The QnA Maker endpoint key for your knowledge base|
|QnAEndpointHostName|The URL of your QnA Maker service, such as https://qna-dev18.azurewebsites.net/qnamaker|
|BingMapsAPIKey|The Bing Maps API key|

  * Start ngrok from a command line and leave it running. Note the ngrok URL (if you use the free ngrok service, this will be different each time you run ngrok)
  * Edit the Azure Bot registration and update the messaging endpoint with your ngrok URL, such as https://12345.ngrok.io/api/messages 

  ~~~ shell
  ngrok http 3978 -host-header=localhost:3976
  ~~~

  * Run the bot locally, either in Visual Studio, or with [.NET Core 2.1 or greater](#),

  ~~~ shell
  cd ConsultingBot
  dotnet run
  ~~~
* To run the bot in Azure
  * Publish the application to an Azure App Service
  * Set the App Service settings as above
  * Edit the Azure Bot registration and update the messaging endpoint with your app service url, such as https://mybot.azurewebsites.net/api/messages

  * To access the bot from Microsoft Teams
    * Edit the [Teams Manifest](ConsultingBot/TeamsManifest/manifest.json) replacing the Bot ID with the bot registration's application ID
    * Update the ConsultingApp.zip archive with the updated Teams manifest
    * Install the ConsultingApp.zip file in your Teams enterprise app catalog, upload it into a Team, or import and install it using [Teams App Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview)

## Features

|Feature|Description|
|---|---|
|Conversational dialog|Instruct the bot to bill hours to a client using utterances such as "today I worked 20 minutes on forth coffee", "bill 1 hour to contoso", or terse utterances such as "last tuesday 1 hr forth". (Supported client names are [here](ConsultingData/Models/MockClients.cs) and project names are [here](ConsultingData/Models/MockProjects.cs))
|Adaptive card dialog|Instruct the bot to add someone in the Team where the bot is running to a project, and the bot captures the needed data via an adaptive card. Shows card submission via Invoke activities|
|Query messaging extension|Look up a project and insert a summary card, including a map, into the conversation|
|Action messaging extension|Add someone to a project via an adaptive card in a task module|

Note that the project names are included in a list entity in the LUIS model. In an actual application, you would need to update this entity as projects are added and removed using the [LUIS REST API](https://docs.microsoft.com/en-us/azure/cognitive-services/luis/get-started-get-model-rest-apis?pivots=programming-language-csharp); this is not included in the demo.

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/app-consulting-bot/readme" />