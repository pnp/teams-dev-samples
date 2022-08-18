# Tab Meeting Vote Movie - Microsoft Teams App

Teams meeting app showing up in sidePanel and on stageView. Letting users vote for a movie in sidePanel and shwing then the most voted one for all in stageView.

## Summary

This sample is a Teams meeting app created using the Teams Yeoman Generator. It's a tab showing up during in-Meeting experience in the sidePanel but also, once shared, in the stageView for all meeting participants.

Open sidePanel

![OnStageView](assets/02InMeeting_Voting.jpg)

Share onStage view

![OnStageView](assets/04ShareVoteMovieInStageView.jpg)

The onStage view experience

![OnStageView](assets/03WatchMostVotedVideoResult.jpg)

For further details see the author's [blog post](https://mmsharepoint.wordpress.com/2022/05/26/teams-meeting-apps-a-sample-for-in-meeting-experience-and-stageview-vote-movies/)

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
1.0|May 26, 2022|[Markus Moeller](https://twitter.com/moeller2_0)|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

## Minimal Path to Awesome
- Clone the repository
    ```bash
    git clone https://github.com/pnp/teams-dev-samples.git
    ```

- In a console, navigate to `/samples/tab-meeting-stageview-vote-movie`

    ```bash
    cd /samples/tab-meeting-stageview-vote-movie
    ```

- Install modules

    ```bash
    npm install
    ```
- Create an Azure App Configuration as [described here](https://mmsharepoint.wordpress.com/2021/05/17/configure-teams-applications-with-azure-app-configuration-nodejs/#createappconfig)
- Add your configured App Configuration Http endpoint to .env as AZURE_CONFIG_CONNECTION_STRING
- Register an app and secret and insert it to your .env as AZURE_TENANT_ID, AZURE_CLIENT_ID, AZURE_CLIENT_SECRET and grant access to the Azure App Configuration and Azure Key Vault if you need to debug locally

- Run ngrok and note down the given url

    ```bash
    gulp start-ngrok
    ```
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
- Join the meeting with a physical Teams desktop client

## Features

This is a Teams Tab meeting app to show up in side panel and meeting stageView
* Show a tab in in-meeting experience in sidePanel
* Show as in-meeting experience shareable in stageView for all participants at the same time
* Show individual content based on the frameContext (sidePanel vs meetinStage)
* Configure your Teams Tab with custom values
    * Store them in Azure App Configuration
* Story runtime values with npm-cache
* Render video files with React and HTML5
[The same sample is also available here](https://github.com/pnp/teams-dev-samples/tree/main/samples/tab-meeting-stageview-vote-movie-fluid) including implementation of [Microsoft's Fluid Framework](https://fluidframework.com/?WT.mc_id=M365-MVP-5004617)



## Useful links

* [Debugging with Visual Studio Code](https://github.com/pnp/generator-teams/blob/master/docs/docs/vscode.md)
* [Developing with ngrok](https://github.com/pnp/generator-teams/blob/master/docs/docs/ngrok.md)
* [Developing with Github Codespaces](https://github.com/pnp/generator-teams/blob/master/docs/docs/codespaces.md)

## Additional build options

You can use the following flags for the `serve`, `ngrok-serve` and build commands:

* `--no-linting` or `-l` - skips the linting of Typescript during build to improve build times
* `--debug` - builds in debug mode and significantly improves build time with support for hot reloading of client side components
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

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/tab-meeting-stageview-vote-movie" />