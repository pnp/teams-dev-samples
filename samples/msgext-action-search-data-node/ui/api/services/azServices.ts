import { AzureNamedKeyCredential, TableClient, odata } from "@azure/data-tables";
import IProduct from "../Model/IProduct";

const getTableClient = (): TableClient  => {
  const tableName: string = process.env.AZURE_TABLE_NAME!;
  const accountName: string = process.env.AZURE_TABLE_ACCOUNTNAME!;
  const storageAccountKey: string = process.env.AZURE_TABLE_ACCOUNT_KEY!;
  const storageUrl = `https://${accountName}.table.core.windows.net/`;
  const tableClient = new TableClient(storageUrl, tableName, new AzureNamedKeyCredential(accountName, storageAccountKey));
  return tableClient;
}

export async function getOrders(category: string) {
  const tableClient = getTableClient();
  const products: IProduct[] = [];
  let productEntities: any;
  if (category === '' || category === 'All') {
    productEntities = await tableClient.listEntities<IProduct>();
  }
  else {
    productEntities = await tableClient.listEntities<IProduct>({
      queryOptions: { filter: odata`Category eq ${category}` }
    });
  }
  let i = 1;
  for await (const p of productEntities) {
    const product = {
      Id: p.partitionKey,
      Name: p.rowKey,
      Orders: p.Orders as number,
      Category: p.Category as string
    }
    products.push(product);      
    i++;
  }
  return products;
}
