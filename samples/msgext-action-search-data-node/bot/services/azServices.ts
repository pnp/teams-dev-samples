import { AzureNamedKeyCredential, TableClient } from "@azure/data-tables";
import IProduct from "../Model/IProduct";

const getTableClient = (): TableClient  => {
  const accountName: string = process.env.AZURE_TABLE_ACCOUNTNAME!;
  const storageAccountKey: string = process.env.AZURE_TABLE_KEY!;
  const storageUrl = `https://${accountName}.table.core.windows.net/`;
  const tableClient = new TableClient(storageUrl, "Products2", new AzureNamedKeyCredential(accountName, storageAccountKey));
  return tableClient;
}

export async function updateOrders(data: Record<string, unknown>) {
  const tableClient = getTableClient();
  const prodId = new String(data.Id ?? "");
  const prodName = new String(data.Name ?? "");
  const prodCategory = new String(data.Category ?? "");
  const prodOrders: Number = new Number(data.Orders ?? 0);
  const prodAddOrders1: Number = new Number(data.orderId ?? 0);
  const prodAddOrders2: Number = new Number(data.orderId2 ?? 0);
  const prodAddOrders3: Number = new Number(data.orderId3 ?? 0);
  const prodAddOrders4: Number = new Number(data.orderId4 ?? 0);
  const prodAddOrders5: Number = new Number(data.orderId5 ?? 0);
  const newProduductOders = prodOrders.valueOf() + 
                            prodAddOrders1.valueOf() + 
                            prodAddOrders2.valueOf() +
                            prodAddOrders3.valueOf() +
                            prodAddOrders4.valueOf() +
                            prodAddOrders5.valueOf();
  const tableEntity = 
  {
    partitionKey: prodId.toString(),
    rowKey: prodName.toString(),
    Orders: newProduductOders
  };
  await tableClient.upsertEntity(tableEntity);

  const returnProduct: IProduct = { Id: prodId.toString(), Name: prodName.toString(), Orders: newProduductOders, Category: prodCategory.toString()};

  return returnProduct
}

exports.updateOrders = updateOrders;