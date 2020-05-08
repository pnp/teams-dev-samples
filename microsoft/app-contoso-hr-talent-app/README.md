---
page_type: sample
products:
- teams
languages:
- csharp
- javascript
- typescript
extensions:
  contentType: samples
  app_features:
  - Bot
  - Connector
  - Messaging Extension
  - Tab
  - Task Module
  technologies:
  - Bot Framework SDK v3
  - Bot Framework SDK v4
  - JQuery
  platforms:
  - ASP.NET Core MVC
  - SPFx
  origin:
  - Microsoft
createdDate: 5/1/2019 12:00:00 AM

---
# Teams Auth Bot

## Summary

This is the lab for the Microsoft Teams Development Bootcamp. It's intended for use in a learning management platform but still usable by adapting the [included PDF instructions](https://github.com/OfficeDev/msteams-sample-contoso-hr-talent-app/blob/master/Microsoft%20Teams%20Development%20Bootcamp%20Labs-10-28-2019.pdf). The main app helps an HR team with their recruiting, including a bot with adaptive cards, messaging extensions, task modules, and both configurable and static tabs. The main app is provided as both a Bot Framework v3 and v4 solutions allowing for easy comparison. Teams integration in the v4 bot is coded into the application rather than using the Teams features of Bot Framework 4.6+; while this isn't ideal it's still an instructive sample.

A SharePoint Framework tab is included, which calls the main app's web service to display candidate data.

Note the main app's web service is unauthenticated, which is not recommended for production use.

**[Access the sample here](https://github.com/OfficeDev/msteams-sample-contoso-hr-talent-app)**

## Used Bot Framework Version

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.5.3-green.svg)

## Applies to

* [Azure Bot Framework 4.0+](#)
* [.NET Core 2.1 or greater](#)
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/dotnetcore/app-consulting-bot/readme" />