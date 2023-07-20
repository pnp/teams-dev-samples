# Guest user overview

> Beware this use the Azure Active Directory reporting API, if you have an  Office 365 E3/E5 you do not have this license, you'll need at least a Microsoft 365 E3/E5 which for some reason is different ([see here](https://learn.microsoft.com/en-us/answers/questions/1061639/graph-apis-which-require-p1-p2-license-are-failing))

## Summary

This is a lightweight admin tool to get an overview of guest users in your tenant.

Features:
- List all guest users in your tenant
- See when they last signed in
- Regenerate guest invitation link
- See which groups they are a member of
- See their sign in history
- Block/unblock guest users
- Open their profile in Entra
- Open AAD groups in Entra
- Delete users
- Get a quick indication of which users are active and which are not via simple color coding
- Edit the users profile information

## Demo
[![](https://markdown-videos.vercel.app/youtube/XvGfuqFo34s)](https://www.youtube.com/watch?v=XvGfuqFo34s)

## Used SharePoint Framework Version

![version](https://img.shields.io/badge/version-1.17.2-green.svg) ![Node](https://img.shields.io/badge/Node-16.20.0-green.svg)

## Applies to

- [SharePoint Framework](https://aka.ms/spfx)
- [Microsoft 365 tenant](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)

## Prerequisites

The app requires two graph permissions that you'll be prompted to grant when you install the app. The permissions are:

- Directory.ReadWrite.All
- AuditLog.Read.All 
- User.ReadWrite.All

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**
  - **gulp serve**

> Include any additional steps as needed.

## References

- [Getting started with SharePoint Framework](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/set-up-your-developer-tenant)
- [Building for Microsoft teams](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/build-for-teams-overview)
- [Use Microsoft Graph in your solution](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/web-parts/get-started/using-microsoft-graph-apis)
- [Publish SharePoint Framework applications to the Marketplace](https://docs.microsoft.com/en-us/sharepoint/dev/spfx/publish-to-marketplace-overview)
- [Microsoft 365 Patterns and Practices](https://aka.ms/m365pnp) - Guidance, tooling, samples and open-source controls for your Microsoft 365 development


<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/app-teams-guest-user-overview" />
