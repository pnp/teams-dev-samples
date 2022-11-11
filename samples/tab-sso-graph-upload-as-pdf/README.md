---
page_type: sample
products:
- teams
languages:
- javascript
- typescript
extensions:
  contentType: samples
  app_features:
  - Tab
  technologies:
  - React
  - SSO
  - Microsoft Graph
  - HTML5
  platforms:
  - Express
  origin:
  - Community
createdDate: 11/30/2020 14:00:00 AM
---
# tab-sso-graph-upload-as-pdf

## Summary
This Teams Tab enables a user to upload a supported ("csv", "doc", "docx", "odp", "ods", "odt", "pot", "potm", "potx", "pps", "ppsx", "ppsxm", "ppt", "pptm", "pptx", "rtf", "xls", "xlsx") file type via drag and drop while the uploaded file will be converted as PDF.
In Teams context it uses the current channel as a Folder name in the default drive of current team.
It uses the following capabilities (mostly) on behalf of Microsoft Graph:
* Use HTML5 drag and drop event handling
* Writing normal files smaller 4MB
* Retrieving files with format=pdf conversion

## tab-sso-graph-upload-as-pdf in action
![File upload and PDF conversion](https://mmsharepoint.files.wordpress.com/2020/11/01fileuploadtopdf-1.gif)

A detailed functionality and technical description can be found in the [author's blog post](https://mmsharepoint.wordpress.com/2020/11/30/dragdrop-pdf-conversion-upload-with-yoteams-tab/)

## Applies to

- [Yeoman Generator for teams Tab SSO creation](https://github.com/pnp/generator-teams/wiki/Build-a-Tab-with-SSO-support)

## Solution

Solution|Author(s)
--------|---------
tab-sso-graph-upload-as-pdf| Markus Moeller ([@moeller2_0](http://www.twitter.com/moeller2_0))

## Version history

Version|Date|Comments
-------|----|--------
1.0|November 30, 2020|Initial release

## Disclaimer

**THIS CODE IS PROVIDED *AS IS* WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

1. Clone this repository to your local file system
- Ensure that you are at the solution folder
- in the command-line run:
  - **npm install**

2. Register an Azure AD application
- Go to https://aad.portal.azure.com/ and login with your O365 tenant admin (Application Admin at least!) 
- Switch to Azure Active Directory \App registrations and click „New registration“ 
- Give a name 
- Use „Single Tenant“ 
- Click Register
- Go to „Expose an Api“ tab, choose „Add a scope“ and use ngrok Url from previous step. Example: api://xxx.ngrok.io/6be408a3-456a-419c-bd77-479b9f640724 (while the GUID is your App ID of current App reg)
- Add scope "access_as_user" and enable admin and users to consent 
- Add consent display and descr such as „Office access as user“ (Adm) or „Office can access as you“
- Finally add following Guids as „client applications“ at the botom:
  - 5e3ce6c0-2b1f-4285-8d4b-75ee78787346 (Teams web application)
  - 1fec8e78-bce4-4aaf-ab1b-5451cc387264 (Teams Desktop client
  - (Don‘t forget to always check „Authorized Scopes“ while adding!)
- Go to „Certificates & secrets“ tab, choose „New Client Secret“ (Descr. And „Valid“ of our choice) 
- After „Add“ copy and note down the secret immediately!! (it won‘t be readable on screen exit anymore) 
- Go to „Api permissions“ and click „Add permission 
  - Choose „Microsoft Graph“ 
  - Choose „Delegated permissions“ and add „Files.ReadWrite.“ and the same way „Sites.ReadWrite.All.“, „offline_access“, „openid“, „email“, „profile“ 
(User.Read Delegated is not necessary, kick it or leave it ...) 
  - Finally on this tab click „Grant admin consent for <YourDomain>
- Go back to „Overview“ and copy and note down the Application (client) ID and Directory (tenant) ID same way/place like the secret above
 - Insert this values in your local .env file
3. Run your application
  - **gulp serve-ngrok**
4. Sideload your application
- From the \package subfolder sideload your app package (.zip) to a Team of your choice

## Features

This webpart illustrates the following concepts:

- Use HTML5 drag and drop event handling
- [Writing normal files smaller 4MB](https://docs.microsoft.com/en-us/graph/api/driveitem-put-content?view=graph-rest-1.0&tabs=http)
- Retrieving files with [format=pdf](https://docs.microsoft.com/en-us/graph/api/driveitem-get-content-format?view=graph-rest-1.0&tabs=http) conversion

<img src="https://pnptelemetry.azurewebsites.net/sp-dev-fx-webparts/samples/tab-sso-graph-upload-as-pdf" />
