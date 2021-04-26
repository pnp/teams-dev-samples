// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

// index.js is used to setup and configure your bot

// Import required pckages
const path = require('path');
const express = require('express');
const cors = require('cors');
// Import required bot services.
// See https://aka.ms/bot-services to learn more about the different parts of a bot.
const { BotFrameworkAdapter } = require('botbuilder');

// Import bot definitions
const { BotActivityHandler } = require('./botActivityHandler');

const { MicrosoftAppCredentials } = require('botframework-connector');

const bodyParser = require("body-parser");

// Read botFilePath and botFileSecret from .env file.
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({ path: ENV_FILE });

// Create adapter.
// See https://aka.ms/about-bot-adapter to learn more about adapters.
const adapter = new BotFrameworkAdapter({
    appId: process.env.BotId,
    appPassword: process.env.BotPassword
});

adapter.onTurnError = async (context, error) => {
    // This check writes out errors to console log .vs. app insights.
    // NOTE: In production environment, you should consider logging this to Azure
    //       application insights.
    console.error(`\n [onTurnError] unhandled error: ${ error }`);

    // Send a trace activity, which will be displayed in Bot Framework Emulator
    await context.sendTraceActivity(
        'OnTurnError Trace',
        `${ error }`,
        'https://www.botframework.com/schemas/error',
        'TurnError'
    );

    // Send a message to the user
    await context.sendActivity('The bot encountered an error or bug.');
    await context.sendActivity('To continue to run this bot, please fix the bot source code.');
};

// Create bot handlers
const botActivityHandler = new BotActivityHandler();

// Create HTTP server.
const server = express();

//Here we are configuring express to use body-parser as middle-ware.
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());
server.use(cors({
	origin: process.env.FrontEndAddress
}));


const port = process.env.port || process.env.PORT || 7071;
server.listen(port, () => 
    console.log(`\Bot/ME service listening at http://localhost:${port}`)
);

// Listen for incoming requests.
server.post('/api/messages', (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Process bot activity
        await botActivityHandler.run(context);
    });
});

server.post('/api/sendProactiveTextMessage', (req, res) => {

	let conversationId = req.body.conversationId;
	let serviceUrl = req.body.serviceUrl;

	let conversationReference = {
		conversation: { id: conversationId },
		serviceUrl: serviceUrl
	}

	adapter.continueConversation(conversationReference, async turnContext => {
		// If you encounter permission-related errors when sending this message, see
		// https://aka.ms/BotTrustServiceUrl

		MicrosoftAppCredentials.trustServiceUrl(serviceUrl);

		await turnContext.sendActivity('Proactively saying **Hello**');
	});

	res.end();
});