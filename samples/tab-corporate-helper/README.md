# Corporate Helper

## Summary

This is an app to be used inside Microsoft Teams, made for the HackTogether: The Microsoft Teams Global Hack: https://github.com/microsoft/hack-together-teams.

The initial template for this App was the SSO Sample from the Microsoft Community: https://github.com/OfficeDev/Microsoft-Teams-Samples/blob/main/samples/tab-personal-sso-quickstart/csharp_dotnetcore/README.md

So all credits for the template code that gets reutilized here goes to the Microsoft Community, including the install instructions which are almost the same.

This App uses Single-Sign-On and contains three tabs:

Home: home page of the app. Displays information about the currently signed-in user using the Graph API.

Expenses: used to submit expenses to undergo to approval for your manager. You select the date, the value of the expense and then an e-mail is sent to you and to your manager,       containing the expense.

Vacation: used to submit your vacation. You select the date for your vacation, and after submitting it, it automatically turns on the Automatic Replies in your Outlook with a predefined message containing your vacation period. It also blocks your calendar for that period with an OOF event.

You can find a quick video demonstrating the app's functionalities [here](assets/demo.mp4).

![Tab Personal SSO QuickstartGif](assets/demo.gif)  

## Included Features
* Teams SSO (tabs).
* MSAL.js 2.0 support.
* Graph API.

## Frameworks

