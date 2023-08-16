# Teams Remote Assistance Messaging Extension (using Azure Communication Services)

## Summary

This is a sample messaging extension for Microsoft Teams that allows Teams users to create remote assistance sessions for external parties (who may not use Teams). The external parties can then join a Teams meeting from a browser receive assistance. This is made possible by leveraging Azure Communication Services to join the external parties to the Teams meeting.

![Example usage](assets/example.gif)

## Prerequisites

* [Azure Functions Core Tools v4](https://github.com/Azure/azure-functions-core-tools) installed (latest version)
* [Node.js](https://nodejs.org) version 18 or higher installed:

    ```bash
    # Determine node version
    node --version
    ```

* [Static Web Apps CLI](https://azure.github.io/static-web-apps-cli/) installed. You can install it using the following command:

    ```bash
    npm install -g @azure/static-web-apps-cli
    ```

* [ngrok](https://ngrok.com/) installed. Although a free account will work with this sample, the tunnel subdomain will change each time you run ngrok, requiring a change to the Azure Bot messaging endpoint and the Teams app manifest. A paid account with a permanent subdomain is recommended.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|Aug 4, 2023|Lee Ford|Initial release

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

### Start ngrok

Start ngrok listening on port 4280 (this is what the Static Web Apps CLI uses by default):

```bash
ngrok http 4280
```

If you have a paid account, add the subdomain option to the command:

```bash
# Replace 12345678 with your ngrok subdomain
ngrok http 4280 -subdomain=12345678
```

> Take a note of the forwarding URL, as you will need it later.

### Create Azure resources

It is recommended to use [Azure Cloud Shell](https://shell.azure.com) for this step, but you can also use the `az` CLI on your local machine if you prefer.

Switch to the Azure subscription you want to use:

```bash
az account set --subscription <subscriptionId>
```

> Replace `<subscriptionId>` with the ID of the subscription you want to use

Create a resource group:

```bash
az group create --name <resourceGroupName> --location <location>
```

> Choose an Azure region and replace `<location>` with the region name (e.g. `uksouth`).

Create an app registration for bot:

```bash
az ad app create --display-name "Teams Remote Assistance" --sign-in-audience "AzureADMyOrg"
```

> Take note of the `appId` value from the output as this will be required in later steps.

Add `OnlineMeetings.ReadWrite.All` permission to app registration and grant admin consent:

```bash
az ad app permission add --id <appId> --api 00000003-0000-0000-c000-000000000000 --api-permissions b8bb2037-6e08-44ac-a4ea-4674e010e2a4=Role
az ad app permission admin-consent --id <appId>
```

> Replace `<appId>` with the `appId` value from an earlier step.

Reset the app registration credentials, making note of the `password` and `tenant` values from the output as this will be required in later steps:

```bash
az ad app credential reset --id <appId>
```

> Replace `<appId>` with the `appId` value from an earlier step.

Create bot that is tied to app registration:

```bash
az bot create --resource-group <resourceGroupName> --app-type SingleTenant --appid <appId> --tenant-id <tenantId> --name <botName> --endpoint <endpoint>
```

> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * `<appId>` with the `appId` value from the app registration created earlier
> * `<tenantId>` with the `tenant` value from the app registration created earlier
> * `<botName>` with the name of the bot you want to use. Bear in mind you are limited to the following characters: -, a-z, A-Z, 0-9, and _
> * `<endpoint>` with the forwarding URL from ngrok with `/api/messages` appended to it (e.g. `https://12345678.ngrok.io/api/messages`)

Create Teams channel for bot:

```bash
az bot msteams create --resource-group <resourceGroupName> --name <botName>
```

> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * `<botName>` with the name of the bot you used earlier

Create a communication service using:

```bash
az communication create --data-location <dataLocation> --resource-group <resourceGroupName> --name <acsName> --location global
```

> * Replace `<dataLocation>` with the location name (e.g. `uk` or `unitedstates`)
> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * `<acsName>` with the name of the communication service you want to use

List the keys for the communication service:

```bash
az communication list-key --resource-group <resourceGroupName> --name <acsName>
```

> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * `<acsName>` with the name of the communication service you used earlier
> * Take note of the `primaryConnectionString` value from the output as this will be required in later steps

Create a Cosmos DB database:

```bash
az cosmosdb create --name <accountName> --resource-group <resourceGroupName> --default-consistency-level Eventual --locations regionName="<location>" failoverPriority=0 isZoneRedundant=False --capabilities EnableServerless
```

> * Replace `<accountName>` with the name of the Cosmos DB account you want to use. This MUST be lowercase
> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * Replace `<location>` with the location name (e.g. `uksouth`)
> * Take note of the `documentEndpoint` value from the output as this will be required in later steps

Finally, get the connection string for the Cosmos DB account:

```bash
az cosmosdb keys list --name <accountName> --resource-group <resourceGroupName>
```

> * Replace `<accountName>` with the name of the Cosmos DB account you used earlier
> * Replace `<resourceGroupName>` with the name of the resource group created earlier
> * Take note of the `primaryMasterKey` value from the output as this will be required in later steps

### Run locally

1. Clone this repository
2. Create and populate a `local.settings.json` file in the `source` folder with the following (with your own values):

    ```json
    {
    "IsEncrypted": false,
    "Values": {
        "AzureWebJobsStorage": "",
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "AzureWebJobsFeatureFlags": "EnableWorkerIndexing",
        "ACS_CONNECTION_STRING": "<acsConnectionString>",
        "MicrosoftAppTenantId": "<tenantId>",
        "MicrosoftAppId": "<appId>",
        "MicrosoftAppPassword": "<appPassword>",
        "MicrosoftAppType": "SingleTenant",
        "COSMOS_DB_ENDPOINT": "<cosmosDbEndpoint>",
        "COSMOS_DB_KEY": "<cosmosDbKey>"
        }
    }
    ```

    > * Replace `<acsConnectionString>` with the `primaryConnectionString` value from the communication service created earlier
    > * Replace `<tenantId>` with the `tenant` value from the app registration created earlier
    > * Replace `<appId>` with the `appId` value from the app registration created earlier
    > * Replace `<appPassword>` with the `password` value from the app registration created earlier
    > * Replace `<cosmosDbEndpoint>` with the `documentEndpoint` value from the Cosmos DB account created earlier
    > * Replace `<cosmosDbKey>` with the `primaryMasterKey` value from the Cosmos DB account created earlier

3. Run the following to install, build and run the code (from the `source` folder):

    ```bash
    npm install
    swa build --auto
    swa start build --api-location api
    ```

### Grant app access to Teams meetings

You will need to add the app to a Teams application access policy to allow it to access Teams meetings. This can be done using the Teams PowerShell.

Install the Teams PowerShell module:

```powershell
Install-Module MicrosoftTeams
```

Connect to Teams:

```powershell
Connect-MicrosoftTeams
```

Create a new application access policy:

```powershell
New-CsApplicationAccessPolicy -Identity RemoteAssistance -AppIds "<appId>" -Description “Remote assistance app”
```

> Replace `<appId>` with the `appId` value from the app registration created earlier

Grant the policy to a user:

```powershell
Grant-CsApplicationAccessPolicy -PolicyName RemoteAssistance -Identity <user>
```

> For granting to all users, use `Grant-CsApplicationAccessPolicy -PolicyName RemoteAssistance -Global`
> Replace `<user>` with the user's UPN

### Teams app manifest

1. Edit the `manifest.json` file and replace the `id` and both `botId` values with the `appId` from the app registration created earlier
2. Zip the `manifest` folder into a `manifest.zip` file
3. Upload the `manifest.zip` file to Teams (side load the or upload in Teams Admin Center)

<img src="https://m365-visitor-stats.azurewebsites.net/teams-dev-samples/samples/msgext-remoteassitance" />
