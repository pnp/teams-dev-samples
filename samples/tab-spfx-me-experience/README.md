---
page_type: sample
products:
- teams
languages:
- typescript
extensions:
  contentType: samples
  app_features:
  - Tab
  technologies:
  - React
  - Microsoft Graph Toolkit
  platforms:
  - SPFx
  origin:
  - Community
createdDate: 08/11/2020 12:00:00 AM
---

# Me experience

A [Me-experience](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-me-experience/?WT.mc_id=m365-10079-rwilliams) in Microsoft Teams using SharePoint Framework where users can start their day and see their personal information using [Microsoft Graph Toolkit React components](https://docs.microsoft.com/en-us/graph/toolkit/get-started/use-toolkit-with-react/?WT.mc_id=m365-10079-rwilliams).

## Summary

Multiple web parts in multiple tabs, using REACT and SPFx. Respects multiple theme in Teams and also have user's settings stored in [Open extensions](https://docs.microsoft.com/en-us/graph/extensibility-open-users) making it completely personalised.



![me-experience](./src/docs/me-experience.gif)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.11-green.svg)

## Applies to

- [SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/sharepoint-framework-overview?WT.mc_id=m365-10079-rwilliams)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant/?WT.mc_id=m365-10079-rwilliams)

> Get your own free development tenant by subscribing to [Microsoft 365 developer program](https://developer.microsoft.com/en-us/microsoft-365/dev-program/?WT.mc_id=m365-10079-rwilliams)


## Solution

Solution|Author(s)
--------|---------
Rabia Williams | [@williamsrabia](https://twitter.com/williamsrabia)

## Version history

Version|Date|Comments
-------|----|--------
1.0|November 08, 2020|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
- Bundle and package up the solution (use below script) and put in `SharePoint` Appcatalog 

```
gulp bundle --ship

gulp package-solution --ship
```


- Download the `Me.zip` file from the folder [./teams](./teams)

- Upload it in your Teams (provided you have access, or send it to the IT admin who will be able to upload it for you)


## Kudos 👏🏽

- [Microsoft Graph Open Extensions](https://joaojmendes.com/2020/04/14/microsoft-graph-open-extensions/) blog by Joao Mendes for providing great sample with themes applied for Teams and open extensions used for user settings.

## References

- [Microsoft Graph Toolkit React components](https://docs.microsoft.com/en-us/graph/toolkit/get-started/use-toolkit-with-react/?WT.mc_id=m365-10079-rwilliams).
- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant/?WT.mc_id=m365-10079-rwilliams)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview/?WT.mc_id=m365-10079-rwilliams)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis/?WT.mc_id=m365-10079-rwilliams)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview/?WT.mc_id=m365-10079-rwilliams)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/tab-spfx-me-experience" />