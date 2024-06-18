import {
    CardFactory,
    TurnContext,
    MessagingExtensionQuery,
    MessagingExtensionResponse,
} from "botbuilder";
import { searchClassifiedItems, getCityChoices, getTypeChoices } from "../classifiedListings/classifiedListings";
import cardHandler from "../adaptiveCards/cardHandler";

const COMMAND_ID = "classifiedListingSearch";

let queryCount = 0;
async function handleTeamsMessagingExtensionQuery(
    context: TurnContext,
    query: MessagingExtensionQuery
): Promise<MessagingExtensionResponse> {
    let itemName, type, location, price;

    if (query.parameters.length === 1 && query.parameters[0]?.name === "itemName") {
        [itemName, type, location, price] = (query.parameters[0]?.value.split(','));
    }
    else {
        itemName = cleanupParam(query.parameters.find((element) => element.name === "itemName")?.value);
        type = cleanupParam(query.parameters.find((element) => element.name === "type")?.value);
        location = cleanupParam(query.parameters.find((element) => element.name === "location")?.value);
        price = cleanupParam(query.parameters.find((element) => element.name === "price")?.value);
    }

    console.log(`🔎 Query #${++queryCount}:\nitemName=${itemName}, type=${type}, location=${location}, price=${price}`);

    const classifiedItems = await searchClassifiedItems(itemName, type, location, price);
    console.log(`Found ${classifiedItems.length} classified items`);

    const cityChoices = await getCityChoices();
    const typeChoices = await getTypeChoices();    

    const attachments = [];
    classifiedItems.forEach((classifiedItem) => {
        const preview = CardFactory.heroCard(classifiedItem.Title,
            `Posted by ${classifiedItem.OwnerName} in ${classifiedItem.CityName} <br />With price of ${classifiedItem.Price} for ${classifiedItem.TypeName}`);

        const resultCard = cardHandler.getEditCard(classifiedItem, cityChoices, typeChoices);
        const attachment = { ...resultCard, preview };
        attachments.push(attachment);
    });

    return {
        composeExtension: {
            type: "result",
            attachmentLayout: "list",
            attachments: attachments,
        },
    };
}

function cleanupParam(value: string): string {
    if (!value) {
        return "";
    }
    else {
        let result = value.trim();
        result = result.split(',')[0];          // Remove extra data
        result = result.replace("*", "");       // Remove wildcard characters from Copilot
        return result;
    }
}

export default { COMMAND_ID, handleTeamsMessagingExtensionQuery }