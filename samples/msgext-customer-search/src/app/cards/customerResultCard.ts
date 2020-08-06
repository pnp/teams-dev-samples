import { ICustomer } from '../model/ICustomer';
import { Attachment, CardFactory } from "botbuilder";

import { ServiceFactory } from "../services/serviceFactory";

export class CustomerResultCard {

    public static async getCard(customer: ICustomer): Promise<Attachment> {

        // Get card text
        const address = customer.Address ? customer.Address : "";
        const city = `${customer.City}, ${customer.Region ? customer.Region : ""} ${customer.Country}`;
        const details1 = customer.ContactName && customer.ContactTitle ?
            `Contact: ${customer.ContactName}, ${customer.ContactTitle}` : "";
        const details2 = customer.Phone ? `Phone: ${customer.Phone}` : "";
        const details3 = customer.Fax ? `Fax: ${customer.Fax}` : "";

        // Get map
        const mapService = ServiceFactory.getMapService();
        let mapUrl = `https://${process.env.HOSTNAME}/assets/northwindLogoSmall.png`;
        if (customer.Address && customer.City && customer.Region && customer.PostalCode) {
            mapUrl = await mapService.getMapImageUrl(
                customer.Address, customer.City, customer.Region, "usa", customer.PostalCode
            );
        }

        return CardFactory.adaptiveCard(
            {
                type: "AdaptiveCard",
                body: [
                    {
                        type: "ColumnSet",
                        columns: [
                            {
                                type: "Column",
                                width: "auto",
                                items: [
                                    {
                                        type: "TextBlock",
                                        size: "Large",
                                        text: customer.CompanyName
                                    },
                                    {
                                        type: "TextBlock",
                                        text: address
                                    },
                                    {
                                        type: "TextBlock",
                                        text: city
                                    },
                                ]
                            },
                            {
                                type: "Column",
                                width: "stretch",
                                items: [
                                    {
                                        type: "Image",
                                        url: mapUrl
                                    }
                                ]
                            }
                        ]
                    }
                ],
                actions: [
                    {
                        "type": "Action.ShowCard",
                        "title": "Details",
                        "card": {
                            "type": "AdaptiveCard",
                            "body": [
                                {
                                    "type": "TextBlock",
                                    "text": details1
                                },
                                {
                                    "type": "TextBlock",
                                    "text": details2
                                },
                                {
                                    "type": "TextBlock",
                                    "text": details3
                                }
                            ]
                        }
                    },
                    {
                        "type": "Action.OpenUrl",
                        "title": "Open",
                        "url": "https://pnp.github.io/"
                    }
                ],
                $schema: "http://adaptivecards.io/schemas/adaptive-card.json",
                version: "1.0"
            }
        );
    }
}


