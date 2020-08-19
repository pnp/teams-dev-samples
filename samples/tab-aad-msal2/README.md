# Tabs

Tabs are Teams-aware webpages embedded in Microsoft Teams. Personal tabs are scoped to a single user. They can be pinned to the left navigation bar for easy access.

## Prerequisites
-  [NodeJS](https://nodejs.org/en/)

-  [M365 developer account](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/prepare-your-o365-tenant) or access to a Teams account with the appropriate permissions to install an app.

## Build and Run

In the project directory, execute:

`npm install`

`npm start`

## Deploy to Teams

### `ngrok http http://localhost:3000`
Run ngrok so there is a tunnel from the Internet to localhost:3000.
[Setting up ngrok for Teams apps](https://aka.ms/VSTeamsExtensionSetupNgrok)

#### Update Development.env
Update manifest.env in the .publish folder as follows:
* baseUrl0=*somesubdomain*.ngrok.io // somesubdomain should be the subdomain in the fowarding URL provided by ngrok. 

**Upload app from the Teams client**
- Upload the `Development.zip` from the *.publish* folder to Teams.
  - [Upload a custom app](https://aka.ms/teams-toolkit-uploadapp) 