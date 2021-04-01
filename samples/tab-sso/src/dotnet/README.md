# Teams Tab Single Sign-on (SSO) Sample - .NET

This SSO sample includes both a .NET and a Node.js version. This readme is specific to the .NET version, so please see [here](../../) for the overall readme details, and then come back here for the dotnet-specific setup steps.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|November 25, 2020|Hilton Giesenow|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

1. Refer initially to the overall sample readme which includes details on setting up the Azure Ad Application.

2. Open the `msteams-tabs-sso-sample.sln` file in Visual Studio (or the project folder in Visual Studio Code). Modify the [`appsettings.json`](appsettings.json) file as mentioned below:
    - Find the app key `ClientId` and replace the existing value with the application ID (clientId) of the Azure Application created earlier.
    - Find the app key `TenantId` and replace the existing value with your Azure AD tenant ID.
    - Find the app key `Domain` and replace the existing value with your Azure AD tenant name.
    - Find the app key `ClientSecret` and replace the existing value with the key you saved during the creation of the application, in the Azure portal.

3. Compile and run the application (e.g. by pushing F5 in Visual Studio)

4. Start Ngrok (or a similar tunneling tool), using the following command:

    ```shell
    ngrok http https://localhost:44329/ -host-header="localhost:44329"
    ```

5. For the Redirect URI in the 'Authentication' page in your Azure AD Application, enter https://{yourNgrokDomain}.ngrok.io/auth/authPopup

6. Complete the remaining steps in the main readme file.
