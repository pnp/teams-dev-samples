// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const {
    TurnContext,
    MessageFactory,
    TeamsActivityHandler,
    CardFactory,
    ActionTypes
} = require('botbuilder');

class BotActivityHandler extends TeamsActivityHandler {
    constructor() {
        super();
        /* Conversation Bot */
        /*  Teams bots are Microsoft Bot Framework bots.
            If a bot receives a message activity, the turn handler sees that incoming activity
            and sends it to the onMessage activity handler.
            Learn more: https://aka.ms/teams-bot-basics.

            NOTE:   Ensure the bot endpoint that services incoming conversational bot queries is
                    registered with Bot Framework.
                    Learn more: https://aka.ms/teams-register-bot. 
        */
        // Registers an activity event handler for the message event, emitted for every incoming message activity.
        this.onMessage(async (context, next) => {
            TurnContext.removeRecipientMention(context.activity);
            switch (context.activity.text.trim()) {
            case 'Hello':
                await this.mentionActivityAsync(context);
				break;
			case 'GetInfo':
				await this.sendProactiveInfoAsync(context);
				break;
            default:
                // By default for unknown activity sent by user show
                // a card with the available actions.
                const value = { count: 0 };
                const card = CardFactory.heroCard(
                    'Lets talk...',
                    null,
                    [{
                        type: ActionTypes.MessageBack,
                        title: 'Say Hello',
                        value: value,
                        text: 'Hello'
                    }]);
                await context.sendActivity({ attachments: [card] });
                break;
            }
            await next();
		});
		
		this.onMembersAdded(async (context, next) => {
			// Iterate over all new members added to the conversation

			
			for (const idx in context.activity.membersAdded) {
				// Greet anyone that was not the target (recipient) of this message.
				// Since the bot is the recipient for events from the channel,
				// context.activity.membersAdded === context.activity.recipient.Id indicates the
				// bot was added to the conversation, and the opposite indicates this is a user.
				if (context.activity.membersAdded[idx].id !== context.activity.recipient.id) {
					
					await context.sendActivity(`Welcome!`);
					
					await this.sendProactiveInfoAsync(context);
				
				}
			}
		
			// By calling next() you ensure that the next BotHandler is run.
			await next();
		});

        /* Conversation Bot */
    }

    /* Conversation Bot */
    /**
     * Say hello and @ mention the current user.
     */
    async mentionActivityAsync(context) {
        const TextEncoder = require('html-entities').XmlEntities;

        const mention = {
            mentioned: context.activity.from,
            text: `<at>${ new TextEncoder().encode(context.activity.from.name) }</at>`,
            type: 'mention'
        };

        const replyActivity = MessageFactory.text(`Hi ${ mention.text }`);
        replyActivity.entities = [mention];
        
        await context.sendActivity(replyActivity);
	}
	
	async sendProactiveInfoAsync(context) {

		const conversationReference = TurnContext.getConversationReference(context.activity);

		// so you can see everything it contains
		console.log(conversationReference);

		let conversationId = context.activity.conversation.id;
		let serviceUrl = context.activity.serviceUrl;
		let teamsAppId = process.env.TeamsAppId;
		let tabEntityId = process.env.ProactiveTabEntityId;
		var subEntityIdEncoded = conversationId + "|" + serviceUrl;
		var encodedContext = encodeURI(`{"subEntityId": "${subEntityIdEncoded}"}`);
		let deepLinkUrl = `https://teams.microsoft.com/l/entity/${teamsAppId}/${tabEntityId}?&context=${encodedContext}`;

        await context.sendActivity(`The conversationId for this conversation is: **${conversationId}**`);
		await context.sendActivity(`The serviceUrl for this conversation is: **${serviceUrl}**`);
		await context.sendActivity(`Click **[here](${deepLinkUrl})** to go to the tab for this app, where you can send a test pro-active message.`);
    }
    /* Conversation Bot */

}

module.exports.BotActivityHandler = BotActivityHandler;

