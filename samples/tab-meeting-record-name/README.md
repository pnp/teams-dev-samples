# tab meeting record name - Microsoft Teams App
Teams Tab meeting app to record user names audio 

## Summary

This sample is a Teams Tab meeting app created using the Teams Yeoman Generator. It allows to record user names as audio and stores them in a SharePoint document library. Therfore it uses Teams SSO with the on-behalf flow. 
The audio files are rendered with a custom React component powered by @fluentui\react-northstar icons.
It renders in pre-meeting experience (meetingDetailsTab) and in-meeting-experience (sidePanel, currently only supported in Teams Desktop client on physical hosts).

|Result in meeting details tab | Result in meeting side panel|
:-------------------------:|:-------------------------:
![Result in meeting details tab](https://mmsharepoint.files.wordpress.com/2021/09/07premeeting_app_detailstab-1.png) | ![Result in meeting side panel](https://mmsharepoint.files.wordpress.com/2021/09/inmeeting_app-1.jpg)

For further details see the author's [blog series](https://mmsharepoint.wordpress.com/2021/09/07/meeting-apps-in-microsoft-teams-1-pre-meeting/)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Node.js](https://nodejs.org) version 10.14.1 or higher
* [Gulp CLI](https://github.com/gulpjs/gulp-cli) `npm install gulp-cli --global`
* [ngrok](https://ngrok.com) or similar tunneling application is required for local testing

    ```bash
    # determine node version
    node --version
    ```

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|Sep 07, 2021|[Markus Moeller](https://twitter.com/moeller2_0)|Initial release
1.1|Sep 17, 2021|[Markus Moeller](https://twitter.com/moeller2_0)|Added Microsoft Graph Toolkit and user images

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

## Minimal Path to Awesome
- Clone the repository
    ```bash
    git clone https://github.com/mmsharepoint/tab-meeting-record-name.git
    ```

- In a console, navigate to `/tab-meeting-record-name`

    ```bash
    cd tab-meeting-record-name
    ```

- Install modules

    ```bash
    npm install
    ```

- Run ngrok and note down the given url

    ```bash
    gulp start-ngrok
    ```
- You will need to register an app in Azure AD [also described here](https://mmsharepoint.wordpress.com/2021/09/07/meeting-apps-in-microsoft-teams-1-pre-meeting/#appreg)
  - with client secret
  - with **delegated** permissions Sites.ReadWrite.All
  - With exposed Api "access_as_user" and App ID Uri api://<NGrok-Url>/<App ID>
  - With the client IDs for Teams App and Teams Web App 1fec8e78-bce4-4aaf-ab1b-5451cc387264 and 5e3ce6c0-2b1f-4285-8d4b-75ee78787346
- Also add the app ID and its secret to .env (taken from .env-sample) as TAB_APP_ID= and 
    - add the secret to TAB_APP_SECRET"
- Create the content-type for your audios in a site / default document library of your choice
    - Use \templates\Audio.xml as your provisioning template
    - With PnP-PowerShell for instance call Invoke-PnPSiteTemplate
        ```bash
        Invoke-PnPSiteTemplate -Path <yourpath>\templates\Audio.xml
    
    - For the same site evaluate the SiteID (Microsoft Graph) with the Graph Explorer for instance and put it your .env as SiteID=
- Package the app
    ```bash
    gulp manifest
- Start the app
    ```bash
    gulp serve --debug
    ```
- Create a new teams meeting with at least one participant
- Open the meeting in Edit mode
- At the right end of the tabs click (+) to add a new app and sideload your package

## Features

This is a Teams Tab meeting app to record user names audio using the following features:
* Show a tab in pre-meeting experience ("meetingDetailsTab")
* Show as in-meeting experience ("meetingSidePanel") during a meeting (physical Teams desktop client required currently Sep-2021)
* Use devicePermissions to access microphone from Teams app
* Use navigator.mediaDevices.getUserMedia() to record audion (Teams SDK currently only supported in mobile clients)

## Useful links
 * [Debugging with Visual Studio Code](https://github.com/pnp/generator-teams/blob/master/docs/docs/vscode.md)
 * [Developing with ngrok](https://github.com/pnp/generator-teams/blob/master/docs/docs/ngrok.md)
 * [Developing with Github Codespaces](https://github.com/pnp/generator-teams/blob/master/docs/docs/codespaces.md)


## Additional build options

You can use the following flags for the `serve`, `ngrok-serve` and build commands:

* `--no-linting` or `-l` - skips the linting of Typescript during build to improve build times
* `--debug` - builds in debug mode
* `--env <filename>.env` - use an alternate set of environment files
* `--publish` - automatically publish the application to the Teams App store

## Deployment

The solution can be deployed to Azure using any deployment method.

* For Azure Devops see [How to deploy a Yo Teams generated project to Azure through Azure DevOps](https://www.wictorwilen.se/blog/deploying-yo-teams-and-node-apps/)
* For Docker containers, see the included `Dockerfile`

## Logging

To enable logging for the solution you need to add `msteams` to the `DEBUG` environment variable. See the [debug package](https://www.npmjs.com/package/debug) for more information. By default this setting is turned on in the `.env` file.

Example for Windows command line:

``` bash
SET DEBUG=msteams
```

If you are using Microsoft Azure to host your Microsoft Teams app, then you can add `DEBUG` as an Application Setting with the value of `msteams`.

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/tab-meeting-record-name" />
