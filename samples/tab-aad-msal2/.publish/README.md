# Publishing

Create a publishing package composed of the manifest file that describes your apps capabilities and the required icon images.

## App Manifest

Your manifest file must be named "manifest.json" and be at the top level of the upload package. Note that manifests and packages built previously might support an older version of the schema. For Teams apps and especially AppSource (formerly Office Store) submission, you must use the current [manifest schema](https://docs.microsoft.com/en-us/microsoftteams/platform/resources/schema/manifest-schema). The publish folder in the project you created contains a completed app manifest for the selections you made when generating the project.

## Manifest Environment

The publishing folder contains an environment file with extension ".env".  The property and value pairing in this file replace the keys in your manifest.json template.  

An example would be in your ".env" file you have a property of "baseUrl".  When you update the value of this property the value will be merged into the manifest.json template file and replace all items with the token {baseUrl0}.  The generated merge is then paired with the icons files in that folder and a new zip publishing package will be created with the name of that ".env" file.

**For example:**
 - development.env
 - File contains property value pairing of; baseUrl=http://localhost:3000
 - Generates a publishing package with the name of development.zip containing the icons referenced in the manifest file along with the manifest.json template replaced with the values in the env file.

 **Supported Properties**
teamsappid: The unique id used to identify your application
version: The version number of your application
appname: The short name of your application
fullappname: The longer version of the name of your application
botId: The id of the bot for your environment
baseUrl: The protocol and hostname of the url for your application
singleSignOnAppId: The Application Client ID from Azure portal used for SSO (Single Sign On)
singleSignOnAPIDomain: The domain of the api service used for SSO

Note: 
The 'baseUrl' and 'botId' can be used for multiple replacements in your manifest if you have multiple values for items in your application.  As long as the property starts with 'baseUrl' or 'botId' you can add a number or text after to describe another replacement value.  Like baseUrl1, baseUrl2, or botId1.

## Automatic Package Generation

  Inside of the publishing folder anytime you save an environment file ".env" the deployment package for that file will be generated with the name of the environment file with the ".zip" extension.

Also, if you update the manifest.json template file all environment files in that folder will be used to regenerate all publishing packages ".zip" in that folder.
