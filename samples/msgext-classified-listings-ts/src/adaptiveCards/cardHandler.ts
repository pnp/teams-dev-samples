import { TurnContext, CardFactory } from "botbuilder";
import { ListingItem } from '../classifiedListings/model';
import editCard from './editCard.json';
import successCard from './successCard.json';
import * as ACData from "adaptivecards-templating";
import { addClassifiedItem, deleteClassifiedItem } from "../classifiedListings/classifiedListings";
import { CreateActionErrorResponse, CreateAdaptiveCardInvokeResponse } from "./utils";
import { time } from "console";

function getEditCard(listingItem: ListingItem, cityChoices: { title, value }[], typeChoices: { title, value }[]): any {
    var template = new ACData.Template(editCard);
    var card = template.expand({
        $root: {
            title: listingItem.Title,
            description: listingItem.Description,
            price: listingItem.Price,
            cityId: listingItem.CityID,
            cityName: listingItem.CityName,
            ownerId: listingItem.OwnerID,
            ownerName: listingItem.OwnerName,
            typeId: listingItem.TypeID,
            typeName: listingItem.TypeName,
            listingId: listingItem.rowKey,
            timestamp: listingItem.timestamp,
            cityChoices: cityChoices,
            typeChoices: typeChoices
        }
    });

    return CardFactory.adaptiveCard(card);
}

async function handleTeamsCardAddClassifiedItem(context: TurnContext) {
    const request = context.activity.value;
    const data = request.action.data;
    console.log(`🎬 Adding classified item, title=${data.txtTitle} description=${data.txtDescription} price=${data.txtPrice} city=${data.txtCity} type=${data.txtType}`);

    if (data.txtTitle && data.txtDescription && data.txtPrice && data.txtCity && data.txtType) {
        const entity: ListingItem = {
            partitionKey: "Listing",
            rowKey: context.activity.id,
            Title: data.txtTitle,
            Description: data.txtDescription,
            CityID: data.txtCity,
            OwnerID: context.activity.from.aadObjectId,
            OwnerName: context.activity.from.name,
            Price: data.txtPrice,
            TypeID: data.txtType
        };

        const newItem: ListingItem = await addClassifiedItem(entity);

        var template = new ACData.Template(successCard);
        var card = template.expand({
            $root: {
                message: `Classified item ${newItem.Title} added successfully`,
                title: newItem.Title,
                ownerName: newItem.OwnerName,
                typeName: newItem.TypeName,
                price: newItem.Price,
                cityName: newItem.CityName,
                timestamp: newItem.timestamp,
                description: newItem.Description
            }
        });

        return CreateAdaptiveCardInvokeResponse(200, card);
    }
    else {
        return CreateActionErrorResponse(400, 0, "Invalid request");
    }
}

async function handleTeamsCardDeleteClassifiedItem(context: TurnContext) {
    const request = context.activity.value;
    const data = request.action.data;
    console.log(`🎬 Deleting classified item, listingId=${data.listingId} title=${data.txtTitle} description=${data.txtDescription} price=${data.txtPrice} city=${data.txtCity} type=${data.txtType}`);

    if (data.listingId) {
        await deleteClassifiedItem(data.listingId);

        var template = new ACData.Template(successCard);
        var card = template.expand({
            $root: {
                message: `Classified item ${data.txtTitle} deleted successfully`,
                title: data.txtTitle,
                ownerName: data.ownerName,
                typeName: data.typeName,
                price: data.price,
                cityName: data.cityName,
                timestamp: data.timestamp,
                description: data.description
            }
        });

        return CreateAdaptiveCardInvokeResponse(200, card);
    }
    else {
        return CreateActionErrorResponse(400, 0, "Invalid request");
    }
}

export default { getEditCard, handleTeamsCardAddClassifiedItem, handleTeamsCardDeleteClassifiedItem }