![drop](https://img.shields.io/badge/SimpleCSS-1.0-green.svg)
![drop](https://img.shields.io/badge/TeamsJS-2.0.0-green.svg)
![drop](https://img.shields.io/badge/JQuery-3.1.1-green.svg)

## Prerequisites

* [Office 365 tenant](https://learn.microsoft.com/en-us/office/developer-program/microsoft-365-developer-program-get-started)
* [.NET Core SDK](https://dotnet.microsoft.com/en-us/download) version 7.0.

  determine dotnet version
  ```bash
  dotnet --version
  ```

* [.NET Core 3.1.32 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/3.1)

Please install both .NET Core 7.0 and .NET Core 3.1.32 SDKs. 
Only .NET Core 7.0 will not be able to run the application as there is a dependency with the 3.1.32 Runtime.

* [Ngrok](https://ngrok.com/download) (For local environment testing) Latest (any other tunneling software can also be used).
* [Teams](https://teams.microsoft.com) Microsoft Teams is installed and you have an active account.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|July 10, 2023|Felipe Dotti|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Setup

### Register your Teams Auth SSO with Azure AD

1. Setup NGROK
  - Run ngrok - point to port 3978

   ```bash
   # ngrok http -host-header=rewrite 3978
   ```

2. Register a new application in the [Azure Active Directory – App Registrations](https://go.microsoft.com/fwlink/?linkid=2083908) portal.
 - Select **New Registration** and on the *register an application page*, set following values:
    * Set **name** to your app name.
    * Choose the **supported account types** (any account type will work)
    * Leave **Redirect URI** empty.
    * Choose **Register**.
 - On the overview page, copy and save the **Application (client) ID, Directory (tenant) ID**. You’ll need those later when updating your Teams application manifest and in the appsettings.json.
 -  Under **Manage**, select **Expose an API**. 
 - Select the **Add** link to add an Application ID URI. This will add an aplication ID URI in the form of `api://{AppID}`. Edit the application ID URI to include your fully qualified domain name (with a forward slash "/" appended to the end) between the double forward slashes and the GUID. The entire ID should have the form of: `api://fully-qualified-domain-name/{AppID}`
    * ex: `api://%ngrokDomain%.ngrok-free.app/00000000-0000-0000-0000-000000000000`.
 - Select the **Add a scope** button. In the panel that opens, enter `access_as_user` as the **Scope name**.
 - Set **Who can consent?** to `Admins and users`
 - Fill in the fields for configuring the admin and user consent prompts with values that are appropriate for the `access_as_user` scope:
    * **Admin consent title:** Teams can access the user’s profile.
    * **Admin consent description**: Allows Teams to call the app’s web APIs as the current user.
    * **User consent title**: Teams can access the user profile and make requests on the user's behalf.
    * **User consent description:** Enable Teams to call this app’s APIs with the same rights as the user.
  - Ensure that **State** is set to **Enabled**
  - Select **Add scope**
    * The domain part of the **Scope name** displayed just below the text field should automatically match the **Application ID** URI set in the previous step, with `/access_as_user` appended to the end:
        * `api://[ngrokDomain].ngrok-free.app/00000000-0000-0000-0000-000000000000/access_as_user.
  - In the **Authorized client applications** section, identify the applications that you want to authorize for your app’s web application. Each of the following IDs needs to be entered. Ensure you check the "Authorized scopes" check box for your new scope as you add each authorized client application, then click "Add application".
    * `1fec8e78-bce4-4aaf-ab1b-5451cc387264` (Teams mobile/desktop application)
    * `5e3ce6c0-2b1f-4285-8d4b-75ee78787346` (Teams web application)
  **Note** If you want to test or extend your Teams apps across Office and Outlook, kindly add below client application identifiers while doing Azure AD app registration in your tenant:
    * `4765445b-32c6-49b0-83e6-1d93765276ca` (Office web)
    * `0ec893e0-5785-4de6-99da-4ed124e5296c` (Office desktop)
    * `bc59ab01-8403-45c6-8796-ac3ef710b3e3` (Outlook web)
    * `d3590ed6-52b3-4102-aeff-aad2292ab01c` (Outlook desktop)

  - Navigate to **API Permissions**, and make sure to add the follow permissions:
    -   Select Add a permission.
    -   Select Microsoft Graph -\> Delegated permissions.
      * User.Read (enabled by default)    
      * Calendars.ReadWrite  
      * Mail.Send
      * MailboxSettings.ReadWrite  
    - Click on Add permissions. Please make sure to grant the admin consent for the required permissions.

  - Navigate to **Authentication**.
    - If an app hasn't been granted IT admin consent, users will have to provide consent the first time they use an app.
    - Set a redirect URI:
      * Select **Add a platform**.
      * Select **Single Page Application**.
      * Enter the **redirect URI** for the app in the following format: `https://%ngrokDomain%.ngrok-free.app/Auth/End`.
    
   - Navigate to the **Certificates & secrets**. In the Client secrets section, click on "+ New client secret". Add a description      (Name of the secret) for the secret and select “Never” for Expires. Click "Add". Once the client secret is created, copy its value, it need to be placed in the appsettings.json.



3. Setup for code

- Clone the repository

    ```bash
    git clone https://github.com/pnp/teams-dev-samples.git
    ```

- Modify the `/appsettings.json` and fill in the following details:
  - `{{YOUR-TENANT-ID}}` - Generated from Step 1 while doing AAd app registration in Azure portal Directory (tenant) ID.
  - `{{YOUR-MICROSOFT-APP-ID}}` - Generated from Step 1 while doing AAd app registration in Azure portal.
  - `{{ YOUR-CLIENT-SECRET}}` - Generated from Step 1, also referred to as Client secret
  - `{{ ApplicationIdURI }}` - Your application's ApplicationIdURI. E.g. api://%ngrokDomain%.ngrok-free.app/00000000-0000-0000-0000-000000000000.,
  
  - Run app in visual studio.
   - If you are using Visual Studio
  - Launch Visual Studio
  - File -> Open -> Project/Solution
  - Navigate to `samples/tab-corporate-helper` folder
  - Select `CorporateHelper.csproj` file

4. Setup Manifest for Teams
- __*This step is specific to Teams.*__

     **Edit** the `manifest.json` contained in the ./appPackage folder; note that this is not visible in Visual Studio. Replace your Microsoft App Id (that was created when you registered your app registration earlier) *everywhere* you see the place holder string `<<YOUR-MICROSOFT-APP-ID>>` (depending on the scenario the Microsoft App Id may occur multiple times in the `manifest.json`). Note that App ID and Client ID are the same thing.

     **Edit** the `manifest.json` for `validDomains` and replace `{{domain-name}}` with base Url of your domain. E.g. if you are using ngrok it would be `https://1234.ngrok-free.app` then your domain-name will be `1234.ngrok-free.app`.

     **Zip** up the contents of the Manifest folder to create a Manifest.zip file (Make sure that zip file does not contains any subfolder otherwise you will get error while uploading your .zip package).

- Upload the manifest.zip to Teams (in the Apps view click "Upload a custom app")
   - Go to Microsoft Teams. From the lower left corner, select Apps.
   - From the lower left corner, choose Upload a Custom App.
   - Go to your project directory, the ./Manifest folder, select the zip folder, and choose Open.
   - Select Add in the pop-up dialog box. Your app is uploaded to Teams.

- Run your app, either from Visual Studio with `F5` or using `dotnet run` in the appropriate folder.

## Running the sample.

**Install App:**

![InstallApp](assets/1.png)

**App's Home Page:**
![HomePage](assets/2.png)

## Minimal Path to Awesome

* Clone this repository.
* Start ngrok (ngrok http -host-header=rewrite 3978). Note the URL and update it in the manifest.json and appsettings.json files.
* Register an Azure AD application and enable Single-Sign-On with the ngrok URL in the Expose an API tab (Check Setup - Step 2 above).
* Add the following Delegated Permissions for Graph to your App Registration: User.Read, Calendars.ReadWrite ,Mail.Send, MailboxSettings.ReadWrite. Grant Admin Consent to them (https://learn.microsoft.com/en-us/graph/use-postman).
* Generate a Client Secret for your App Registration.
* Update the appsettings.json file (Check Setup - Step 3 above).
* In the command line, go to the project's folder (tab-corporate-helper) and run:
  * `dotnet run`
* Update the manifest (Check Setup - Step 4 above) and upload to Teams.

## Features

Once the app is installed, you can navigate between 3 tabs inside it:

* Home: show information about the currently logged-in user.
* Expenses: submit a expense report to your manager.
* Vacation: submit vacation requests to your manager.

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/tab-corporate-helper" />
