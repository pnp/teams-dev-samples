# Teams Proactive Bot Messaging Sample

## Summary

Bot interaction typically starts with the user messaging the Bot, with the Bot then processing the message and replying. At times, however, we want the Bot to *start* the conversation, something known as [Pro-active messaging](https://docs.microsoft.com/en-us/microsoftteams/platform/bots/how-to/conversations/send-proactive-messages?tabs=dotnet). More on this topic can be found in the Further Reading section at the bottom of this document. 

The purpose of this particular sample is to show (a) how to gather the minimum information required to send a proactive messaging, and then (b) to show how to do the actual sending. The sample consists of three aspects:

1. A Bot that captures the required conversation properties (this sample contains both a .NET and a Node.js version of this Bot)
2. A Tab that acts as a basic user interface to call the backend API, to send the actual Proactive message
3. A backend API to, on demand, send the Proactive message (this sample contains both a .NET and a Node.js version of this API). Note that, while this API lives in the same project as the Bot, in both the .Net and Node.js examples, this is merely for convenience - it is entirely possible for this Proactive message sending to take place in another backend entirely, e.g. inside an Azure Function triggered on a daily schedule.

Below is a screenshot of the Tab hosting the UI, and the resulting Proactive message sent to the user.

![picture of the tab](assets/images/TabScreenshot.png)

![picture of the proactive message](assets/images/ProactiveMessageInBot.png)

**React note** that this sample actually contains three separate projects:

1. A react front end, in the form of a Teams tab, as shown in the screenshot above. This can be found inside [`tab-frontend`](src/tab-frontend) folder inside this sample's `src` folder.
2. A Node.Js version of the backend, which hosts both the Bot and an API that the tab calls to send the actual Proactive message, which can found inside [`nodejs-backend`](src/nodejs-backend) folder inside this sample's `src` folder.
3. A .NET version of the backend, which can found inside [`dotnet-backend`](src/dotnet-backend) folder inside this sample's `src` folder.

## Frameworks

**Dotnet Version**

![drop](https://img.shields.io/badge/aspnetcore-3.1-green.svg)

**Node.js Version**

![drop](https://img.shields.io/badge/Node.js->=12.6.1-green.svg)

**React Tab**

![drop](https://img.shields.io/badge/Node.js->=12.6.1-green.svg)
![drop](https://img.shields.io/badge/React->=16.13.1-green.svg)

## Prerequisites

**Node.js Version**
* [Node.js](https://nodejs.org) version 12.6.1 or higher

```bash
    # determine node version
    node --version
```

**Dotnet Version**
* [Dotnet Core](https://dotnet.microsoft.com/) version 3.1 or higher

**Both Versions**
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* Optional: Static hosting such as [github pages](https://pages.github.com/)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|January 15, 2021|Hilton Giesenow|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

### 1. Clone this repository

```bash
    git clone https://github.com/pnp/teams-dev-samples.git
```

### 2. Register Azure AD application

For detailed steps on how to do this, read [Registering your app through the Azure Active Directory portal in-depth](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-aad-sso#registering-your-app-through-the-azure-active-directory-portal-in-depth).

### 3. Update app configuration & run the web application




**Dotnet Version**

* See the [`dotnet`](src/dotnet) folder inside this sample's `src` folder

**Node.js Version**

* See [`node`](src/node) folder inside this sample's `src` folder

### 4. Update & package the Teams app manifest

Inside the [`src`](src) folder for this sample is a [`manifest.json`](src/manifest.json) file. The following needs to be changed in this file:

1. The `"id"` value must be populated with a new Guid value. You can do this in various ways depending on your platform of choice, but a simple PowerShell command is: 
```powershell
New-Guid
```

2. The `{appId}` values (near the bottom of the manifest) must be replaced with the Azure Application ID you generated in step 2 above, when generating the new Azure AD application.

3. The `{ngrokSubdomain}` value must be replaced with whatever ngrok subdomain you are using. If you are using another tunneling tool, you might need to replace the entire `{ngrokSubdomain}.ngrok.io` value, and when you create a Production version of your application you will similarly need to supply a complete production URL.

4. From within the [`src`](src) folder, in the command line, run the `gulp` command (you will need the [gulp.js](https://gulpjs.com/) task runner installed to do this). This will generate a .zip manifest file that can be easily uploaded to Microsoft Teams (Note that you might need to run `npm install` in this folder first to download the build dependencies).

### 5. Upload the manifest to Teams

There are a few possible options to do this, depending on your development tools and platform. The easiest is simple to use Teams' [App Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview) tool, in particular the [`manifest editor`](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/app-studio-overview#manifest-editor) tab which allows you to import a manifest (i.e. the one you created in step 4 above) and immediately install it.

## Features

This sample demonstrates how to create a tab for Teams that uses Single-Sign-On (SSO) as well as how to exchange the SSO token for an On-Behalf-Of (OBO) token.

## Further Reading

* [What Are Tabs (Overview of Tabs in Teams)](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/what-are-tabs)
* [What Are Tabs (Overview of Tabs in Teams)](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/what-are-tabs)
* [What Are Tabs (Overview of Tabs in Teams)](https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/what-are-tabs)