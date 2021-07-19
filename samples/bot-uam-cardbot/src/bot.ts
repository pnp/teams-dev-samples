// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import { ActivityHandler, MessageFactory, CardFactory, InvokeResponse, TurnContext, InvokeException, StatusCodes } from 'botbuilder';
import * as ACData from "adaptivecards-templating";
import * as cardOnefile from "./cards/cardOne.json";
import * as cardTwofile from "./cards/cardTwo.json";
const CONVERSATION_DATA_PROPERTY = 'conversationData';

export class EchoBot extends ActivityHandler {   
    conversationState;
    conversationDataAccessor;
    constructor(conversationState) {
        super();
        // Create conversation object
        this.conversationState = conversationState;
        //Conversation data accessor
        this.conversationDataAccessor = conversationState.createProperty(CONVERSATION_DATA_PROPERTY);

        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {          
            //empty access for conversation data
            const conversationData:cardBotData = await this.conversationDataAccessor.get(context,{});
            //initial card or the base card   
            const template = new ACData.Template(cardOnefile);           
            //save the initiator id as the person who called the Bot          
            conversationData.initiator = context.activity.from.id;
            //count of how many clicks (to calculate the number of clicks the card got)
            conversationData.clickCount = 0;
           //remove the bot at mentioned from the activity message
            const updatedText = TurnContext.removeRecipientMention(context.activity);
            conversationData.question=updatedText;
            conversationData.users = [context.activity.from.id];
            conversationData.response=[];
            //set the conversation data   
            await this.conversationDataAccessor.set(context, conversationData);

            const cardPayload = template.expand({ $root: { question:conversationData.question,userIds: [context.activity.from.id] } });
            const cardOne = CardFactory.adaptiveCard(cardPayload);
            cardOne.content.subtitle = "";
            const card = {
                contentType: cardOne.contentType,
                content: cardOne.content
                
            };
            await context.sendActivity({ attachments: [card] });            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const welcomeText = 'Hello and welcome!';
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.text(welcomeText, welcomeText));
                }
            }
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }
    //UAM onInvokeActivity overriden
    async onInvokeActivity(context: TurnContext):Promise<InvokeResponse> {
        try {
            let responseBody = {}
            let payload={};   
            if(context.activity.name==="adaptiveCard/action"){
             
                const request = context.activity.value;            
                if (request) {
                const conversationData:cardBotData = await this.conversationDataAccessor.get(context,{}); 
                let clickCount = conversationData.clickCount || 0; 
                    switch (request.action.verb) {
                        case 'ok': {
                            //on button click , count the number of click and store it in conversation data
                            conversationData.clickCount = ++clickCount;
                            conversationData.users.push(context.activity.from.id);
                            conversationData.response.push({name:context.activity.from.name,text:request.action.data.text});
                            await this.conversationDataAccessor.set(context, conversationData);
                            payload = await this.processSend(conversationData);                       
                            const cardOne = CardFactory.adaptiveCard(payload);
                            const card = {
                              contentType: cardOne.contentType,
                              content: cardOne.content
                          };
                        //message edits to refresh all users cards
                        const message =MessageFactory.attachment(card);                      
                        message.id = context.activity.replyToId;
                        await context.updateActivity(message);
                        break;    
                        }               
                        case 'refresh': {
                             payload = await this.processRefresh(context.activity.from.id,conversationData);
                            break;                        
                        }      
                        default:
                         throw new InvokeException(StatusCodes.NOT_IMPLEMENTED);
                    }
                    responseBody= { statusCode: 200, type: "application/vnd.microsoft.card.adaptive", value: payload }
                    return this.createInvokeResponse(responseBody);    
                }
            }
           

        } catch (err) {

            throw err;
        } finally {
            this.defaultNextEvent(context)();
        }
    }

    createInvokeResponse(body?: {}): InvokeResponse {
        return { status: 200, body };
    }
    //send the base card
    async processSend(conversationData:cardBotData) {
        const template = new ACData.Template(cardOnefile);        
        return template.expand({ $root: { question:conversationData.question,userIds: conversationData.users } });
    }
    //process refresh of cards based on the userIds array
    async processRefresh(userId:string, conversationData:cardBotData) {      
        let  template;          
        //initiator 
        if(conversationData.initiator===userId)   {
         var payload=this.generateDynamicAdaptiveCard(conversationData.response)
         template = new ACData.Template(payload);
         return template.expand({ $root: {question:conversationData.question,click: conversationData.clickCount||0, userIds:conversationData.users } });
           
        } //already responded  
        else if (conversationData.users.indexOf(userId)>-1&&conversationData.initiator!==userId){
            template = new ACData.Template(cardTwofile);
            return template.expand({ $root: { question:conversationData.question, userIds: conversationData.users } });
         }          
    }
    
    async run(context) {
        await super.run(context);
        // Save any state changes. The load happened during the execution of the Dialog.
        await this.conversationState.saveChanges(context, false);

    }
    //generate card with responses from mates
    generateDynamicAdaptiveCard(response:cardResponse[]) {       
        var body = [  {
            "type": "TextBlock",
            "text": "Hi initiator, ${click} team mates responded to your question : ' ${question} ' 💥",
            "wrap": true,
            "color": "Accent"
          }  ];
            response.forEach(item => {
                body.push({
                    "type": "TextBlock",
                    "text":item.name+" says '"+item.text+"'",
                    "wrap": true,
                    "color": "good"
                }  );
            });            
    
        var card = {
            "type": "AdaptiveCard",   
            body,
            "$schema": "http://adaptivecards.io/schemas/adaptive-card.json",
            "version": "1.4",
            "refresh": {
              "userIds": "${userIds}",
              "action": {
                "type": "Action.Execute",
                "verb": "refresh",
                "title": "Refresh",
                "data": {
                  "cardId": "${cardId}"
                }
              }
            }
          }   
        return card;
    }
}
interface cardBotData {
    initiator: string;
    clickCount:number;
    question:string;
    users:string[];
    response:cardResponse[];
  }
  interface cardResponse{
      name:string;
      text:string;
  }


