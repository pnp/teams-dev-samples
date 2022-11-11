# Teams Tab Single Sign-on (SSO) Sample - Node.js

This SSO sample includes both a .NET and a Node.js version. This readme is specific to the Node.js version, so please see [here](../../) for the overall readme details, and then come back here for the Node-specific setup steps.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|December 05, 2020|Hilton Giesenow|Initial release
2.0|February 09, 2021|Doğan Erişen|Added MSAL.js support
2.1|March 05, 2021|Doğan Erişen|Added server-side token validation and moved Graph calls to server in Node version only

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Microsoft Teams Toolkit

Please note that this sample has been built using the Microsoft Teams Toolkit, which enables you to create custom Teams apps directly within the [Visual Studio](https://docs.microsoft.com/microsoftteams/platform/toolkit/visual-studio-overview) or [Visual Studio Code](https://docs.microsoft.com/microsoftteams/platform/toolkit/visual-studio-code-overview) IDE. In particular, the December 2020 release of this toolkit provides improved support for [creating SSO Tabs](https://docs.microsoft.com/microsoftteams/platform/toolkit/visual-studio-code-tab-sso). This sample starts with a Teams Toolkit project and adds a few additional capabilities, particularly for working with the SSO token.

## Microsoft identity platform

This sample is secured with [Microsoft identity platform](https://docs.microsoft.com/azure/active-directory/develop/). It uses Microsoft [Authentication Library for JavaScript](https://github.com/AzureAD/microsoft-authentication-library-for-js) (MSAL.js) to implement acquisition of access tokens. In particular, the front-end React project uses [Microsoft Authentication Library for React](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-react) (MSAL React), while the the `api-server` uses [Microsoft Authentication Library for Node](https://github.com/AzureAD/microsoft-authentication-library-for-js/tree/dev/lib/msal-node) (MSAL Node).

## Minimal Path to Awesome

1. Start Ngrok (or a similar tunneling tool), using the following command:

```shell
ngrok http https://localhost:3000/ -host-header="localhost:3000"
```

If you are using the free version of Ngrok, this will generate the public Ngrok domain (e.g. `b788591e3a9d.ngrok.io`) that you will use in the subsequent steps.

2. Register an Azure AD application. Refer to the [overall sample readme](../../README.md#2-register-azure-ad-application) which includes details on setting up the Azure AD Application.

3. Modify the [`.env`](./.env) file by inserting a value for the `CLIENT_ID`, being the Application Id of the Azure Application created earlier.

4. Modify the [`.env`](./api-server/.env) file in the `api-server` subfolder, for the backend web API that does the token exchange, by inserting a value for:
    - `CLIENT_ID`, being the Application Id of the Azure Application created earlier, and,
    - `CLIENT_SECRET`, being the client secret from the same application,
    - `EXPECTED_SCOPES`, being the scopes for the exposed API endpoint from the same application.

Note also that the value of the `TENANT_INFO` in setting for steps **(2)** and **(3)** can be:

- your tenant Id, for building an internal-only application,
- `organizations`, for a multi-tenant application,
- `common`, for authenticating users with any type of account from any tenant.

5. Within both the `nodejs` directory and the `api-server` subdirectory, run `npm install` to install the needed NPM packages.

6. Run the application, using 2 terminal sessions, run the following in the `nodejs` directory and the `api-server` subdirectory:

```shell
npm run start
```

7. Complete the remaining steps in the main readme file. Make sure the review the example [manifiest.json](../manifest.json) file to compare with your settings

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/tab-sso/nodejs" />