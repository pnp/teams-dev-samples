# Teams Tab Single Sign-on (SSO) Sample - .NET

This SSO sample includes both a .NET and a Node.js version. This README is specific to the .NET version, so please see [here](../../) for the overall README details, and then come back here for the dotnet-specific setup steps.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|November 25, 2020|Hilton Giesenow|Initial release
2.0|April 04, 2021|Shama Lnu|Added Microsoft.Identity.Web support

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

1. Refer initially to the overall sample README which includes details on setting up the Azure AD Application.

2. Open the `msteams-tabs-sso-sample.sln` file in Visual Studio (or the project folder in Visual Studio Code). Modify the [`appsettings.json`](appsettings.json) file as below:
    - Find the app key `ClientId` and replace the existing value with the application ID (clientId) of the Azure Application created earlier.
    - Find the app key `TenantId` and replace the existing value with your Azure AD tenant ID.
    - Find the app key `Domain` and replace the existing value with your Azure AD tenant name.
    - Find the app key `ClientSecret` and replace the existing value with the key you saved during the creation of the application, in the Azure portal.

3. Compile and run the application (e.g. press F5 in Visual Studio or type `dotnet run` in VS Code terminal)

4. Start Ngrok (or a similar tunneling tool), using the following command:

    ```shell
    ngrok http https://localhost:44329/ -host-header="localhost:44329"
    ```

5. For the Redirect URI in the 'Authentication' page in your Azure AD Application, enter `https://{yourNgrokDomain}.ngrok.io/auth/authPopup`.

> :warning: Make sure the Redirect URI is of type **Single-page application**, and not **Web**.

6. Complete the remaining steps in the main README file.

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/tab-sso/dotnet" />