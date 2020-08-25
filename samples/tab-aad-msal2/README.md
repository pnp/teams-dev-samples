# Teams Tab using MSAL 2.0 and Microsoft Graph

This sample demonstrates how to write a single-page application which uses MSAL 2.0 to acquire an access token from Azure Active Directory, and then calls the Microsoft Graph. 

## Summary

The sample is bare bones - it just shows the current user's top 15 emails. The point of it is to show how to call the Microsoft Graph from a Teams tab which is hosted on a purely static web site, with no server support at all. Static hosting eliminates the option of using the [Azure AD SSO](https://docs.microsoft.com/microsoftteams/platform/tabs/how-to/authentication/auth-aad-sso?WT.mc_id=m365-blog-rogerman) approach, which requires a simple web service. If you can support the web service, the SSO approach is probably a better choice because it provides a seamless user experience. This sample will cause the user to see some pop-up's; even if they have already logged in, the pop-up will display briefly whenever the tab is opened.

![picture of the app in action](docs/images/tab-aad-msal2-composite.png)

[MSAL 2.0 implements the Auth Code PKCE flow](https://developer.microsoft.com/en-us/microsoft-365/blogs/msal-js-2-0-supports-authorization-code-flow-is-now-generally-available/), which is more secure than the previously used Implicit flow. If you want to understand how it works and why it's more secure, check out [Jason Specland's](https://twitter.com/jayspec/) excellent video, [More Secure JavaScript Single-Page Applications with MSAL 2.0 and OAuth 2.0 Code Flow with PKCE](https://www.youtube.com/watch?v=YxAwGAnmNqQ).

The project was generated using the [Microsoft Teams Toolkit for Visual Studio Code](https://developer.microsoft.com/office/blogs/building-teams-apps-with-visual-studio-and-visual-studio-code-extensions/?WT.mc_id=m365-blog-rogerman). The toolkit uses [Create React App](https://reactjs.org/docs/create-a-new-react-app.html#create-react-app) to generate tabs.

## Frameworks

![drop](https://img.shields.io/badge/React-16.13-green.svg)

## Prerequisites

* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Node.js](https://nodejs.org) version 10.14.1 or higher

    ```bash
    # determine node version
    node --version
    ```
* Optional: Static hosting such as [github pages](https://pages.github.com/)

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|August 25, 2020|Bob German|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

#### 1. Clone this repository to your local filesystem

Within the tab-aad-msal directory, run

~~~shell
npm install
~~~

to install the needed npm packages.

#### 2. Register an Azure AD application

a. Browse to Azure Active Directory in the [Microsoft 365 admin center](https://portal.office.com/AdminPortal/Home) or [Azure portal](https://portal.azure.com/).

b. Under "Manage", click "App Registration" to open the App Registrations. Then click "+ New registration" to register a new application.

c. Give your application a name and select who can use the application. The sample was tested using the first option, "Accounts in this organizational directory only" but the multitenant option should work as long as you use the multitenant endpoint ??????

d. Under Redirect URI, enter http://localhost:3000/ for local debugging. NOTE: Other than localhost you should always use https, not http! If you plan to host your solution elsewhere, you will need to add those locations as well. For example if you use Github pages, you'll need to add https://&lt;githubOrgName&gt;.github.io.

e. Under API permissions, click "+ Add a permission", then click Microsoft Graph, and then click Delegated permissions. Under "user", check "User.Read". (NOTE: The sample will request an additional permission, "Mail.Read", at runtime to demonstrate [Dynamic Consent](https://docs.microsoft.com/azure/active-directory/develop/application-consent-experience?WT.mc_id=m365-blog-rogerman).)

f. Return to the application overview and make note of your Application (client) ID and Directory (tenant) ID; you'll need them in the next step.

#### 3. Create the configuration script within your application

a. Make a copy of src/Config.sample.js and name it Config.js. Edit the file to include your Application (client) ID and Directory (tenant) ID. If you registered a multi-tenant app, insert the word "common" instead of your tenant ID. Finally, include your redirect URL; the sample is already filled in with the URL for local debugging.

~~~Javascript
export const clientId = "<Application ID from app you registered in Azure portal>";
export const authority = "https://login.microsoftonline.com/<Tenant ID from app you registered in Azure portal>";
export const redirectUri = "http://localhost:3000/";
~~~

#### 4. Update the manifest

If you're using the [Teams Toolkit Visual Studio Code extensions](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension&WT.mc_id=m365-blog-rogerman), in the .publish folder, open the Development.env file and ensure that the baseUrl0 setting is right for your development environment (such as http://localhost:3000). Visual Studio Code should update the package file Development.zip for you.
(NOTE: This is pretty cool; you can create other .env files for environments such as staging and production as well and the VS Code extensions will manage those manifests as well.)

If you're not using the extensions, open the manifest.json file and change all occurrances of `{baseUrl0}` to your startup URL and replace the manifest.json within the Development.zip application package with your updated version.

#### 5. Upload the manifest

NOTE: Both these options require you to have [application uploading turned on](https://docs.microsoft.com/microsoftteams/upload-custom-apps?WT.mc_id=m365-blog-rogerman#allow-trusted-users-to-upload-custom-apps) in an App Setup policy that includes your user account.

If you're using the [Teams Toolkit Visual Studio Code extensions](https://marketplace.visualstudio.com/items?itemName=TeamsDevApp.ms-teams-vscode-extension&WT.mc_id=m365-blog-rogerman) you can install the app for yourself using (App Studio)[https://docs.microsoft.com/microsoftteams/platform/concepts/build-and-test/app-studio-overview?WT.mc_id=m365-blog-rogerman]. The app will already be there under "Manifest editor"; open it up and on the left, scroll down to "Test and distribute" and click "Install".

If you're not using these tools, you can upload the app package (the updated Development.zip file) under "Apps" in Microsoft Teams.

#### 6. Run your application

In the tab-aad-msal2 folder, run the application

~~~shell
npm run start
~~~

To debug, you can attach to your browser's debugger in Visual Studio code or debug directly in the browser.

To deploy to a static web site, create an optimized build

~~~shell
npm run build
~~~

and deploy the contents of the build directory to the static hosting location of your choice.

## Features

This web part attempts to acquire an access token on behalf of the signed-in user. If successful, it calls the Microsoft Graph to retrieve the 15 most recent emails, which are then displayed in the tab.

Key files:

* components/App.js - This is the main application. Notice that it calls the Auth Service init() function before doing anything else; that gives MSAL 2.0 a chance to handle any data sent to it in a redirect from Azure AD.

* components/Tab.js - This is the tab user interface used in the Teams desktop client or web UI

* components/Web.js - This is the web page user interface used in the iOS and Android applications, which can't handle a browser pop-up. Notice that App.js checks to see if it's running in an IFrame (which indicates the web or desktop client); if not, it uses Web.js.

* components/TeamsAuthPopup.js - This is the web page that runs in the Teams pop-up window in the desktop client or web UI. In the case of the mobile applications, Web.js handles the login.

* services/AuthService.js - This is a singleton object that handles MSAL 2.0. It keeps an instance of MSAL 2.0 for as long as the page is running so MSAL can do caching, etc. In addition to App.js calling the init function on every page, TeamsAuthPopup.js and Web.js components use AuthService.js to ensure the user is logged in and to acquire an access token.

 * services/TeamsAuthService.js - This is a singleton object that launches the Teams authentication pop-up. It's used by Tab.js.

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/tab-aad-msal2" />
