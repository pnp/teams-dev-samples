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
    }

    /* Messaging Extension - Search */
    /* Building a messaging extension search command is a two step process.
        (1) Define how the messaging extension will look and be invoked in the client.
            This can be done from the Configuration tab, or the Manifest Editor.
            Learn more: https://aka.ms/teams-me-design-search.
        (2) Define how the bot service will respond to incoming search commands.
            Learn more: https://aka.ms/teams-me-respond-search.
        
        NOTE:   Ensure the bot endpoint that services incoming messaging extension queries is
                registered with Bot Framework.
                Learn more: https://aka.ms/teams-register-bot. 
    */

    // Invoked when the service receives an incoming search query.
    async handleTeamsMessagingExtensionQuery(context, query) {
        const axios = require('axios');
        const querystring = require('querystring');
        const searchQuery = query.parameters[0].value;
        //call GIPHY API - Use your own key
        const response = await axios.get(`https://api.giphy.com/v1/gifs/search?api_key=${process.env.GiphyApiKey}&limit=25&offset=0&rating=pg-13&lang=en&q=${querystring.stringify({ text: searchQuery, size: 100 })}`);

        const attachments = [];
        response.data.data.forEach(obj => {
            const heroCard = CardFactory.heroCard(obj.images.original.url);
            const preview = CardFactory.thumbnailCard(" ",
                " ", [obj.images.original.url]); // Preview cards are optional for Hero card. You need them for Adaptive Cards.
            preview.content.tap = { type: 'invoke', value: { description: obj.images.original.url } }; //pass to the selectedItem call
            const attachment = { ...heroCard, preview };
            attachments.push(attachment);
        });

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'grid',
                attachments: attachments
            }
        };
    }

    // Invoked when the user selects an item from the search result list returned above.
    async handleTeamsMessagingExtensionSelectItem(context, obj) {
        const heroCard = CardFactory.heroCard(""," ",
            [obj.description]); //obj.description is passed from the content.tap from preview

        const attachment = { contentType: heroCard.contentType, content: heroCard.content, preview: heroCard };

        return {
            composeExtension: {
                type: 'result',
                attachmentLayout: 'list',
                attachments: [attachment]
            }
        };
    }
    /* Messaging Extension - Search */

}

module.exports.BotActivityHandler = BotActivityHandler;

