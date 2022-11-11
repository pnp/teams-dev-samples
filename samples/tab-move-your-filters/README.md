# Move your filters

Sample Microsoft Teams Toolkit React project to read filters and labels from Gmail and create matching rules and folders in Outlook.

![Filters to move. Gmail: filter 1. To Outlook: Rule 1](./assets/MoveYourFiltersTeamsApp.png 'Screenshot')

## Summary

Two options for reading rules and labels from Gmail.

- Connect to Gmail through Oauth
- Import filters file exported from Gmail

The rules are displayed on the screen and selected rules may be created in Outlook through single sign on through TeamsFX.
This solution uses Teams Toolkit (Preview).

## Frameworks

![drop](https://img.shields.io/badge/React-16.14-green.svg)

## Prerequisites

- The [Teams Toolkit Visual Studio Code Extension](https://aka.ms/teams-toolkit) (sample tested with v3.5.0)
- The [Teams Toolkit prerequisites](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension#prerequisites)
- A GMail account (or use the [sample XML file](./assets/) to test without one)
- A Google API app ID if you want to use Google login rather than XML import (see https://developers.google.com/gmail/api/auth/web-server).

## Version history

| Version | Date           | Author                                                                                | Comments                                           |
| ------- | -------------- | ------------------------------------------------------------------------------------- | -------------------------------------------------- |
| 1.1     | March 20, 2022 | [Mark Allan](https://twitter.com/MarkXA) and [Tom Resing](https://twitter.com/resing) | Initial release (updated from repo owner comments) |

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

- Clone this repository
- Open in Visual Studio Code with the [Teams Toolkit extension](https://aka.ms/teams-toolkit) installed
- Start debugging the project by hitting the `F5` key in Visual Studio Code.
- Alternatively use the `Run and Debug Activity Panel` in Visual Studio Code and click the `Run and Debug` green arrow button with your preferred browser selected for launching.
- To use Google login, add your Google API app id at REACT_APP_GMAIL_CLIENT_ID in the config file for the relevant environment (see https://create-react-app.dev/docs/adding-custom-environment-variables/).

## Important notes

- Google security does not allow login from a Chromium-based browser that has a debugger connected. If debugging from Visual Studio Code, you'll have to import XML rather than connecting to Gmail.
- As Google login takes place in an OAuth popup window, it may not work in your Teams desktop client. Again, importing XML will still work, as will using the Teams web client.

## Features

- SSO from Teams Toolkit
- Authenticates to Google Workspace
- Reads from GMail
- Writes to Outlook

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/tab-MoveYourFilters" />
