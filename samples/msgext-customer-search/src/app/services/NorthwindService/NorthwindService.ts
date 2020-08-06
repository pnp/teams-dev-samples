import { ICustomerResponse, ICustomer } from "../../model/ICustomer";
import { INorthwindService } from "./INorthwindService";

export class NorthwindService implements INorthwindService {

    async getCustomersByName(nameQuery: string): Promise<ICustomer[]> {

        const serviceUrl = nameQuery ?
            // Filter by name
            `https://services.odata.org/Northwind/Northwind.svc/Customers?$format=json&$top=20&$filter=startswith(CompanyName, '${nameQuery}')` :
            // Query was blank, return all records
            `https://services.odata.org/Northwind/Northwind.svc/Customers?$format=json&$top=20`;
        let result : ICustomer[] = [];
        const response = await fetch (serviceUrl, {
            method: 'GET',
            headers: {"accept": "application/json"}
        });
        if (response.ok) {
            const responseJson: ICustomerResponse = await response.json();
            result = responseJson.value;
        }

        return result;
    }
}



