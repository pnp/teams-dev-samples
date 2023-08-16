# title of the sample

_Thank you for using this template. Please edit the file as needed, following the structure as much as possible so the samples are consistent._

_Notes to the submitter (you) are in italics; please delete them before submitting._

_Thanks! Sharing is caring!_

## Summary

Short summary on functionality and used technologies.

![picture of the app in action](#)

## Tools and Frameworks

_Please note the version of Teams Toolkit used in your sample_

![drop](https://img.shields.io/badge/Teams&nbsp;Toolkit&nbsp;for&nbsp;VS&nbsp;Code-x.y-green.svg)

_Please note the version and edition of Visual Studio required to run your sample._

![drop](https://img.shields.io/badge/Visual&nbsp;Studiot&nbsp;2022&nbsp;Community&nbsp;Edition-x.y-green.svg)

_Teams Toolkit pulls in some standard libraries and SDK's such as the Bot Framework SDK and Create React App. Since these are aligned with Teams Toolkit versions, there is no reason to include them here unless you changed them._

_If you use any other frameworks or platforms, please add badges for them here. If there are spaces in the framwork name, use &amp;nbsp;._

![drop](https://img.shields.io/badge/Some&nbsp;Framework-x.y-green.svg)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/community/)
* [Teams Toolkit for Visual Studio](https://learn.microsoft.com/microsoftteams/platform/toolkit/install-teams-toolkit?tabs=vscode)
* [Whatever](#)

_Please list any portions of the toolchain required to build and use the sample, along with download links_

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|August 29, 2025|Parker T. Porcupine|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

_Include consise instructions to set up and run the sample. These are just an example!_

- Clone the repository
    ```bash
    git clone https://github.com/pnp/teams-dev-samples.git
- Open samples\xxxx\xxxx.sln in Visual Studio
- Perform first actions in GettingStarted.txt (before hitting F5)
- This should [register an app in Azure AD](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/add-single-sign-on?pivots=visual-studio&WT.mc_id=M365-MVP-5004617#add-sso-to-teams-app-for-visual-studio)
- Ensure there is an app 
  - with redirect uri https://localhost/blank-auth-end.html
  - SignInAudience multi-tenant
  - with client secret
  - with **delegated** permissions Files.ReadWrite and Sites.ReadWrite.All
  - With exposed Api "access_as_user" and App ID Uri api://localhost/<App ID>
  - With the client IDs for Teams App and Teams Web App 1fec8e78-bce4-4aaf-ab1b-5451cc387264 and 5e3ce6c0-2b1f-4285-8d4b-75ee78787346
- Find/Add the app registration ClientId, ClientSecret to your appsettings.json (or a appsettings.Development.json)
- Find/Fill OAuthAuthority with https://login.microsoftonline.com/_YOUR_TENANTID_
- Grant admin consent to the given permissions in the app registration
- Now you are good to go. Continue in GettingStarted.txt with hitting F5 (You can also select an installed browser in the VS menu)

## Features

Description of the web part with possible additional details than in short summary. 
This Web Part illustrates the following concepts on top of the SharePoint Framework:

* topic 1
* topic 2
* topic 3

_Below there is a clear image used for telemetry. Please change "readme-template" to your sample name._

<img src="https://m365-visitor-stats.azurewebsites.net/sp-dev-fx-webparts/samples/readme-template" />