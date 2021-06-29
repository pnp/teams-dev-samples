# ReporterPlus – Teams Device Capabilities Application.  

## Summary

The ReporterPlus sample app explains the MS Teams Device Capability features. This app is useful to Scan a barcode, capture images and record audio. After providing these inputs, the user can assign it to the approver and submit. Now the app sends an Adaptive card with refresh functionality to the group/meeting/team and to the approver's mail. The approver can Approve/Reject the request from either Teams or Outlook and the card on the other platform gets auto updated with the Universal Action Model.

## Frameworks

![drop](https://img.shields.io/badge/.NET&nbsp;Core-3.1-green.svg)
![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.0-green.svg)

## Prerequisites

* [Office 365 tenant](https://developer.microsoft.com/en-us/microsoft-365/dev-program).

* An Azure account with an active subscription. For details, see [Create an account for free](https://azure.microsoft.com/free/?WT.mc_id=A261C142F).

* [Visual Studio (2019 and above)](https://visualstudio.microsoft.com/vs/), [.NET Core 3.1](https://dotnet.microsoft.com/download/dotnet-core/3.1) (Make sure to install version that corresponds with your visual studio instance, 32 vs 64 bit)

* To test locally, you'll need [Ngrok](https://ngrok.com/download) installed on your local machine. ngrok will tunnel requests from the Internet to your local computer and terminate the SSL connection from Teams.

    * ex: `https://subdomain.ngrok.io`.
    
	 NOTE: A free Ngrok plan will generate a new URL every time you run it, which requires you to update your Azure AD registration, the Teams app manifest, and the project configuration. A paid account with a permanent Ngrok URL is recommended.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|June 24, 2021|Sathya Raveendran <br/> Veera Venkata Sai Pothan Thota <br/>|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

Step 1: Setup bot in Service
====================================
1. Search for Azure Active Directory in portal.azure.com and Add a "App Registration".
![image](https://user-images.githubusercontent.com/80528379/123678831-723f1c80-d864-11eb-921c-a87837938504.png)

2. Register an application.

	* Fill out name and select third option for supported account type and click "Register".

![image](https://user-images.githubusercontent.com/80528379/123212936-0b77d700-d4e3-11eb-9666-14d89b965cd2.png)

	* Copy and paste the App Id and Tenant ID somewhere safe. You will need it in a future steps.

3. Create Client Secret.
   * Navigate to the "Certificates & secrets" blade and add a client secret by clicking "New Client Secret".

![image](https://user-images.githubusercontent.com/80528379/123219361-6f51ce00-d4ea-11eb-9858-9a89647d70bd.png)

	* Copy and paste the secret somewhere safe. You will need it in a future steps.
	
4. Create new bot channel registration resource in Azure.

![image](https://user-images.githubusercontent.com/80528379/123219532-9f996c80-d4ea-11eb-94f0-d77627a3b7a9.png)

5. Create New Microsoft App ID and Password.

![image](https://user-images.githubusercontent.com/80528379/123214844-585cad00-d4e5-11eb-9eca-f02048999d2b.png)
   * Paste the App Id and Password copied from the points 2 & 3 in the respective blocks and click on OK.

![image](https://user-images.githubusercontent.com/80528379/123214898-6ad6e680-d4e5-11eb-8554-f06c0bd9ab5a.png)

   * Click on Create on the Bot Channel registration.
   
6. Go to the created resource, navigate to channels and add "Microsoft Teams" and “Outlook” channels.

![image](https://user-images.githubusercontent.com/80528379/123219702-d1aace80-d4ea-11eb-8037-308219558754.png)

7. Edit Outlook, click on please register here.

![image](https://user-images.githubusercontent.com/80528379/123219798-ed15d980-d4ea-11eb-8af2-718ec1222e19.png)

8. Provide the Friendly Name and other required details as requested on the page and Save it.
	- Provide the Mail-Id on behalf of which you want to Send the Outlook Actionable Message in `Sender email address from which actionable emails will originate` and select the scope as `Global`.
	- For more details to request for the Originator Id approval, please follow the [documentation](https://docs.microsoft.com/en-us/outlook/actionable-messages/email-dev-dashboard).

![image](https://user-images.githubusercontent.com/80528379/123217381-239e2500-d4e8-11eb-8f52-da9c507fa9a0.png)

	* copy the Provider Id (originator) and Sender Email Address, you will need it in appsettings.json to send Outlook Actionable Messages.	
											      
9. Add any necessary API permissions in the App registration.
	* Navigate to "API permissions" blade on the left-hand side.
	* Add following permissions to the application.
		* Application permissions
			* Mail.Send

![image](https://user-images.githubusercontent.com/80528379/123676010-00b19f00-d861-11eb-944d-7290f15aac88.png)

If you are logged in as the Global Administrator, click on the “Grant admin consent for %tenant-name%” button to grant admin consent, else inform your Admin to do the same through the portal.

Step 2: Create a Storage Account to store the Request Details as a blob
====================================
1. Create a Storage Account in Azure.

![image](https://user-images.githubusercontent.com/80528379/123222066-32d3a180-d4ed-11eb-9b6a-b07860a96073.png)

 * Go to Access Keys on the left panel.
 
 ![image](https://user-images.githubusercontent.com/80528379/123224240-44b64400-d4ef-11eb-977c-e3b1e6b6cd6f.png)

	* Copy and paste the Storage account name and any one Connection String somewhere safe. You will need it in a future steps.

 * Now go to the Resource Sharing (CORS) on the left panel and provide the following details under Blob service
    * Allowed origins = *
    * Allowed methods = DELETE, GET, HEAD, MERGE, POST, OPTIONS, PUT
    * Allowed headers = *
    * Exposed headers = *
    * Max age = 86400
    
 ![image](https://user-images.githubusercontent.com/80528379/123225085-feadb000-d4ef-11eb-8a87-3ec0a6132e8d.png)

2. Navigate to the Containers in the left Panel and create a Container.

![image](https://user-images.githubusercontent.com/80528379/123222526-a8d80880-d4ed-11eb-9b49-fc04aa56bac9.png)

	* Note the Container Name. You will need it in a future steps.


 * Go to Shared Access Token on the left panel of the Container and Generate SAS Token and Url by giving the following Permissions.
    * Read
    * Add
    * Create
    * Write
    * Delete
 
 ![image](https://user-images.githubusercontent.com/80528379/123228194-eb501400-d4f2-11eb-9618-3e64531e11a9.png)
 
	* Copy and paste the Blob SAS token somewhere safe. You will need it in a future steps.
	
Step 3: Run the app locally 
====================================
1. Clone the repository.

  		git clone “https://github.com/pnp/teams-dev-samples.git”

2. If you are using Visual Studio
 	- Launch Visual Studio.
 	- File -> Open -> Project/Solution.
 	- Navigate to samples/app-ReporterPlus.
 	- Select ReporterPlus.sln file.

3. Update the appsettings.json files
      - `MicrosoftAppId` & `TenantId` from the Step-1 Point-2.
      - `MicrosoftAppPassword` from Step-1 Point-3.
      - `ServiceUrl` is the URL sent by Teams in the Bot payload in the turnContext.Activity.serviceUrl property, debug the project to get the URL.
      - `BaseUrl` is the ngrok url that has been generated for the tunneling service as described in the Step-3 Point-4.
      - `OriginatorId` from Step-1 Point-8.
      - `SenderEmail` with the email that you have provided to create an Originator Id in the Step-1 Point-8.
      - `BlobAccountName` and `BlobConnectionString` from the Step-2 Point-1.
      - `BlobContainerName` and `BlobSAS_Token` from the Step-2 Point-2.

![image](https://user-images.githubusercontent.com/80528379/123258622-32e59880-d511-11eb-8aa0-f068147c8eb4.png)

4. Run Ngrok to expose your local web server via a public URL. Make sure to point it to your Ngrok URI. For example, if you're using port 3978 locally, run:

		Win: ngrok http 3978 -host-header=localhost:3978 -subdomain="contoso"
		Mac: ngrok http 3978 -host-header=localhost:3978 -subdomain="contoso".

5. Update messaging endpoint in the Azure Bots Channel Registration. Open the Bot channel registration, click on Configuration/Settings on the left pane, whichever is available and update the messaging endpoint to the endpoint that bot app will be listening on. Update the ngrok URL in the below format for the messaging endpoint.

		ex: https://<subdomain>.ngrok.io/api/messages.

![image](https://user-images.githubusercontent.com/80528379/123259169-cf0f9f80-d511-11eb-924d-4c8c07df09bb.png)

Step 4: Packaging and installing your app to Teams 
==================================================

Make sure the required values such as `MicrosoftAppId` and `BaseUrl` are populated in the manifest from appsettings.json, Zip the manifest with the profile images and install/add it in Teams.

Step 5: Try out the app
==================================================


## Limitations


## App Features

