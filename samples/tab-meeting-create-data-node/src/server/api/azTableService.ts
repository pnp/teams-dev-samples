import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import { ICustomer } from "../../model/ICustomer";

export const getCustomer = async (customerID: string, meetingID: string): Promise<ICustomer> => {
    const tableClient = getAZTableClient();
    const customerEntity = await tableClient.getEntity(meetingID, customerID);  
    const customer = {
        Name: customerEntity.Name as string,
        Email: customerEntity.Email as string,
        Phone: customerEntity.Phone as string,
        Id: customerEntity.rowKey as string
    };
    return customer;
}

export const getAZTableClient = (): TableClient => {
    const accountName: string = process.env.AZURE_TABLE_ACCOUNTNAME!;
    const storageAccountKey: string = process.env.AZURE_TABLE_KEY!;
    const storageUrl = `https://${accountName}.table.core.windows.net/`;
    const tableClient = new TableClient(storageUrl, "Customer", new AzureNamedKeyCredential(accountName, storageAccountKey));
    return tableClient;
}