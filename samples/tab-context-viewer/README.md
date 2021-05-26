# Context Viewer App

## Summary

Sample showcasing every Teams SDK context in every type of tab.

![Sample of the Context Viewer](./assets/ContextViewer.gif)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Node.js](https://nodejs.org) version 12.13.1 or higher
* [Gulp task runner](https://gulpjs.com/) - install by typing `npm install yo gulp-cli --global`


    ```bash
    # determine node version
    node --version
    ```

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|May 21, 2021| [Sébastien Levert](https://www.linkedin.com/in/sebastienlevert) ([@sebastienlevert](https://twitter.com/sebastienlevert)) |Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

* Clone this repository
* Copy the `.env.sample` to a new `.env` file
* Change the `HOSTNAME` to reflect the hostname you are using (ngrok or localhost)
* _Optionally, add the NGROK specific information if you want to run through your ngrok tunnel_
* In the command line run:
  * `npm install`
  * `gulp serve` or `gulp ngrok-serve`
  * [Upload and install the app to Microsoft Teams](https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/deploy-and-publish/apps-upload#upload-your-package-into-a-team-or-conversation-using-the-store)

## Features

This solution illustrates the following concepts :

* Getting the context information of every type of Tab

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/tab-context-viewer" />
