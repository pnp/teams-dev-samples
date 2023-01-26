import { Activity, CardFactory, InputHints, MessageFactory, MessagingExtensionAction, MessagingExtensionActionResponse, TeamsActivityHandler, TurnContext } from "botbuilder";
import { Configuration, OpenAIApi } from "openai";
import * as ACData from "adaptivecards-templating";
import * as PromptCard from "../cards/prompt.json";
import * as ImagesCard from "../cards/image.json";

export class DalleBot extends TeamsActivityHandler {
    constructor() {
        super();
    }

    // Handle opening of message extension
    protected handleTeamsMessagingExtensionFetchTask(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        return Promise.resolve(this.generatePromptCardResponse());
    }

    // Handle submission of message extension
    protected async handleTeamsMessagingExtensionSubmitAction(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {

        const configuration = new Configuration({
            apiKey: process.env.OPENAI_API_KEY,
        });
        const openai = new OpenAIApi(configuration);

        const imageResponse = await openai.createImage({
            prompt: action.data.imageDescription,
            n: 1,
            size: "512x512",
        });

        // Create data for card
        const cardData = {
            imageLink: imageResponse.data.data[0].url,
            imageDescription: action.data.imageDescription
        }

        const template = new ACData.Template(ImagesCard);
        const cardPayload = template.expand({ $root: cardData });
        const card = CardFactory.adaptiveCard(cardPayload);
        const response: MessagingExtensionActionResponse = {
            composeExtension: {
                activityPreview: MessageFactory.attachment(card, null, null, InputHints.ExpectingInput) as Activity,
                type: 'botMessagePreview'
            }
        };

        return Promise.resolve(response);

    }

    // Handle editing of result
    protected async handleTeamsMessagingExtensionBotMessagePreviewEdit(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        return Promise.resolve(this.generatePromptCardResponse());
    }

    // Handle sending of result
    protected async handleTeamsMessagingExtensionBotMessagePreviewSend(context: TurnContext, action: MessagingExtensionAction): Promise<MessagingExtensionActionResponse> {
        const activityPreview = action.botActivityPreview[0];
        const responseActivity = {
            type: 'message',
            attachments: activityPreview.attachments,
            channelData: {
                onBehalfOf: [
                    {
                        itemId: 0,
                        mentionType: 'person',
                        mri: context.activity.from.id,
                        displayname: context.activity.from.name
                    }
                ]
            }
        };

        await context.sendActivity(responseActivity);

        return Promise.resolve({} as MessagingExtensionActionResponse);
    }

    // Helper to generate prompt card
    protected generatePromptCardResponse(): MessagingExtensionActionResponse {
        const card = CardFactory.adaptiveCard(PromptCard);
        const response: MessagingExtensionActionResponse = {
            task: {
                type: "continue",
                value: {
                    card,
                    title: "Generate image",
                    height: 150,
                    width: 512
                }
            }
        };

        return response;
    }

}