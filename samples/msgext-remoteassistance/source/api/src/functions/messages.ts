import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { Bot } from "../modules/Bot";
import { BotAdapterInstance } from "../modules/BotAdapter";
import { RequestWrapper, ResponseWrapper } from "../modules/FunctionsWrapper";

export async function messages(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    // Create bot activity handler
    const bot = new Bot();
    const response: HttpResponseInit = {};

    // Process request
    const req = new RequestWrapper(request);
    await req.readBodyAsync();
    const res = new ResponseWrapper(response);
    const botAdapterInstance = BotAdapterInstance.getInstance();
    botAdapterInstance.adapter.onTurnError = async (turnContext, error) => {
        console.error(`\n [onTurnError] unhandled error: ${error}`);
    };
    await botAdapterInstance.adapter.process(req, res, (context) => bot.run(context));

    // Send response
    return response;
};

app.http('messages', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: messages
});
