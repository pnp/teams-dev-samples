# tab-mgt-people
Teams Tab with SSO and Microsoft Graph Toolkit usage

## Summary

This sample is a Teams Tab created using the Teams Yeoman Generator. It uses the Microsoft Graph Toolkit (MGT) to access Microsoft Graph in the back.
There are two versions, one uses a Login component to let the user sign in and afterwards show up to 5 recent contacts with the People component.
The other version uses Teams SSO with the on-behalf flow and that access token is used for the MGT custom provider and afterwards call the People component.

|Result with Login | Result with SSO|
:-------------------------:|:-------------------------:
![Result with Login](https://mmsharepoint.files.wordpress.com/2021/09/05mgt_login_result.png) | ![Result with SSO](https://mmsharepoint.files.wordpress.com/2021/09/06mgt_sso_result.png)

For further details see the author's [blog post](https://mmsharepoint.wordpress.com/2021/09/01/microsoft-graph-toolkit-in-a-teams-application-with-yo-teams-and-sso/)

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
1.0|Sep 01, 2021|[Markus Moeller](https://twitter.com/moeller2_0)|Initial release
1.1|Sep 17, 2021|[Markus Moeller](https://twitter.com/moeller2_0)|Added TeamsMsal2Provider

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

## Minimal Path to Awesome
- Clone the repository
    ```bash
    git clone https://github.com/mmsharepoint/tab-mgt-person.git
    ```

- In a console, navigate to `samples/tab-mgt-person`

    ```bash
    cd samples/tab-mgt-person
    ```

- Install modules

    ```bash
    npm install
    ```

- Run ngrok and note down the given url

    ```bash
    gulp start-ngrok
    ```
- You will need to register an app in Azure AD [also described here](https://mmsharepoint.wordpress.com/2021/09/01/microsoft-graph-toolkit-in-a-teams-application-with-yo-teams-and-sso/)
  - with redirect uri https://<NGrok-Url>/auth.html
  - Make it multi-tenant
  - with client secret
  - with **delegated** permissions User.Read and People.Read
  - With exposed Api "access_as_user" and App ID Uri api://<NGrok-Url>/<App ID>
  - With the client IDs for Teams App and Teams Web App 1fec8e78-bce4-4aaf-ab1b-5451cc387264 and 5e3ce6c0-2b1f-4285-8d4b-75ee78787346
- Also add the app ID and its secret to .env (taken from .env-sample) as TAB_APP_ID= and 
    - add the secret to TAB_APP_SECRET"
- Package the app
    ```bash
    gulp manifest
    ```
- Start the app
    ```bash
    gulp serve --debug
    ```



## Features
This is a simple Teams Tab. It uses the Microsoft Graph Toolkit (MGT) for simplifying access to Microsoft 365 resources.
* SSO access token generation to access Microsoft Graph
* Use Login component as alternative to SSO
* Use People component to retrieve and render recent contacts

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/tab-mgt-person" />