import * as debug from "debug";
import { PreventIframe } from "express-msteams-host";
import { TurnContext, CardFactory, MessagingExtensionQuery, MessagingExtensionResult, MessagingExtensionAction, ActionTypes, MessagingExtensionAttachment } from "botbuilder";
// import { MessagingExtensionQuery, MessagingExtensionResult } from "botbuilder-teams";
import { IMessagingExtensionMiddlewareProcessor } from "botbuilder-teams-messagingextensions";
import { JsonDB } from 'node-json-db';
import { IDocument } from "../../model/IDocument";
import GraphController from "../../controller/GraphController";

// Initialize debug logging module
const log = debug("msteams");

@PreventIframe("/documentReviewMessageMessageExtension/config.html")
export default class DocumentReviewMessageMessageExtension implements IMessagingExtensionMiddlewareProcessor {
    private connectionName = process.env.ConnectionName;
    private documents: IDocument[];
    public async onQuery(context: TurnContext, query: MessagingExtensionQuery): Promise<MessagingExtensionResult> {
        const attachments: MessagingExtensionAttachment[] = [];
        const adapter: any = context.adapter;
        const magicCode = (query.state && Number.isInteger(Number(query.state))) ? query.state : '';        
        const tokenResponse = await adapter.getUserToken(context, this.connectionName, magicCode);
        if (!tokenResponse || !tokenResponse.token) {
            // There is no token, so the user has not signed in yet.

            // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
            const signInLink = await adapter.getSignInLink(context, this.connectionName);
            let composeExtension: MessagingExtensionResult = {
                type: 'config',
                suggestedActions: {
                    actions: [{
                        title: 'Sign in as user',
                        value: signInLink,
                        type: ActionTypes.OpenUrl
                    }]
                }
            };
            return Promise.resolve(composeExtension);
        }
        let documents: IDocument[] = [];
        
        if (query.parameters && query.parameters[0] && query.parameters[0].name === "initialRun") {
            const controller = new GraphController();
            const configFilename = process.env.CONFIG_FILENAME;
            const settings = new JsonDB(configFilename ? configFilename : "settings", true, false);
            let siteID: string;
            let listID: string;
            try {
                siteID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/siteID`);
                listID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/listID`);
            } catch (err) {
                siteID = process.env.SITE_ID ? process.env.SITE_ID : '';
                listID = process.env.LIST_ID ? process.env.LIST_ID : '';
            }            
            documents = await controller.getFiles(tokenResponse.token, siteID, listID);
            this.documents = documents;
        }
        else {
            if (query.parameters && query.parameters[0]) {
                const srchStr = query.parameters[0].value;
                documents = this.documents.filter(doc => 
                    doc.name.indexOf(srchStr) > -1 ||
                    doc.description.indexOf(srchStr) > -1 ||
                    doc.author.indexOf(srchStr) > -1 ||
                    doc.url.indexOf(srchStr) > -1 ||
                    doc.modified.toLocaleString().indexOf(srchStr) > -1 
                );
            }            
        }
        documents.forEach((doc) => {
            const today = new Date();
            const nextReview = new Date(today.setDate(today.getDate() + 180));
            const minNextReview = new Date(today.setDate(today.getDate() + 30));
            const card = CardFactory.adaptiveCard(
                {
                    type: "AdaptiveCard",
                    body: [
                        {
                            type: "ColumnSet",
                            columns: [
                                {
                                    type: "Column",
                                    width: 25,
                                    items: [
                                        {
                                            type: "Image",
                                            url: `https://${process.env.HOSTNAME}/assets/icon.png`,
                                            style: "Person"
                                        }
                                    ]
                                },
                                {
                                    type: "Column",
                                    width: 75,
                                    items: [
                                        {
                                            type: "TextBlock",
                                            text: doc.name,
                                            size: "Large",
                                            weight: "Bolder"
                                        },
                                        {
                                            type: "TextBlock",
                                            text: doc.description,
                                            size: "Medium"
                                        },
                                        {
                                            type: "TextBlock",
                                            text: `Author: ${doc.author}`
                                        },
                                        {
                                            type: "TextBlock",
                                            text: `Modified: ${doc.modified.toLocaleDateString()}`
                                        }
                                    ]
                                }
                            ]
                        }                     
                    ],
                    actions: [
                        {
                            type: "Action.OpenUrl",
                            title: "View",
                            url: doc.url
                        },
                        {
                            type: "Action.ShowCard",
                            title: "Review",
                            card: {
                                type: "AdaptiveCard",
                                body: [
                                    {
                                        type: "Input.Text",
                                        isVisible: false,
                                        value: doc.id,
                                        id: "id"
                                    },
                                    {
                                        type: "Input.Text",
                                        isVisible: false,
                                        value: "reviewed",
                                        id: "action"
                                    },
                                    {
                                        type: "Input.Date",
                                        id: "nextReview",
                                        value: nextReview.toLocaleDateString(),
                                        min: minNextReview.toLocaleDateString(),
                                        spacing: "Medium"
                                    }
                                ],
                                actions: [
                                    {
                                        type: "Action.Submit",
                                        title: "Reviewed"
                                        
                                    }
                                ],
                                "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
                                version: "1.0"
                            }
                        }                        
                    ],
                    $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                    version: "1.0"
                });            
            const preview = {
                contentType: "application/vnd.microsoft.card.thumbnail",
                content: {
                    title: doc.name,
                    text: doc.description,
                    images: [
                        {
                            url: `https://${process.env.HOSTNAME}/assets/icon.png`
                        }
                    ]
                 
                }
            };
            attachments.push({ contentType: card.contentType, content: card.content, preview: preview });
        });
        
