# Teams OpenAI TfL (Transport for London) Status Bot

## Summary

- This sample is a bot for Microsoft Teams that provides information about Transport for London (TfL) underground train status. 
- The information is based on the response from TfL API. 
- The information exchanged between the user and the bot is in natural language. 
- The bot uses [OpenAI's function calling feature](https://openai.com/blog/function-calling-and-other-api-updates) to understand whether a function in the code needs to be called based on user's query. 
- The bot calls OpenAI API which transforms the JSON reponse from [TfL API](https://api.tfl.gov.uk/) to natural language.

![demo](./assets/images/demo.gif)

## Further details
- This sample shows how use [OpenAI's function calling feature](https://openai.com/blog/function-calling-and-other-api-updates). A Teams bot is used to show this feature in action. 
- The bot sends the user's message to [OpenAI API](https://platform.openai.com/docs/api-reference). 
- Based on user's message, OpenAI determines whether a function (in our code) needs to be called. 
- If so, based on the response from OpenAI, the bot calls the function (in our code i.e. a typescript function in this sample) - which in turn uses [TfL API](https://api-portal.tfl.gov.uk/apis) to get the status a line (underground train) in London. 
- The result of the function (raw JSON) is then sent back to OpenAI. OpenAI then uses the result to generate a response based on user's message/query.
- That response is then formatted as an adaptive card and sent back to the user.

## Frameworks

![drop](https://img.shields.io/badge/Bot&nbsp;Framework-4.20-green.svg)

## Prerequisites

* [OpenAI account](https://beta.openai.com/) and API key
* [Office 365 tenant](https://dev.office.com/sharepoint/docs/spfx/set-up-your-development-environment)
* [Node.js](https://nodejs.org) version 14 or higher

    ```bash
    # determine node version
    node --version
    ```

* [Azure Functions Core Tools](https://github.com/Azure/azure-functions-core-tools) version 4 or higher

    ```bash
    # determine core tools version
    func --version
    ```

* [ngrok](https://ngrok.com/) - Although a free account will work with this sample, the tunnel subdomain will change each time you run ngrok, requiring a change to the Azure Bot messaging endpoint and the Teams app manifest. A paid account with a permanent subdomain is recommended.

OR

* [GitHub Codespaces](https://github.com/features/codespaces) - If you are using GitHub Codespaces then you can make the port `7071` public and use the Codespaces URL as the Azure Bot messaging endpoint. e.g. `https://<your-codespace-name>.github.dev/api/messages`. See the [run on GitHub Codespaces](#Run-on-GitHub-Codespaces) section below.

## Version history

Version|Date|Author|Comments
-------|----|----|--------
1.0|June 27, 2023|Anoop T|Initial release

## Disclaimer

**THIS CODE IS PROVIDED _AS IS_ WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING ANY IMPLIED WARRANTIES OF FITNESS FOR A PARTICULAR PURPOSE, MERCHANTABILITY, OR NON-INFRINGEMENT.**

---

## Minimal Path to Awesome

### Start ngrok (if not using GitHub Codespaces)

Start ngrok listening on port 7071 (or whatever port you are running the Azure Function on)

```bash
ngrok http 7071
```

If you have a paid account, add the subdomain:

```bash
# Replace 12345678 with your ngrok subdomain
ngrok http 7071 -subdomain=12345678
```

Take a note of the forwarding URL, as you will need it later.

### Create an Azure Bot

1. Go to the [Azure Portal](https://portal.azure.com)
2. Search for **Azure Bot** and choose **Create**
3. Populate the bot with the following:
   * **Bot handle**: A unique bot name (the display name can be changed later)
   * **Type of App**: Single tenant (in a production scenario, you would be running in Azure and use Managed Identity)
    ![create_azure_bot](./assets/images/1_create_azure_bot.png)
4. With the bot created, under **Configuration**:
   * Take a note of the **Microsoft App ID** and **Microsoft App Tenant ID** (you will need these later)
   * Populate the **Messaging endpoint** with the ngrok forwarding URL (with `/api/messages` appended). Note: if you are not using a paid account, you will need to update this each time you restart ngrok.
    ![azure_bot_config](./assets/images/2_azure_bot_config.png)
   > If you are using GitHub Codespaces then you can update this later once you have the Codespaces URL. See the [run on GitHub Codespaces](#Run-on-GitHub-Codespaces) section below.
   * Click on **Manage Password** and create a **New client secret**. Specify a name and when it expires. Take a copy of the **Secret value** (you will need this later)
    ![appreg_new_secret](./assets/images/3_appreg_new_secret.png)
    ![copy_appreg_new_secret](./assets/images/4_appreg_new_secret_copy.png)
    > Note in a production environment, you should be using a Managed Identity to authenticate to the Azure Bot, rather than a client secret.
5. Under **Channels**, add the **Microsoft Teams** channel and enable messaging
   ![azure_bot_teams_channel](./assets/images/5_azure_bot_teams_channel.png)

### Run Locally

1. Clone this repository
2. Create and populate a `local.settings.json` file in the `source` folder with the following (with your own values):

    ```json
    {
    "IsEncrypted": false,
    "Values": {
        "FUNCTIONS_WORKER_RUNTIME": "node",
        "AzureWebJobsStorage": "",
        "OPENAI_API_KEY": "<YOUR OPENAI API KEY>",
        "GPT_MODELTO_USE": "gpt-4-0613", // might change in the future
        "MicrosoftAppId": "<YOUR MICROSOFT APP REGISTRATION ID>",
        "MicrosoftAppPassword": "<YOUR MICROSOFT APP REGISTRATION CLIENT SECRET>",
        "MicrosoftAppTenantId": "<YOUR MICROSOFT APP REGISTRATION TENANT ID>",
        "MicrosoftAppType": "SingleTenant"
        }
    }
    ```

3. Run the following to install, build and run the code (from the `source` folder):

    ```bash
    npm install
    npm run build
    func host start
    ```

### Run on GitHub Codespaces

- Follow the same steps as running locally, but you don't need to run ngrok.
- Once the Azure function is running, you can go into ports tab and make the port `7071` public.
- Then you need to copy the Codespaces URL and use it as the Azure Bot messaging endpoint. e.g. `https://<your-codespace-name>.github.dev/api/messages`

### Teams App Manifest

1. Edit the `manifest.json` file and replace the `id` and `botId` values with the **Microsoft App ID** from the Azure Bot
2. Zip the `manifest` folder into a `manifest.zip` file
3. Upload the `manifest.zip` file to Teams (side load the or upload in Teams Admin Center)

<img src="https://pnptelemetry.azurewebsites.net/teams-dev-samples/samples/bot-openai-tfl-status" />