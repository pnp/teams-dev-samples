# Offer Creation (Teams Toolkit VS) - Microsoft Teams App

Teams and Office App to create custom offer documents for further processing. Fully C# and Blazor based.

## Summary

This sample is a Teams personal Tab to act as a Microsoft 365 across application (Teams, Outlook, Office) to act in Teams and Outlook. The App will create custom offer documents based on a custom SharePoint content type with custom document template for further processing such as review and finalization (PDF archive).

App live in action inside Teams

![App live in action inside Teams](assets/01OfferCreationInAction.gif)

## Tools and Frameworks

![drop](https://img.shields.io/badge/Teams&nbsp;Toolkit&nbsp;for&nbsp;VS&nbsp;Code-17.7-green.svg)


![drop](https://img.shields.io/badge/Visual&nbsp;Studiot&nbsp;2022&nbsp;Community&nbsp;Edition-17.7-green.svg)

For further details see the author's blog posts

- on [Microsoft Graph](https://mmsharepoint.wordpress.com/2023/08/15/use-teams-toolkit-for-visual-studio-c-blazor-to-create-a-teams-tab-using-sso-for-microsoft-graph/) API usage
- on [SharePoint CSOM](https://mmsharepoint.wordpress.com/2023/09/26/use-teams-toolkit-for-visual-studio-c-blazor-to-create-a-teams-tab-using-sso-for-sharepoint-csom-pnp/) API usage

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Visual Studio 2022](https://visualstudio.microsoft.com/vs/community/)
* [Teams Toolkit for Visual Studio](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/toolkit-v4/teams-toolkit-fundamentals-vs?pivots=visual-studio-v17-7&WT.mc_id=M365-MVP-5004617)
* [Whatever](#)


## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|Sep 27, 2023|[Markus Moeller](https://twitter.com/moeller2_0)|Initial release


## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone the repository
    ```bash
    git clone https://github.com/pnp/teams-dev-samples.git
- Open samples\tab-office-offer-creation-csharp.sln in Visual Studio
- Perform first actions in GettingStarted.txt (before hitting F5)
- This should [register an app in Azure AD](https://learn.microsoft.com/en-us/microsoftteams/platform/toolkit/add-single-sign-on?pivots=visual-studio&WT.mc_id=M365-MVP-5004617#add-sso-to-teams-app-for-visual-studio)
- Ensure there is an app 
  - with redirect uri https://localhost/blank-auth-end.html
  - SignInAudience multi-tenant
  - with client secret
  - with **delegated** Graph permissions Sites.ReadWrite.All and SharePoint permission AllSites.Write
  - With exposed Api "access_as_user" and App ID Uri api://localhost/<App ID>
  - With the client IDs for Teams App and Teams Web App 1fec8e78-bce4-4aaf-ab1b-5451cc387264 and 5e3ce6c0-2b1f-4285-8d4b-75ee78787346
- Find/Add the app registration ClientId, ClientSecret to your appsettings.json (or a appsettings.Development.json)
- Find/Fill OAuthAuthority with https://login.microsoftonline.com/_YOUR_TENANTID_
- Grant admin consent to the given permissions in the app registration
- Now you are good to go to continue in GettingStarted.txt with hitting F5 (You can also select an installed browser in the VS menu
- Create the content-type for your offers in a site / default document library of your choice (described [here](https://mmsharepoint.wordpress.com/2022/11/22/modern-sharepoint-content-type-publishing-manually-or-automated-pnp/))
    - With PnP-PowerShell for instance call the deploy script with your site url as parameter
        ```bash
        .\templates\deploy.ps1 -siteUrl <YourFullSiteUrl>
    
    - Put the same site url to your appsettings.json under PnPCore:Sites:DemoSite:SiteUrl    
- Potentially decide if to use Microsoft Graph or SharePoint CSOM by setting "UseGraph" to "false" or "true" in appsettings.json
- If using Microsoft Graph create 1 DocumentTemplate.docx manually in your library


## Features

This is a Teams personal Tab app to act as a Microsoft 365 across application (Teams, Outlook, Office)
* Using SSO with Teams 
* Using O-B-O flow secure and totally in backend to retrieve and store data via Microsoft SharePoint
* Using Microsoft Graph to copy template to document and manipulate metadata
* As alternative using [SharePoint PnP.Core](https://pnp.github.io/pnpcore/) to copy template to document and manipulate metadata
* [Extend Teams apps across Microsoft 365](https://docs.microsoft.com/en-us/microsoftteams/platform/m365-apps/overview?WT.mc_id=M365-MVP-5004617)
* [Use FluentUI Blazor components FluentTextField, FluentSelect, FluentNumberField, FluentProgressRing, FluentTextArea](https://fluentsite.z22.web.core.windows.net/)

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/tab-office-offer-creation-csharp />