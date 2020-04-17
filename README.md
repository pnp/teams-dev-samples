# Microsoft Teams Development Community Samples

This repository contains community samples that demonstrate different usage patterns for developing on Microsoft Teams as a platform. Samples are generally not production-ready, but are intended to show developers specific patterns and use cases for use in complete applications.

> We welcome community contributions to the samples folder in this repository for demonstrating different patterns and use cases with Microsoft Teams. Samples should follow folder naming conventions, and should contain a readme markdown file based on the appropriate template. Due to the diversity of technologies in use, each sample readme includes instructions for building and testing the sample. Please see our [contribution guidelines](#) for details.

> If you use 3rd party libraries, please make sure that library license allows distributions of it as part of your sample.

Microsoft Teams is highly extensible, allowing 3rd party and custom applications to run alongside the many Office 365 services already included in Teams. Just as you can add a Word tab or the Who bot in Teams, you can write your own tabs and bots. You can also write applications that run outside the Teams UI and use the Microsoft Graph API to access and curate Teams content.

This community sample repository aims to cover all these cases, and is organized as follows:

## /samples/dotnetcore

These samples are written in .NET Core, and may include those written using Microsoft Visual Studio and those using command line tools and a text editor such as Visual Studio Code. 

| Subfolder | Description |
| --- | --- |
| teams-bots | These are simple bots, intended to show a single capability or pattern |
| teams-curation | These are programs that run outside of Microsoft Teams and add, access, or update Teams content and administrative settings |
| teams-full-app | These are samples of apps that have multiple features such as a tab and a bot |
| teams-messaging-extensions | These are simple messaging extensions, intended to show a single capability or pattern |

## /samples/lowcode

These samples are written using low-code technologies such as Power Apps, Power Automate, and solutions based on SharePoint pages.

| Subfolder | Description |
| --- | --- |
| teams-full-app | These are samples of apps that have multiple features such as a Power App and Flow |
| teams-powerapps | These are simple tabs built with Microsoft Power Apps, intended to show a single capability, pattern, or scenario |
| teams-powerautomate | These are sample Flows, intended to show a single capability, pattern, or scenario |

## /samples/node

These samples are written in node.js, and may include those written in JavaScript or TypeScript. 

| Subfolder | Description |
| --- | --- |
| teams-bots | These are simple bots, intended to show a single capability or pattern |
| teams-curation | These are programs that run outside of Microsoft Teams and add, access, or update Teams content and administrative settings |
| teams-full-app | These are samples of apps that have multiple features such as a tab and a bot |
| teams-messaging-extensions | These are simple messaging extensions, intended to show a single capability or pattern |

## /samples/tabs

These samples are single-page applications intended for use as tabs in Microsoft Teams. 

| Subfolder | Description |
| --- | --- |
| spa | These are single-page applications for general use in web-based applications |
| spfx | These are SharePoint Framework web parts intended for use as Teams tabs |

Additional folders will be added as needed for other development frameworks

## Have issues or questions?

If you have issues or questions on a specific sample, please use [the issues list in this repository](#).
If you have issues with the libraries, SDKs, services, or tools used to develop your applications, please file them in the appropriate location for that technology.

| Technology | Location for issues/questions |
| --- | --- |
| Azure Bot Framework | |
| Bot Builder SDK |  |
| Microsoft Graph SDK | |
| Microsoft Teams JavaScript SDK | |
| SharePoint Framework with Teams | [sp-dev-docs repository issue list](https://github.com/SharePoint/sp-dev-docs/issues) |


## Additional resources


* [Teams something](#)

## Using the samples

Due to the diversity of the samples and technologies, there are no fixed instructions for building or using the samples. Each sample should include a readme file with build instructions.


## Contributions

These samples are from the Microsoft 365 developer community. We welcome your samples and suggestions for new samples. 

Please have a look on our [Contribution Guidance](./.github/CONTRIBUTING.md) before submitting your pull requests, so that we can get your contribution processed as fast as possible. Thx.

> Sharing is caring!