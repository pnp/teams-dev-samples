import { AzureFunction, Context, HttpRequest } from "@azure/functions"
import { StockPirceBotActivityHandler } from "../modules/Bot";
import { BotAdapterInstance } from "../modules/BotAdapter";
import { ResponseWrapper } from "../modules/ResponseWrapper";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {

    // Create bot activity handler
    const bot = new StockPirceBotActivityHandler();

    // Process request
    const res = new ResponseWrapper(context.res);
    const botAdapterInstance = BotAdapterInstance.getInstance();
    await botAdapterInstance.adapter.process(req, res, (context) => bot.run(context));

    // Send response
    return res.body;
};

export default httpTrigger;