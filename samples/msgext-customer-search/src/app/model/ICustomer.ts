// Response from Northwind customer query
export interface ICustomerResponse {
    value: ICustomer[];
}

export interface ICustomer {
    CustomerID: string;
    CompanyName: string;
    ContactName: string | null;
    ContactTitle: string | null;
    Address: string | null;
    City: string | null;
    Region: string | null;
    PostalCode: string | null;
    Country: string | null;
    Phone: string | null;
    Fax: string | null;
}


