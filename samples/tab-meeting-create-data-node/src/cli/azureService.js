require("dotenv").config();
const azure = require('@azure/identity');
const appConfigClient = require('@azure/app-configuration');
const { TableClient, AzureNamedKeyCredential } = require("@azure/data-tables");

async function saveAppConfig (meetingID, newConfig) {
    const client = getAppConfigClient();
    if (newConfig.Name) {
      await client.setConfigurationSetting({ key: `TEAMSMEETINGSERVICECALL:${meetingID}:CUSTOMERNAME`, value: newConfig.Name });
    }
    if (newConfig.Phone) {
      await client.setConfigurationSetting({ key: `TEAMSMEETINGSERVICECALL:${meetingID}:CUSTOMERPHONE`, value: newConfig.Phone });
    }
    if (newConfig.Email) {
      await client.setConfigurationSetting({ key: `TEAMSMEETINGSERVICECALL:${meetingID}:CUSTOMEREMAIL`, value: newConfig.Email });
    }
    if (newConfig.Id) {
      await client.setConfigurationSetting({ key: `TEAMSMEETINGSERVICECALL:${meetingID}:CUSTOMERID`, value: newConfig.Id });
    }
}

function getAppConfigClient () {
    const connectionString = process.env.AZURE_CONFIG_CONNECTION_STRING;
    let client;
    if (connectionString.startsWith('Endpoint=')) {
      client = new appConfigClient.AppConfigurationClient(connectionString);      
    }
    else {
      const credential = new azure.DefaultAzureCredential();
      client = new appConfigClient.AppConfigurationClient(connectionString, credential);
    }  
    return client;
}

async function createCustomer(meetingID, customer)
{
    const tableClient = getAZTableClient();
    const tableEntity = 
    {
        partitionKey: meetingID,
        rowKey: customer.Id,
        Name: customer.Name,
        Email: customer.Email,
        Phone: customer.Phone
    };
   await tableClient.createEntity(tableEntity);
}

function getAZTableClient () {
    const accountName = process.env.AZURE_TABLE_ACCOUNTNAME;
    const storageAccountKey = process.env.AZURE_TABLE_KEY;
    const storageUrl = `https://${accountName}.table.core.windows.net/`;
    const tableClient = new TableClient(storageUrl, "Customer", new AzureNamedKeyCredential(accountName, storageAccountKey));
    return tableClient;
}

async function getCustomer (customerID, meetingID) {
  const tableClient = getAZTableClient();   
  const customerEntity = await tableClient.getEntity(meetingID, customerID);  
  const customer = {
    Name: customerEntity.Name,
    Email: customerEntity.Email,
    Phone: customerEntity.Phone,
    Id: customerEntity.rowKey
  }
  return customer;
}

exports.saveAppConfig = saveAppConfig;
exports.createCustomer = createCustomer;
exports.getCustomer = getCustomer;