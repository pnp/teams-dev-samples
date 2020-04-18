# Microsoft Teams Development Community Samples

This repository contains community samples that demonstrate different usage patterns for developing on Microsoft Teams as a platform. Samples are generally not production-ready, but are intended to show developers specific patterns and use cases for use in complete applications.

> We welcome community contributions to the samples folder in this repository for demonstrating different patterns and use cases with Microsoft Teams. Samples should follow folder naming conventions, and should contain a readme markdown file based on the appropriate template. Due to the diversity of technologies in use, each sample readme includes instructions for building and testing the sample. Please see our [contribution guidelines](#) for details.

> If you use 3rd party libraries, please make sure that library license allows distributions of it as part of your sample.

Microsoft Teams is highly extensible, allowing 3rd party and custom applications to run alongside the many Office 365 services already included in Teams. Just as you can add a Word tab or the Who bot in Teams, you can write your own tabs and bots. You can also write applications that run outside the Teams UI and use the Microsoft Graph API to access and curate Teams content.

This community sample repository aims to cover all these cases, and is organized as follows:

## /samples/dotnetcore

These samples are written in .NET Core, and may include those written using Microsoft Visual Studio and those using command line tools and a text editor such as Visual Studio Code. 

Each sample is in a folder named with a prefix as follows:

| Prefix | Description |
| --- | --- |
| app- | These are samples of apps that have multiple features such as a tab and a bot |
| bot- | These are simple bots, intended to show a single capability or pattern |
| msgext- | These are simple messaging extensions, intended to show a single capability or pattern |

## /samples/lowcode

These samples are written using low-code technologies such as Power Apps and Power Automate.

Each sample is in a folder named with a prefix as follows:

| Prefix | Description |
| --- | --- |
| flow- | These are sample Power Automate flows |
| powerapp- | These are simple tabs built with Microsoft Power Apps |

## /samples/node

These samples are written in node.js, and may include those written in JavaScript or TypeScript. 

Each sample is in a folder named with a prefix as follows:

| Prefix | Description |
| --- | --- |
| app- | These are samples of apps that have multiple features such as a tab and a bot |
| bot- | These are simple bots, intended to show a single capability or pattern |
| msgext- | These are simple messaging extensions, intended to show a single capability or pattern |

## /samples/tabs

These samples are single-page applications intended for use as tabs in Microsoft Teams. 

Each sample is in a folder named with a prefix as follows:

| Prefix | Description |
| --- | --- |
| spa- | These are single-page applications for general use in web-based applications |
| spfx- | These are SharePoint Framework web parts intended for use as Teams tabs |

The complete folder name should include the UI framework or library in use, such as angular, react, or js (for no framework). For example,

    spfx-react-field-visit-demo

is a Teams tab implemented using SharePoint framework and React called "field visit demo".

Additional folders will be added as needed for other development frameworks

## Have issues or questions?

If you have issues or questions on a specific sample, please use [the issues list in this repository](#).
If you have issues with the libraries, SDKs, services, or tools used to develop your applications, please file them in the appropriate location for that technology.

| Technology | Location for issues/questions |
| --- | --- |
| Azure Bot Framework | |
| Bot Builder SDK |  |
| Microsoft Graph SDK | |
| Microsoft Teams JavaScript SDK | |
| SharePoint Framework with Teams | [sp-dev-docs repository issue list](https://github.com/SharePoint/sp-dev-docs/issues) |

## More Samples

### Bot SDK 4.6+

* [App Templates for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/samples/app-templates): These open source, production-ready applications are also great samples showing how to build robust Teams applications complete with Resource Manager templates for easy deployment in Azure

* [ButBuilder-Samples](https://github.com/microsoft/BotBuilder-Samples): Dozens of simple samples showing how to do various things in Bot Builder SDK, including some Teams examples

### Bot SDK 4.0-4.5

* [Contoso HR Sample](https://github.com/OfficeDev/msteams-sample-contoso-hr-talent-app): HR recruiting sample for hands-on lab experience. Uses Bot Framework 4.4 with Teams-specific operations hard-coded; needs update to 4.6+ to follow best practices.

* [Microsoft Teams FAQ Plus Plus](https://github.com/OfficeDev/microsoft-teams-faqplusplus-app/tree/master/Source)

### Bot Builder SDK 3.x

* Microsoft Teams Sample Complete ([C#](https://github.com/OfficeDev/microsoft-teams-sample-complete-csharp), [Node](https://github.com/OfficeDev/microsoft-teams-sample-complete-node)): This Bot sample uses v3 of the Bot Builder SDK which is now obsolete 


## Additional resources

### Teams applications

* [Teams Platform Overview](https://docs.microsoft.com/en-us/microsoftteams/platform/overview)


### Bots

* Azure Bot Service: [main page](https://azure.microsoft.com/en-us/services/bot-service/)
* Azure Bot SDK: [main page](https://dev.botframework.com/), [repo](https://github.com/microsoft/botframework-sdk)
* Azure Cognitive Services: 
    * [QnA Maker](https://www.qnamaker.ai/) finds answers to questions
    * [LUIS](https://www.luis.ai)  predicts user's intent and enties
    * [QnA Maker and LUIS together](https://docs.microsoft.com/en-us/azure/cognitive-services/qnamaker/tutorials/integrate-qnamaker-luis)
* [Bots in Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/what-are-bots)
* Tutorials: 
    * [5-minute quickstarts](https://docs.microsoft.com/en-us/azure/bot-service/?view=azure-bot-service-4.0#5-minute-quickstarts)
    * Quickstarts: [.NET Core](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/csharp_dotnetcore/57.teams-conversation-bot), [JavaScript](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/javascript_nodejs/57.teams-conversation-bot), [Python](https://github.com/microsoft/BotBuilder-Samples/tree/master/samples/python/57.teams-conversation-bot)
    * [Create a bot for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/create-a-bot-for-teams)

### Tabs

* [Microsoft Teams JavaScript Library](https://github.com/OfficeDev/BotBuilder-MicrosoftTeams): This library is used in Teams tabs to allow JavaScript running on the tab's web page to interact with Microsoft Teams

## Using the samples

Due to the diversity of the samples and technologies, there are no fixed instructions for building or using the samples. Each sample should include a readme file with build instructions.


## Contributions

These samples are from the Microsoft 365 developer community. We welcome your samples and suggestions for new samples. 

Please have a look on our [Contribution Guidance](./.github/CONTRIBUTING.md) before submitting your pull requests, so that we can get your contribution processed as fast as possible. Thx.

> Sharing is caring!