        return Promise.resolve({
            type: "result",
            attachmentLayout: "list",
            attachments: attachments
        } as MessagingExtensionResult);        
    }
    
    public async onCardButtonClicked(context: TurnContext, value: any): Promise<void> {
        const adapter: any = context.adapter;
        const magicCode = (value.state && Number.isInteger(Number(value.state))) ? value.state : '';        
        const tokenResponse = await adapter.getUserToken(context, this.connectionName, magicCode);

        if (!tokenResponse || !tokenResponse.token) {
            // There is no token, so the user has not signed in yet.            
            return Promise.reject();
        }
        // Handle the Action.Submit action on the adaptive card
        if (value.action === "reviewed") {
            const controller = new GraphController();
            const siteID: string = process.env.SITE_ID ? process.env.SITE_ID : '';
            const listID: string = process.env.LIST_ID ? process.env.LIST_ID : '';
            let nextReview: Date;
            if (value.nextReview === null || value.nextReview === '') {
                const today = new Date();
                nextReview = new Date(today.setDate(today.getDate() + 180));
            }
            else {
                nextReview = new Date(value.nextReview);
            }
            controller.updateItem(tokenResponse.token, siteID, listID, value.id, nextReview.toString())
            // For testing purposes sign out again
            .then(() => {
                adapter.signOutUser(context, this.connectionName);
            });
        }    
        return Promise.resolve();
    }

    // this is used when canUpdateConfiguration is set to true
    public async onQuerySettingsUrl(context: TurnContext): Promise<{ title: string, value: string }> {
        const configFilename = process.env.CONFIG_FILENAME;
        const settings = new JsonDB(configFilename ? configFilename : "settings", true, false);
        let siteID: string;
        let listID: string;
        try {
            siteID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/siteID`);
            listID = settings.getData(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}/listID`);
        } 
        catch (err) 
        {
            siteID = process.env.SITE_ID ? process.env.SITE_ID : '';
            listID = process.env.LIST_ID ? process.env.LIST_ID : '';
        }   
        return Promise.resolve({
            title: "Document Review Message Configuration",
            value: `https://${process.env.HOSTNAME}/documentReviewMessageMessageExtension/config.html?siteID=${siteID}&listID=${listID}`
        });
    }

    public async onSettings(context: TurnContext): Promise<void> {
        // take care of the setting returned from the dialog, with the value stored in state
        const setting = JSON.parse(context.activity.value.state);
        log(`New setting: ${setting}`);
        const configFilename = process.env.CONFIG_FILENAME;
        const settings = new JsonDB(configFilename ? configFilename : "settings", true, false);
        settings.push(`/${context.activity.channelData.tenant.id}/${context.activity.channelData.team.id}/${context.activity.channelData.channel.id}`, setting, false);
        return Promise.resolve();
    }

}
