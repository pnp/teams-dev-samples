# Microsoft Teams task modules powered by SPFx

## Summary

The sample solution in this repository demonstrates how to use SharePoint Framework powered Task modules in Microsoft Teams applications.

1) Task modules can be used in Microsoft Teams messaging extentions as show in this blog post: [Microsoft Teams messaging extensions using SPFx: Getting the message data with Microsoft Graph](https://www.vrdmn.com/2020/09/microsoft-teams-messaging-extensions.html)

![Microsoft Teams message action using SPFx](/assets/msgextspfx.gif)

2) Task modules can also be presented to the user from Adaptive Cards posted by a bot. The code for this is included in this repository:

![Microsoft Teams task modules from bots and adaptive cards using SPFx](/assets/botspfx.gif)


## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](http://aka.ms/o365devprogram)


## Solutions

Solutions|Author(s)
--------|---------
spfx-teams-message-action | Vardhaman Deshpande [@vrdmn](https://twitter.com/vrdmn)
Augmentech.Teams.Bot | Vardhaman Deshpande [@vrdmn](https://twitter.com/vrdmn)

## Version history

Version|Date|Comments
-------|----|--------
1.0|October 15th, 2020|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

### For the SPFx solution
- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve --nobrowser**

### For the bot solution
- Clone this repository
- Restore nuget packages
- Run the project

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development