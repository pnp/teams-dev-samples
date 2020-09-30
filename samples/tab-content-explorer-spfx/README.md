---
page_type: sample
products:
- teams
languages:
- javascript
- typescript
extensions:
  contentType: samples
  app_features:
  - Tab
  technologies:
  - React
  platforms:
  - SPFx
  origin:
  - Community
createdDate: 08/01/2020 12:00:00 AM
---

# Content Explorer

## Summary

Content Explorer app allows users to surface all the libraries, lists, sub-sites and hub associated sites by pointing to any SharePoint Online or SharePoint On Premis site collection URL within a Tab in any of your Microsoft Teams. It does the work of searching and navigating documents from multiple SharePoint sources and pulls them into one easy-to-access list.

![Interface](imagesForOpenSource/change-to-grouped-layout.gif)

## Frameworks

![SPFx 1.8.0](https://img.shields.io/badge/SPFx-1.8.0-green.svg)

![drop](https://img.shields.io/badge/React-16.8.5-green.svg)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [SPFx Development environment](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-development-environment)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|August 01, 2020|[Cloudpark Labs](https://www.cloudsparklabs.com/)|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* In the command line run:
  * npm install
  * gulp serve
* Create a deployable package that can be added to the App Catalog:
  * gulp bundle --ship
  * gulp package-solution --ship

### 1. Deploy the SPFX package to the Tenant App catalog​

* Navigate to App Catalog​
![Interface](imagesForOpenSource/content-explorer-appcatalog.png)

* Upload the APP SPFX package​

* Deploy Org wide​

* Deploy to MS Teams

### 2. Deploy to MS Teams – Individual MS Team

* Navigate to an MS Team ​

* Navigate to Apps

  * Click the ellipses ​

  * Select 'Manage Team'​

* Upload Custom App​

  * Click the 'Upload a custom app'​
  ![Interface](imagesForOpenSource/content-explorer-teams.png)

  * Select the MS Teams App package [zip file](/samples/tab-content-explorer-spfx/teams/ContentExplorer.zip)

### 3. Deploy to MS Teams – Org wide Deployment​

* Navigate to MS Team ​

* Upload Custom App​

  * Click the ellipses on the left navigation​

  * Select 'More apps' ​

  * Select 'Upload a custom app' ​

  * Select upload for your organization​

  * Select the ZIP package ​

## Features

The following describes the currently implemented features. We are looking to extend this to work for On-Prem Scenarios as it currently only supports Office 365.

* Content Explorer is accessible to the user via a Team Tab that can be configured on any Teams channel. ​ A simple interface is presented within the window frame. An arrow button on the tab will allow team admin to configure the Settings.

![Interface](imagesForOpenSource/content-explorer-settings.png)

* Once Content Explorer is configured to connect to a SharePoint Hub or Site Collection, Content Explorer will automatically pull and display all document libraries from that source in the Library Hub. This can include anything that was configured in Content Explorer settings, from Documents, to Calendars and Events, and more

* Content Explorer can be used in SharePoint alone. Deploying the SPFX package to the Tenant App Catalog will make Content Explorer web part avaialble for use within SharePoint Pages​.

![Interface](imagesForOpenSource/content-explorer-sharePoint.png)

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/tab-content-explorer-spfx" />
