import { ActivityHandler, CardFactory, MessageFactory, TurnContext } from "botbuilder";
import * as ACData from "adaptivecards-templating";
import * as AnswerCard from "../cards/Answer.json";
import * as WelcomeCard from "../cards/WelcomeCard.json";
import { Configuration, OpenAIApi } from "openai";

export class OpenAiBot extends ActivityHandler {
    constructor() {
        super();

        this.onMessage(async (context, next) => {

            const configuration = new Configuration({
                apiKey: process.env.OPENAI_API_KEY,
            });
            const openai = new OpenAIApi(configuration);

            const completion = await openai.createCompletion({
                prompt: context.activity.text,
                model: process.env.OPENAI_MODEL,
                max_tokens: 200,
            });

            // Create data for card
            const cardData = {
                answer: completion.data.choices[0].text
            }

            const template = new ACData.Template(AnswerCard);
            const cardPayload = template.expand({ $root: cardData });
            const card = CardFactory.adaptiveCard(cardPayload);

            await context.sendActivity(MessageFactory.attachment(card));
            await next();
        });

        this.onMembersAdded(async (context, next) => {
            const membersAdded = context.activity.membersAdded;
            const card = CardFactory.adaptiveCard(WelcomeCard);
            for (const member of membersAdded) {
                if (member.id !== context.activity.recipient.id) {
                    await context.sendActivity(MessageFactory.attachment(card));
                }
            }
            await next();
        });
    }
}