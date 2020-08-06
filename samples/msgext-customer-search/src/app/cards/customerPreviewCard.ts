import { ICustomer } from '../model/ICustomer'; ''

interface IThumbnailCard {
    contentType: string;
    content: {
        title: string;
        text: string;
        images: {
            url: string;
        }[]
    }
}

export class CustomerPreviewCard {

    public static getCard(customer: ICustomer): IThumbnailCard {

        const address = `${customer.Address}, ${customer.City}, ${customer.Region ? customer.Region :""} ${customer.Country}`;

        return {
            contentType: "application/vnd.microsoft.card.thumbnail",
            content: {
                title: customer.CompanyName,
                text: address,
                images: [
                    {
                        url: `https://${process.env.HOSTNAME}/assets/northwindLogoSmall.png`
                    }
                ]
            }
        };
    }
}