// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const { ChoicePrompt, ChoiceFactory, DialogSet, DialogTurnStatus, OAuthPrompt, WaterfallDialog } = require('botbuilder-dialogs');

const { LogoutDialog } = require('./logoutDialog');

const CHOICE_PROMPT = 'ChoicePrompt';
const CHOICE_PROMPT_SHOW_TOKEN = 'Show token';
const CHOICE_PROMPT_SHOW_EMAIL = 'Show my email';
const CHOICE_PROMPT_DO_NOTHING = 'Do Nothing';
const MAIN_DIALOG = 'MainDialog';
const MAIN_WATERFALL_DIALOG = 'MainWaterfallDialog';
const OAUTH_PROMPT = 'OAuthPrompt';

class MainDialog extends LogoutDialog {
    constructor() {
        super(MAIN_DIALOG, process.env.connectionName);

        this.addDialog(new OAuthPrompt(OAUTH_PROMPT, {
            connectionName: process.env.connectionName,
            text: 'Please Sign In',
            title: 'Sign In',
            timeout: 300000
        }));
        this.addDialog(new ChoicePrompt(CHOICE_PROMPT));
        this.addDialog(new WaterfallDialog(MAIN_WATERFALL_DIALOG, [
            this.promptStep.bind(this),
            this.loginStep.bind(this),
            this.displayInfoPhase1.bind(this),
            this.displayInfoPhase2.bind(this)
        ]));

        this.initialDialogId = MAIN_WATERFALL_DIALOG;
        this.options = {};
    }

    /**
     * The run method handles the incoming activity (in the form of a DialogContext) and passes it through the dialog system.
     * If no dialog is active, it will start the default dialog.
     * @param {*} dialogContext
     */
    async run(context, accessor) {
        const dialogSet = new DialogSet(accessor);
        dialogSet.add(this);

        const dialogContext = await dialogSet.createContext(context);
        const results = await dialogContext.continueDialog();
        if (results.status === DialogTurnStatus.empty) {
            await dialogContext.beginDialog(this.id, this.options);
        }
    }

    async promptStep(stepContext) {
        return await stepContext.beginDialog(OAUTH_PROMPT);
    }

    async loginStep(stepContext) {
        // Get the token from the previous step. Note that we could also have gotten the
        // token directly from the prompt itself. There is an example of this in the next method.
        const tokenResponse = stepContext.result;
        if (tokenResponse) {
            await stepContext.context.sendActivity('You are now logged in.');
            return await stepContext.prompt(CHOICE_PROMPT, {
                prompt: "What do you want to do?",
                choices: ChoiceFactory.toChoices([
                    { value: CHOICE_PROMPT_SHOW_TOKEN },
                    { value: CHOICE_PROMPT_SHOW_EMAIL },
                    { value: CHOICE_PROMPT_DO_NOTHING }
                ])
            });
        }
        await stepContext.context.sendActivity('Login was not successful please try again.');
        return await stepContext.endDialog();
    }

    async displayInfoPhase1(stepContext) {
        const result = stepContext.result;
        stepContext.options.choice = result.value;

        if (result) {
            // Call the prompt again because we need the token. The reasons for this are:
            // 1. If the user is already logged in we do not need to store the token locally in the bot and worry
            // about refreshing it. We can always just call the prompt again to get the token.
            // 2. We never know how long it will take a user to respond. By the time the
            // user responds the token may have expired. The user would then be prompted to login again.
            //
            // There is no reason to store the token locally in the bot because we can always just call
            // the OAuth prompt to get the token or get a new token if needed.
            return await stepContext.beginDialog(OAUTH_PROMPT);
        }
        return await stepContext.endDialog();
    }

    async displayInfoPhase2(stepContext) {

        const tokenResponse = stepContext.result;
        const choice = stepContext.options.choice;

        if (tokenResponse) {
            switch (choice) {
                case CHOICE_PROMPT_SHOW_TOKEN: {
                    await stepContext.context.sendActivity(`Here is your token ${tokenResponse.token}`);
                    break;
                }
                case CHOICE_PROMPT_SHOW_EMAIL: {
                    await this.showEmail(stepContext, tokenResponse.token);
                    break;
                }
                default: {
                    await stepContext.context.sendActivity(`OK have a nice day.`);
                    break;
                }
            }
        }
        return await stepContext.endDialog();
    }

    async showEmail(stepContext, token) {

        const response = await fetch("https://graph.microsoft.com/v1.0/me/mailFolders/inbox/messages",
            {
                method: 'GET',
                headers: {
                    "accept": "application/json",
                    "authorization": "bearer " + token,
                    // mode: 'cors',
                    // cache: 'default'
                }
            });

        if (response.ok) {
            const messages = await response.json();
            let botOutput = `Retrieved ${messages.value.length} messages:`;
            for (const m of messages.value) {
                botOutput += `<br />${m.receivedDateTime} - ${m.subject} `;
            }
            await stepContext.context.sendActivity(botOutput);
        } else {
            await stepContext.context.sendActivity(`Error ${response.status}: ${response.statusText}`);
        }

    }
}

module.exports.MainDialog = MainDialog;
