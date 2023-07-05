import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Response } from "botbuilder";
import { TfLStatusBot } from "../modules/Bot";
import { BotAdapterInstance } from "../modules/BotAdapter";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // Create bot
    const bot = new TfLStatusBot();

    // Process request
    const botAdapterInstance = BotAdapterInstance.getInstance();
    return await botAdapterInstance.adapter.process(req, context.res as Response, (context) => bot.run(context));
};

export default httpTrigger;