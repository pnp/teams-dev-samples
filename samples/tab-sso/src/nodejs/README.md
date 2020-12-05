# Teams Tab Single Sign-on (SSO) Sample - .NET

This SSO sample includes both a .NET and a Node.js version. This readme is specific to the .NET version, so please see [here](../../) for the overall readme details, and then come back here for the dotnet-specific setup steps.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|December055, 2020|Hilton Giesenow|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Microsoft Teams Toolkit

Please note that this sample has been built using the Microsoft Teams Toolkit, which enables you to create custom Teams apps directly within the [Visual Studio](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-overview) or [Visual Studio Code](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-code-overview) IDE. In particular, the December 2020 release of this toolkit provides improved support for [creating SSO Tabs](https://docs.microsoft.com/en-us/microsoftteams/platform/toolkit/visual-studio-code-tab-sso). This sample starts with a Teams Toolkit project and adds a few additional capabilities, particularly for working with the SSO token.

## Minimal Path to Awesome

1. Refer initially to the overall sample readme which includes details on setting up the Azure Ad Application.

2. Modify the [`.env`](.env) file by inserting a value for the `{AAD App Registration Id}`, being the Application Id of the Azure Application created earlier.

3. Modify the [`.env`](/api-server/.env) file in the `api-server` subfolder, for the backend api that does the token exchange, by inserting a value for the `{AAD App Registration Id}`, being the Application Id of the Azure Application created earlier, and the `{AAD App Password}`, being the client secret from the same application.

Note also that the value of the `Authority` setting can either be your tenant id, for building an internal-only application, or can be set to `organizations` for a multi-tenant application.

4. Within this `nodejs` directory, run

```shell
npm install
```

to install the needed npm packages.

5. Run the application, as follows:

```shell
npm run start
```

6. Start Ngrok (or a similar tunneling tool), using the following command:

```shell
ngrok http https://localhost:3000/ -host-header="localhost:3000"
```

7. Complete the remaining steps in the main readme file.
