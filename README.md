# Microsoft Teams Development Community Samples

Microsoft Teams is highly extensible, allowing 3rd party and custom applications to run alongside the many Office 365 services already included in Teams. Just as you can add a Word tab or the Who bot in Teams, you can write your own tabs and bots. You can also write applications that run outside the Teams UI and use the Microsoft Graph API to access and curate Teams content.

Recently, Microsoft has enabled some of the features in Teams applications to work in Microsoft Outlook and the Microsoft 365 app. At the time of this writing, these are limited to personal tabs, search message extensions, and link unfurling. Many of the more recent samples work in these new locations.

This repository contains community samples that demonstrate different usage patterns for developing on Microsoft Teams as a platform. Samples are generally not production-ready, but are intended to show developers patterns and use cases for use in complete applications. Some samples are very bare bones to show how to do something specific, while others are partial or complete applications. Many are useful on their own, but it's up to you to check that they're secure and meet your standards.

This repo is maintained by the [Microsoft 365 & Power Platform Community](https://pnp.github.io/); please join our [community calls](https://pnp.github.io/#community) for announcements and sample demos every other Thursday. The "pnp" in the URL is for "Patterns and Practices", and it's all about sharing our patterns and practices for building solutions on Microsoft 365.

If you're looking for Teams development samples, here's a handy guide:

* **Code-first samples from the community belong in this repo**. 
* Code-first samples from Microsoft belong [in this repo](https://github.com/OfficeDev/Microsoft-Teams-Samples/tree/main)
* Samples using Teams Toolkit live [in this repo](https://github.com/officedev/teamsfx-samples)
* Power Platform samples from the community - including some Teams samples - can be found in [this repo](https://github.com/pnp/powerplatform-samples)

The easy way to browse through all the samples is to visit the [Microsoft 365 Sample Solution Gallery](https://adoption.microsoft.com/en-us/sample-solution-gallery/).

## Using the samples

To search all the samples, please visit our [Sample Browser](){target=_blank}, which aggreagates samples from this and other repositories.

To browse the samples in this repo, please visit the [/samples](/samples) folder. It contains a child folder for each sample, named with a prefix as follows:

| Prefix | Description |
| --- | --- |
| app- | These are samples of apps that have multiple Teams app capabilities such as a tab and a bot |
| bot- | These are apps that contain a chatbot for use in Teams |
| msgext- | These are apps that contain one or more messaging extensions, including link unfurling, search, and action message extensions |
| tabs- | These are apps that contain one or more tabs, including personal, group, channel, and meeting tabs |

Due to the diversity of the samples and technologies, there are no fixed instructions for building or using the samples. Each sample includes a readme file with a description, screen shot(s), requirements, and build instructions.

## Contributions

We welcome community contributions to the samples folder in this repository! If you've built something cool, or figured out how to do something that's usable by others, consider sharing it as a sample. 
Please see our [contribution guidelines](./CONTRIBUTING.md) for details. 

## Questions or Problems?

Please do not open GitHub issues for  support questions with Microsoft 365 or developer tools. The GitHub issues list should be used for sample requests and bug reports. This way we can more easily track actual issues or bugs from the code and keep the general discussion separate from the actual code.

If you have questions about how to develop Teams applications or any of the provided samples, please use the following resources:

| Technology | Location for issues/questions |
| --- | --- |
| General Teams development questions | [Stack Overflow for Teams](https://appsource.microsoft.com/en-us/product/office/WA200000739) |
| Bot Framework SDK | [Bot Framework resources](https://docs.microsoft.com/en-us/azure/bot-service/bot-service-resources-links-help?view=azure-bot-service-4.0) |
| Microsoft Graph | [Microsoft Graph Support](https://developer.microsoft.com/en-us/graph/support)  |
| Microsoft Teams JavaScript SDK | Use the feedback link at the footer of the [docs page](https://docs.microsoft.com/en-us/javascript/api/overview/msteams-client?view=msteams-client-js-latest) |
| SharePoint Framework with Teams | [sp-dev-docs repository issue list](https://github.com/SharePoint/sp-dev-docs/issues) |

## Contributions

These samples are from the Microsoft 365 developer community. We welcome your samples and suggestions for new ones.

Please have a look on our [Contribution Guidance](./CONTRIBUTING.md) before submitting your pull requests, so that we can get your contribution processed as fast as possible. Thx.

> Sharing is caring!

## Additional resources

### Teams applications

* [Teams Toolkit Learn Path](https://learn-ttk) - Hands on labs show you how to get started with Teams development using the Teams Toolkit for Visual Studio Code
* [Teams App Camp](https://aka.ms/app-camp) - Extensive hands-on labs guide you through the process of extending a simple web site to become a full featured Teams application
* [Teams App Camp New Adventure](https://aka.ms/app-camp-new) - More hands-on labs that show how to extend a web service to become a Teams message extension, including all styles of message extension and some advanced scenarios like calling the Microsoft Graph with SSO and calling Azure OpenAI.
* [Microsoft 365 Bootcamp: Build a Teams solution using SharePoint and SharePoint Framework](https://github.com/OfficeDev/M365Bootcamp-TeamsEmergencyResponse) - A hands-on lab in which you'll build a simulated "emergency response" solution in Teams using SharePoint pages, lists, and web parts.
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
    * Quickstarts: [.NET Core](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/csharp_dotnetcore/57.teams-conversation-bot), [JavaScript](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/javascript_nodejs/57.teams-conversation-bot), [Python](https://github.com/microsoft/BotBuilder-Samples/tree/main/samples/python/57.teams-conversation-bot)
    * [Create a bot for Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/create-a-bot-for-teams)

### Tabs

* [Microsoft Teams JavaScript Library](https://github.com/OfficeDev/BotBuilder-MicrosoftTeams): This library is used in Teams tabs to allow JavaScript running on the tab's web page to interact with Microsoft Teams
