import * as debug from "debug";
import { TeamsActivityHandler, TurnContext, MessagingExtensionAction, MessagingExtensionActionResponse, CardFactory, TaskModuleContinueResponse, MessageFactory, TeamsChannelAccount, TeamsInfo } from "botbuilder";

// Initialize debug logging module
const log = debug("msteams");

export class HelloBot extends TeamsActivityHandler {

    public constructor() {
        super();
        this.onMessage(async (context, next) => {
            await next();
        });
    }

    protected async handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {    
        try {
            await this.GetConversationMembers(context);
        } catch (err) {
            // app not installed, send app JIT as adaptive card
            return this.sendJITInstallCard();             
        }
        return {
            task: {
                type: "continue",
                value: {
                    title: "Input form",
                    card: CardFactory.adaptiveCard({
                        $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                        type: "AdaptiveCard",
                        version: "1.2",
                        body: [
                            {
                                type: "TextBlock",
                                text: "Please enter an e-mail address"
                            },
                            {
                                type: "Input.Text",
                                id: "email",
                                placeholder: "somemail@example.com",
                                style: "email"
                            },
                        ],
                        actions: [
                            {
                                type: "Action.Submit",
                                title: "OK",
                                data: { id: "unique-id" }
                            }
                        ]
                    })
                }
            } as TaskModuleContinueResponse
        } as MessagingExtensionActionResponse;
    }

    protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {        
        const data = { ...action.data };
        if (data.msteams && data.msteams.justInTimeInstall) {
            log(`Submit action - App installed`);
            return Promise.resolve({} as MessagingExtensionActionResponse);
        }
        const card = CardFactory.adaptiveCard(
        {
            type: "AdaptiveCard",
            body: [
                {
                    type: "TextBlock",
                    size: "Large",
                    text: data.email
                },
                {
                    type: "Image",
                    url: `https://randomuser.me/api/portraits/thumb/women/${Math.round(Math.random() * 100)}.jpg`
                }
            ],
            $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
            version: "1.2"
        });
        await context.sendActivity(MessageFactory.attachment(card));
        return Promise.resolve({} as MessagingExtensionActionResponse);
    }

    public async GetConversationMembers(ctx: TurnContext): Promise<any[]> {
        try {
            const res: TeamsChannelAccount[] = await (await TeamsInfo.getPagedMembers(ctx)).members;            
            return res;
        }
        catch (err) {
            log(`error while getting conversation members: ${err}`);
            throw err;
        }
    }

    private sendJITInstallCard(): MessagingExtensionActionResponse {
        log(`Event triggered - JIT install card sent.`);
        const jitCard = CardFactory.adaptiveCard(
        {
            type: "AdaptiveCard",
            body: [
            {
                type: "TextBlock",
                text: `🚀 Looks like the app is not installed in this conversation, click continue to install.`,
                wrap: true
            }
            ],
            actions: [
            {
                type: "Action.Submit",
                title: "Continue",
                data: {
                msteams: {
                    justInTimeInstall: true
                }
                }
            }
            ],
            version: "1.0"
        });

        return {
            task: {
                type: "continue",
                value: {
                    card: jitCard,
                    height: 130,
                    title: 'Just in time installer',
                    width: 400
                }
            } as TaskModuleContinueResponse
        } as MessagingExtensionActionResponse;
    }
}
