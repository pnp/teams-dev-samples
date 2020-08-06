import { ICustomer } from "../../model/ICustomer";
import { INorthwindService } from "./INorthwindService";

export class NorthwindServiceMock implements INorthwindService {

    getCustomersByName(nameQuery: string): Promise<ICustomer[]> {

        const mockData: ICustomer[] =
        [
            {
                "CustomerID": "GALED",
                "CompanyName": "Galería del gastrónomo",
                "ContactName": "Eduardo Saavedra",
                "ContactTitle": "Marketing Manager",
                "Address": "Rambla de Cataluña, 23",
                "City": "Barcelona",
                "Region": null,
                "PostalCode": "08022",
                "Country": "Spain",
                "Phone": "(93) 203 4560",
                "Fax": "(93) 203 4561"
            },
            {
                "CustomerID": "GODOS",
                "CompanyName": "Godos Cocina Típica",
                "ContactName": "José Pedro Freyre",
                "ContactTitle": "Sales Manager",
                "Address": "C/ Romero, 33",
                "City": "Sevilla",
                "Region": null,
                "PostalCode": "41101",
                "Country": "Spain",
                "Phone": "(95) 555 82 82",
                "Fax": null
            },
            {
                "CustomerID": "GOURL",
                "CompanyName": "Gourmet Lanchonetes",
                "ContactName": "André Fonseca",
                "ContactTitle": "Sales Associate",
                "Address": "Av. Brasil, 442",
                "City": "Campinas",
                "Region": "SP",
                "PostalCode": "04876-786",
                "Country": "Brazil",
                "Phone": "(11) 555-9482",
                "Fax": null
            },
            {
                "CustomerID": "GREAL",
                "CompanyName": "Great Lakes Food Market",
                "ContactName": "Howard Snyder",
                "ContactTitle": "Marketing Manager",
                "Address": "2732 Baker Blvd.",
                "City": "Eugene",
                "Region": "OR",
                "PostalCode": "97403",
                "Country": "USA",
                "Phone": "(503) 555-7555",
                "Fax": null
            },
            {
                "CustomerID": "GROSR",
                "CompanyName": "GROSELLA-Restaurante",
                "ContactName": "Manuel Pereira",
                "ContactTitle": "Owner",
                "Address": "5ª Ave. Los Palos Grandes",
                "City": "Caracas",
                "Region": "DF",
                "PostalCode": "1081",
                "Country": "Venezuela",
                "Phone": "(2) 283-2951",
                "Fax": "(2) 283-3397"
            }
        ];

        return new Promise<ICustomer[]>((resolve) => {
            resolve (mockData);
        });
        
    }
}



