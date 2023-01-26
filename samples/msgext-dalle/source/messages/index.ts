import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { Response } from "botbuilder";
import { DalleBot } from "../modules/Bot";
import { BotAdapterInstance } from "../modules/BotAdapter";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    context.suppressAsyncDoneError = true;

    // Create bot
    const bot = new DalleBot();

    // Process request
    const botAdapterInstance = BotAdapterInstance.getInstance();
    await botAdapterInstance.adapter.process(req, context.res as Response, (context) => bot.run(context));

};

export default httpTrigger;