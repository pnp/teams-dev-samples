# M365 Planner Timeline Tab

## Table of Contents

- [Summary](#summary)
- [Tools and Frameworks](#tools-and-frameworks)
- [Prerequisites](#prerequisites)
- [Version history](#version-history)
- [Disclaimer](#disclaimer)
- [Features](#features)
- [Minimal path to awesome](#minimal-path-to-awesome---debug-against-a-real-microsoft-365-tenant)
- [Help](#help)
- [How to Deploy Azure](#how-to-deploy-azure)
- [References](#references)
---
## Summary

The purpose of this Teams Toolkit Tab sample is to render M365 Group Plan tasks in a timeline ordered by the task due date with tags for years and months in a vertical stack. There are filter options to filter out completed tasks and tender tasks by a plan bucket. A task's detail can be viewed by clicking the (i) icon below the "Due Date" popping up a callout dialog with task details. It Should be noted that a M365 Group Planner can have 0 to 200 plans assigned to M365 Group. When configuring a M365 Planner Timeline tab you must select the plan to be rendered, along with options for the plan bucket and completed task filter. These setting will be used when the tab is access. The configuration of multiple tab for different plans and buckets are supported.

Single sign-on authentication is used to access M365 Groups Planner data in Microsoft Graph. 
</br><mark>To complete the approval of Microsoft Graph permission, an Admin will need to Accept the permission request.</mark>

- This sample was generated with Teams Toolkit as a "Tab => React with Fluent UI => Typescript".
- React Hooks is used in the web app.
- The Azure Function, not needed and has been deleted from the sample.
- The bicep files has been modified to only provision the static wab service in Azure.

<img src="images/Planner-Timeline-tab.gif" />

### **Task details popup**
<img src="images/callout.gif" />    

## Tools and Frameworks

![drop](https://img.shields.io/badge/Teams_Toolkit_for_VS_Code-5.10.1-blue.svg)

![drop](https://img.shields.io/badge/Node.js-18.20.3-green.svg)

![drop](https://img.shields.io/badge/TypeScript-4.1.2-green.svg)

![drop](https://img.shields.io/badge/Microsoft_Graph_Types-2.40.0-orange.svg)

_Teams Toolkit pulls in some standard libraries and SDK's to Create React App. Since these are aligned with Teams Toolkit versions._

_To support accessing to Planner data  structures returned by Microsoft Graph, "Microsoft Graph Types" module is used._

## Prerequisites

> - A [Microsoft 365 account for development](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts)
> - Admins Access to a Office 365 tenant
> - [Node.js](https://nodejs.org/), supported versions: 18, 20
> - Set up and install Teams Toolkit for Visual Studio Code v5.0 [How to install Teams Toolkit v5.0](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode).
> - [Set up your dev environment for extending Teams apps across Microsoft 365](https://aka.ms/teamsfx-m365-apps-prerequisites)
>   Please note that after you enrolled your developer tenant in Office 365 Target Release, it may take couple days for the enrollment to take effect.
> - [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) version 5.10.1 or higher and the [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)

1. First, select the Teams Toolkit icon on the left in the VS Code toolbar.
2. In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
3. Press F5 to start debugging which launches your app in Teams using a web browser. Select `Debug in Teams (Edge)` or `Debug in Teams (Chrome)`.
4. When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|March 17, 2025|Bill Brockbank|Initial release

Teams manifest file version: 1.6.0

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

## Features

- When adding the tab to a channel, configuration M365 Group Plan and allows setting the default filter settings.
- The Tab name is set to "`<plan name>` Timeline"
- The Web application is developed with React and Fluent UI.
- Access the Planner buckets and task via Microsoft Graph in the Web app (not through a Azure function)
- Filter task by active or all tasks (includes completed).
- Filter task by plan bucket.
- Tasks status rendered in colors:

    Color | Status | Criteria
    ----------|------------|--------------------------------
    **Red** | Overdue | Passed Due Date
    **Green** | Complete | Progress set to "Completed"
    **Blue** | In progress| Progress set to "In Progress"
    **Black** | Not Due | Progress set to "Not Started"

- Refresh Planner Tasks then re-rending with the selected filter settings.
- With Teams desktop or in a web browser Plan Task and filter settings cached in the browser session Storage.
- By clicking on the (i) the task details are rendered.
- The tab has been configured to support Teams mobile App.
- It support both Teams dark and light mode.

---

## Minimal path to awesome - Debug against a real Microsoft 365 tenant

- Clone repo
- Open repo in VSCode
- First, select the Teams Toolkit icon on the left in the VS Code toolbar.
- In the Account section, sign in with your [Microsoft 365 account](https://docs.microsoft.com/microsoftteams/platform/toolkit/accounts) if you haven't already.
- Before running the Teams Tab code, you need to copy the following file in the "env" folder:
>>- .env.local.sample --> ,env,local
>>- .env.local.user.sample --> .env.local.user
- Press <kbd>F5</kbd> to start debugging which launches your app in Teams using a web browser. Select `Debug (Edge)` or `Debug (Chrome)`.
- When Teams launches in the browser, select the Add button in the dialog to install your app to Teams.
- Wait for deploy and provision tasks to complete.
- The first time you run the code you will need to "Authorize permission to access Planner Tasks" 
    <p>
        <img src="images/Authorize.gif" width=550>
    </p>

- On initial app run, Allow the following Graph API permissions via the consent prompt. </br> <mark>Make sure popups are allowed in the browser to see the consent prompt</mark>.

    >|Graph API Permissions|Admin Consent required|
    >|-|-|
    >|User.Read.All|<mark>Yes</mark>|
    >|Tasks.ReadWrite|No|
    >|GroupMember.Read.All|<mark>Yes</mark>|

- Because Microsoft Graph API permissions "GroupMember.Read.All" and "User.Read.All" both require Admin Consent,</br>
the initial add of M365 Planner Timeline tab to a channel should be an admin with rights to "Consent on behalf of your organization".</br>
If this in not the case the Microsoft Graph API permissions will need to be consented in the Microsoft Entra admin center,</br>
App registration with the display name "PlannerTimeline".</br>

    <img src="images/Accept-Permissions.gif" width=400>

- The M365 Planner Timeline renders the a Plan in the group of Teams of the Channel added to.
- Can be added for different plans and buckets in any of the Teams Channels.

    <img src="images/ConfigurationExisting.gif">

- You can also add a new a Plan M365 Group of the Teams site in the configuration for the Timeline app.

    <img src="images/ConfigurationNew.gif">

### Note: ###
In addition you can add a new Plan to the Teams M365 Group by adding the Planner App (tab) to create a new Plan. You will be unable to add the M365 Planner Timeline App to the channel without a M365 Group Panner.

## How to Deploy Azure

___To deploy "M365 Planner Timeline" into Azure see the following:___
- Microsoft Teams Developer Resurces: [Deploy Microsoft Teams app to the cloud using Microsoft Visual Studio Code](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/deploy)
- Microsoft Learn Training module: [Deploy a Microsoft Teams app to Azure by using Teams Toolkit for Visual Studio Code](https://learn.microsoft.com/en-us/training/modules/teams-toolkit-vsc-deploy-apps/)

## Help

We do not support samples, but this community is always willing to help, and we want to improve these samples. We use GitHub to track issues, which makes it easy for  community members to volunteer their time and help resolve issues.

You can try looking at [issues related to this sample](https://github.com/pnp/teams-dev-samples/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen) to see if anybody else is having the same issues.

If you encounter any issues using this sample, [create a new issue](https://github.com/pnp/teams-dev-samples/issues/new).

Finally, if you have an idea for improvement, [make a suggestion](https://github.com/pnp/teams-dev-samples/issues/new).

---

## References

- [Teams Toolkit Documentations](https://docs.microsoft.com/microsoftteams/platform/toolkit/teams-toolkit-fundamentals)
- [Teams Toolkit CLI](https://aka.ms/teamsfx-toolkit-cli)
- [Microsoft Graph TypeScript Types](https://github.com/microsoftgraph/msgraph-typescript-typings/blob/main/README.md)
- [Microsoft Teams SDK](https://learn.microsoft.com/en-us/javascript/api/overview/msteams-client?view=msteams-client-js-latest&tabs=npm)
- Host your app in Azure by [provision cloud resources](https://learn.microsoft.com/microsoftteams/platform/toolkit/provision) and [deploy the code to cloud](https://learn.microsoft.com/microsoftteams/platform/toolkit/deploy)
- [Teams Toolkit Samples](https://github.com/OfficeDev/TeamsFx-Samples)

---

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/tab-planner-timeline" />