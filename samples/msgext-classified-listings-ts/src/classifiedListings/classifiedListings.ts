import { TABLE_NAME, ListingCity, ListingType, ListingItem } from './model';
import { TableClient, TableEntityResult } from "@azure/data-tables";
import config from "../config";
import pluralize from 'pluralize';

export async function searchClassifiedItems(itemName: string, type: string, location: string, price: string): Promise<ListingItem[]> {
    let result = await getAllClassifiedItems();

    // Filter products
    if (itemName) {
        var singularItemName = pluralize.singular(itemName);
        result = result.filter((p) => p.Title.toLowerCase().includes(singularItemName.toLowerCase()) || p.Description.toLowerCase().includes(singularItemName.toLowerCase()));
    }

    if (type) {
        result = result.filter((p) => p.TypeName.toLowerCase().includes(type.toLowerCase()));
    }

    if (location) {
        result = result.filter((p) => p.CityName.toLowerCase().includes(location.toLowerCase()));
    }

    if (price) {
        // price represented as string (for e.g., "1000-2000" or "1000-" or "-1000") and we need to split it if string contains "-"
        if (price.includes("-")) {
            const priceRange = price.split("-");
            if (priceRange[0] && priceRange[1]) {
                result = result.filter((p) => p.Price >= parseInt(priceRange[0]) && p.Price <= parseInt(priceRange[1]));
            }
            else if (priceRange[0]) {
                result = result.filter((p) => p.Price >= parseInt(priceRange[0]));
            }
            else if (priceRange[1]) {
                result = result.filter((p) => p.Price <= parseInt(priceRange[1]));
            }
        }
        else {
            // remove any characters from price string and convert it to number
            const priceValue = parseInt(price.replace(/\D/g, ''));
            result = result.filter((p) => p.Price <= priceValue);            
        }
    }

    return result;
}

interface ReferenceData<DataType> {
    [index: string]: DataType;
}

async function loadReferenceData<DataType>(tableName): Promise<ReferenceData<DataType>> {
    const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, tableName);
    const entities = tableClient.listEntities();

    let result = {};
    for await (const entity of entities) {
        result[entity.rowKey] = entity;
    }

    return result;
}

let cities: ReferenceData<ListingCity> = null;
let types: ReferenceData<ListingType> = null;

async function getAllClassifiedItems(): Promise<ListingItem[]> {
    // Ensure reference data are loaded
    cities = cities ?? await loadReferenceData<ListingCity>(config.tablePrefix + TABLE_NAME.LISTING_CITY);
    types = types ?? await loadReferenceData<ListingType>(config.tablePrefix + TABLE_NAME.LISTING_TYPE);

    // We always read the products fresh in case somebody made a change
    const result: ListingItem[] = [];
    const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, config.tablePrefix + TABLE_NAME.LISTING);

    const entities = tableClient.listEntities();

    for await (const entity of entities) {
        const p = getClassifiedItemForEntity(entity);
        result.push(p);
    }

    return result;
}

export async function getCityChoices(): Promise<{ title, value }[]> {
    cities = cities ?? await loadReferenceData<ListingCity>(config.tablePrefix + TABLE_NAME.LISTING_CITY);
    // convert cities to array of title and value as [{ "title": "Pune", "value": "1" }]
    return Object.keys(cities).map((key) => {
        return {
            title: cities[key].Name,
            value: key
        }
    });
}

export async function getTypeChoices(): Promise<{ title, value }[]> {
    types = types ?? await loadReferenceData<ListingType>(config.tablePrefix + TABLE_NAME.LISTING_TYPE);
    // convert types to array of title and value as [{ "title": "Buy", "value": "1" }]
    return Object.keys(types).map((key) => {
        return {
            title: types[key].Name,
            value: key
        }
    });
}

function getClassifiedItemForEntity(entity: TableEntityResult<Record<string, unknown>> | ListingItem): ListingItem {
    let result: ListingItem = {
        etag: entity.etag as string,
        partitionKey: entity.partitionKey as string,
        rowKey: entity.rowKey as string,
        timestamp: new Date(entity.timestamp),
        Title: entity.Title as string,
        Description: entity.Description as string,
        CityID: entity.CityID as string,
        CityName: "",
        OwnerID: entity.OwnerID as string,
        OwnerName: entity.OwnerName as string,
        Price: entity.Price as number,
        TypeID: entity.TypeID as string,
        TypeName: ""
    }

    // Fill in extended properties
    result.CityName = cities[result.CityID].Name;
    result.TypeName = types[result.TypeID].Name;

    return result;
}

export async function addClassifiedItem(item: ListingItem): Promise<ListingItem> {
    const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, config.tablePrefix + TABLE_NAME.LISTING);
    await tableClient.createEntity(item);
    return getClassifiedItemForEntity(item);
}

export async function deleteClassifiedItem(listingId: string): Promise<void> {
    const tableClient = TableClient.fromConnectionString(config.storageAccountConnectionString, config.tablePrefix + TABLE_NAME.LISTING);
    await tableClient.deleteEntity("Listing", listingId);
}