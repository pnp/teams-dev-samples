export const TABLE_NAME = {
    LISTING: "Listing",
    LISTING_CITY: "ListingCity",
    LISTING_TYPE: "ListingType"
}

interface Row {
    etag?: string;
    partitionKey: string;
    rowKey: string;
    timestamp?: Date;
}

export interface ListingCity extends Row {
    Name: string;
}

export interface ListingType extends Row {
    Name: string;
}

export interface ListingItem extends Row {
    Title: string;
    Description: string;
    Price: number;
    CityID: string;
    CityName?: string;
    OwnerID: string;
    OwnerName: string;
    TypeID: string;
    TypeName?: string;
}
