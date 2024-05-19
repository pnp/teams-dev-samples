# Introduction

Demo app that shows how to use a Teams Message extension and extend to Copilot for Microsoft 365. This app uses the Microsoft 365 Tenant Service Health and Announcements API to get the data and display it in the Teams Message extension.

I have used the Microsoft Teams Toolkit to create this app. The Microsoft Teams Toolkit is a Visual Studio Code extension that makes it easy to create, develop, and deploy Teams apps.


Additional features include:

- Supporting the app is an Azure Function that is used to get the data from the Microsoft 365 Tenant Service Health and Announcements API - this is simulating the backend service that would be used in a production app.
- This includes use of SharePoint lists for caching the service health and announcements data for faster retrieval.
- The app is deployed to Azure using GitHub Actions.

## Architecture Overview

The architecture of the app is as follows:

![Architecture Diagram of the App](./docs/assets/architecture.png)

> Note: for now parts of the setup are manual, please follow [the setup guide](docs/setup.md) for the backend service and the SharePoint list.

## Key Areas of focus when extending Copilot for Microsoft 365

- Update your application to the latest manifest verison (1.17 or higher) to support Copilot for Microsoft 365.
- Application, Command & Command Parameter Descriptions ensuring that the app is clear and concise in what it does, the purpose of the app, and the data that it will access. Copilot will assess this and determine if the app will be used in the response. There is a `semanticDescriptions` property in the manifest that can be used to provide this information for the LLM.
- You can use more than one command parameter for Copilot recommended 3 up to 5.
- Ensure the application will respond in less than 6 seconds to Copilot requests.
- You will need a **Copilot for Microsoft 365 license** to test the app - however to test the Teams extension without Copilot, you will not need this license.

## Expected Outputs when operational

When the app is operational, you will see the following in the Teams Message Extension and Copilot for Microsoft 365:

![Teams Message Extension & Copilot Output Example](./docs/assets/output-example.png)/

## Useful Resources

- [Overview of Message Extension Bots | Microsoft Learn](https://learn.microsoft.com/en-us/microsoft-365-copilot/extensibility/overview-message-extension-bot?WT.mc_id=M365-MVP-5003816 
)
- [Build High Quality Message Extensions | Microsoft Learn](https://learn.microsoft.com/en-us/microsoftteams/platform/messaging-extensions/high-quality-message-extension?WT.mc_id=M365-MVP-5003816 
)
- [Microsoft 365 Copilot and AI Resources | pkbullock.com](https://pkbullock.com/blog/2023/m365-copilot-and-ai-resources)
- [Microsoft Adoption Copilot Samples | Microsoft](https://adoption.microsoft.com/en-us/sample-solution-gallery/?keyword=&sort-by=updateDateTime-true&page=1&product=Microsoft+365+Copilot&WT.mc_id=M365-MVP-5003816)
- [Microsoft Learn Module – Optimize and extend Copilot for Microsoft 365
](https://learn.microsoft.com/en-us/training/modules/optimize-and-extend-microsoft-365-copilot?WT.mc_id=M365-MVP-5003816 
)


- [Service Health and Announcements API | Microsoft Graph Documentation](https://learn.microsoft.com/en-us/graph/api/resources/service-communications-api-overview?view=graph-rest-1.0)