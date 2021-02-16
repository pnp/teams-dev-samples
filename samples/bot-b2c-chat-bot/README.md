# Create External Org Communication chat bot(B2c) - Sample code.  

## Summary

This sample code shows External org communication chat bot, as the name suggests allows citizen end users get in touch with an SME / Support Agent belonging to a business entity to discuss and address an issue. It allows business users with a Teams license on one side chat with an external customer who Doesn't have or cannot use Teams clients for any reason. 
Samples are generally not production-ready or an out-of-the-box solution but are intended to show developers specific patterns for use in their applications. The functionality is bare bone, all it does is to initiate a Calling & Meeting bot on behalf of users and enables the meeting organizers to programmatically add a custom app, in this example “Share Notes”, to the meeting.

<img src="./Docs/Images/B2CBot-E2E.gif" alt="B2CBot E2E Flow" style="width: 100%;">

## Frameworks

![drop](https://img.shields.io/badge/.NET&nbsp;Core-3.1-green.svg)
![drop](https://img.shields.io/badge/Bot&nbsp;Framework-3.0-green.svg)

## Prerequisites

* [Office 365 tenant](https://developer.microsoft.com/en-us/microsoft-365/dev-program)

* To test locally, you'll need [Ngrok](https://ngrok.com/download) and [Azure Cosmos DB Emulator](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21) installed on your development machine. Make sure you've downloaded and installed both on your local machine. ngrok will tunnel requests from the Internet to your local computer and terminate the SSL connection from Teams.

    * ex: `https://subdomain.ngrok.io`.
    
	 NOTE: A free Ngrok plan will generate a new URL every time you run it, which requires you to update your Azure AD registration, the Teams app manifest, and the project configuration. A paid account with a permanent Ngrok URL is recommended.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|Feb 18, 2021|Abtin Amini <br />Arun Kumar Anaparthi <br/> Sathya Raveendran|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

Step 1: Setup bot in Service
====================================
1. Create new bot channel registration resource in Azure.

<img src="./Docs/Images/BotChannelRegistration.png" alt="Bot Channel Registration" style="width: 100%;">

2. Create New Microsoft App ID and Password.

<img src="./Docs/Images/CreateNewMicrosofAppIDandPassword.png" alt="Create New Microsoft App ID and Password" style="width: 100%;">

3. Go to App registrations and create a new app registration in a different tab.
4. Register an application.
	* Fill out name and select third option for supported account type and click "Register".

<img src="./Docs/Images/RegisterAnApplication.png" alt="Register An Application" style="width: 100%;">

5. Create Client Secret.
	* Navigate to the "Certificates & secrets" blade and add a client secret by clicking "New Client Secret"

<img src="./Docs/Images/NewClientSecret.png" alt="New Client Secret" style="width: 100%;">

	* Copy and paste the secret somewhere safe. You will need it in a future step. Paste the App Id and password in the respective blocks and click on OK.

<img src="./Docs/Images/PastetheAppIdandPassword.png" alt="Paste the AppId and Password" style="width: 100%;">

	* Click on Create on the Bot Channel registration

Step 2: Configure AAD app
====================================
1. Expose API endpoint.
	* Click "Expose an API" in the left rail
		* Select the Set link to generate the Application ID URI in the form of api://{AppID}. Insert your fully qualified domain name (with a forward slash "/" appended to the end) between the double forward slashes and the GUID. The entire ID should have the form of: api://fully-qualified-domain-name/{AppID}.
			 * ex: `api://subdomain.ngrok.io/00000000-0000-0000-0000-000000000000`.
2. Click "Add a scope"
	* access_as_user as the Scope name.
	* Set Who can consent? to Admins and users.
	* Fill in the fields for configuring the admin and user consent prompts with values that are appropriate for the access_as_user scope. Suggestions:
		* Admin consent title: Teams can access the user’s profile.
		* Admin consent description: Allows Teams to call the app’s web APIs as the current user.
		* User consent title: Teams can access your user profile and make requests on your behalf.
		* User consent description: Enable Teams to call this app’s APIs with the same rights that you have 
	* Ensure that State is set to Enabled.
	* Select Add scope (Note: The domain part of the Scope name displayed just below the text field should automatically match the Application ID URI set in the previous step, with /access_as_user appended to the end).
3. Authorize client applications.
      Add the following Ids as authorized clients for your application.
	* 1fec8e78-bce4-4aaf-ab1b-5451cc387264 (Teams mobile/desktop application).
	* 5e3ce6c0-2b1f-4285-8d4b-75ee78787346 (Teams web application).
4. Add any necessary API permissions 
	* Select Microsoft Graph -> Delegated permissions
 		- User.Read (enabled by default)
 		- email
 		- offline_access
 		- OpenId
 		- Profile
 		- User.Read.All
 		- User.Invite.All
 		- Calendars.ReadWrite
 		- TeamsAppInstallation.ReadWriteForChat
 		- TeamsTab.Create
 		- Notes.ReadWrite.All
		- People.Read
		
	* Select Microsoft Graph -> Application permissions
 		- Notes.ReadWrite.All
 		- Calls.AccessMedia.All
 		- Calls.Initiate.All
 		- Calls.InitiateGroupCall.All
 		- Calls.JoinGroupCall.All
 		- Calls.JoinGroupCallAsGuest.All                 

<img src="./Docs/Images/APIPermissions.png" alt="API Permissions" style="width: 100%;">

5. Redirect URI
 	- Select Add a platform.
 	- Select web.
 	- Enter the redirect URI for your app.
	    * ex: `https://subdomain.ngrok.io/End, https://subdomain.ngrok.io/auth`.

    Next, Enable implicit grant by checking the following boxes:  
    ✔ ID Token  
    ✔ Access Token
    
<img src="./Docs/Images/RedirectURI.png" alt="Redirect URI" style="width: 100%;">

Step 3: Run the app locally 
====================================
1. Clone the repository.

  		git clone “https://github.com/pnp/teams-dev-samples.git”

2. If you are using Visual Studio
 	- Launch Visual Studio
 	- File -> Open -> Project/Solution
 	- Navigate to samples/app-virtual-events-meeting-extensibility/Source/VirtualMeetingExtensibility folder.
 	- Select VirtualMeetingExtensibility.csproj file.

3. The Azure Cosmos DB Emulator need to be runnning before starting the service. To start the Azure Cosmos DB Emulator on Windows, select the Start button or press the Windows key. Begin typing Azure Cosmos DB Emulator, and select the emulator from the list of applications.When the emulator has started, you'll see an icon in the Windows taskbar notification area. It automatically opens the Azure Cosmos data explorer in your browser at this URL https://localhost:8081/_explorer/index.html URL. Make sure to copy the URI and Primary key values from the data explorer, update the same in the appsettings.json file. Cosmos Database and collection names can be anything of your choice. For more information, see the [Azure Cosmos DB Emulator reference](https://docs.microsoft.com/en-us/azure/cosmos-db/local-emulator?tabs=cli%2Cssl-netstd21) article.

4. Update the index.cshtml and appsettings.json files. 

<img src="./Docs/Images/IndexViewUpdate.png" alt="Index View Update" style="width: 100%;">

<img src="./Docs/Images/AppSettings.png" alt="App Settings" style="width: 100%;">

NOTE: The App id to be installed into Teams meeting can be retrieved using the graph explorer. As this sample uses the same app to be added to the teams meeting, app needs to be installed into Teams (follow step 4 on how to package and install the app to teams) and use the app's ID generated by Teams (different from the external ID). For more information, see the [List teamsApp](https://docs.microsoft.com/en-us/graph/api/appcatalogs-list-teamsapps?view=graph-rest-1.0&tabs=http) refernce article

5. Press F5 to run the project in the Visual studio.

6. Run Ngrok to expose your local web server via a public URL. Make sure to point it to your Ngrok URI. For example, if you're using port 3333 locally, run:

		Win: ./ngrok http 3333 -host-header=localhost:3333 -subdomain="contoso"
		Mac: /ngrok http 3333 -host-header=localhost:3333 -subdomain="contoso".

7. Enable the Microsoft Teams channel and enable calling on the Calling tab in the Azure Bots Channel Registration. Fill in the Webhook (for calling) where you will receive incoming notifications. E.g. https://{your domain}/callback/calling.

<img src="./Docs/Images/EnableCalling.png" alt="Enable Calling" style="width: 100%;">

Step 4: Packaging and installing your app to Teams 
==================================================

Make sure the required values such ap App id, content URL of Static tab, configuration url of configurable tab and web application info sections are populated in the manifest, Zip the manifest with the profile images and install it in Teams.


Step 5: Try out the app
==================================================

1: Citizen end users can raise a request to get in touch with an SME / support agent on Teams using bot interface on website. The users are asked to submit basic contact information, query details to aid in triage 

<img src="./Docs/Images/1.gif" alt="raise request" style="width: 100%;">

2: Agents may assign the incoming consumer requests to themselves and start chatting with the consumers.   

<img src="./Docs/Images/2.gif" alt="assign" style="width: 100%;">

3. Real time chat between the citizen user and Teams user . The app shows the name of the citizen user on the bot name to add more clarity
 
 <img src="./Docs/Images/3.gif" alt="teamuser" style="width: 100%;">

4: The citizen user may also share documents in the chat that will be sent to Teams user and stored in a well-defined directory structure. The app creates a directory for each chat session.

<img src="./Docs/Images/4.gif" alt="teamuser" style="width: 100%;">

5: If both parties require, they may also get on a call initiated by the Teams user. This is useful in cases where chat is not adequate, and a video / audio communication is required for the scenario.  

<img src="./Docs/Images/5.gif" alt="teammeeting" style="width: 100%;">

6: A single Teams user may chat with more than one citizen user at a time. Each request is posted as a conversation thread allowing Teams user to have multiple parallel conversations.   

<img src="./Docs/Images/6.gif" alt="Meeting Side Panel" style="width: 100%;">

## Take it Further

There is multiple real-world scenarios across different industries that can be brought to life with B2C chat forming the back bone of the solution. Following are few scenarios where a B2C chat bot would play crux of the solution.

<table>
<tbody>
<tr>
<td>
<td class="col-md-8" style="color:black;" align="center"><b>Industry</b></td>
<td class="col-md-8" style="color:black;" align="center"><b>Scenario Description</b></td>
<td class="col-md-8" style="color:black;" align="center"><b>Citizen end user</b></td>
<td class="col-md-8" style="color:black;" align="center"><b>Business SME</b></td>
</td>
</tr>
<tr>
<td>Finance & Banking</td>
<td>A bank’s customer is confused with the ideal policy that will suit his needs and wants to speak to an agent from the bank to go through his options in detail.</td>
<td>High net worth individuals, Banking customers, loan requesters</td>
<td>Relationship managers, Policy Sales Agents
</td>
</tr>
<tr>
<td>Healthcare</td>
<td>A patient would like to speak to a doctor for routine consultation but wants to avoid physical hospital visits and potential exposure to COVID 19 pandemic. </td>
<td>Patient</td>
<td>Doctor</td>
</tr>
<tr>
<td>Retail</td>
<td>An avid shopper likes a cleaning equipment they saw on the store’s website and would like to see video demo from store executive before placing an order</td>
<td>Shopping consumer</td>
<td>Sales Agent, Store FLW </td>
</tr>
<tr>
<td>Insurance</td>
<td>An insurance policy holder has met with an accident and has the damaged vehicle. He gets in touch with insurance firm to show vehicle and ask questions</td>
<td>Insurance policy customers</td>
<td>Insurance agent</td>
</tr>
<tr>
<td>Government</td>
<td>Residents of a city / state can ask questions and get answers from state officials regarding COVID 19 lockdowns, travel and other restrictions</td>
<td>Residents</td>
<td>Government support desk</td>
</tr>
</tbody>
</table>

Communication channels:  The citizen consumer may use a bot interface on website (as showcased by this sample app) as a communication channel and interact seamlessly, in real time with a user on Teams. If required, the app can also be customized to have a bot inside native mobile app or use any other popular consumer communication channels as a way of reaching out to user on Teams. 

<img src="https://telemetry.sharepointpnp.com/teams-dev-samples/samples/bot-b2c-chat-bot" />
