using Azure;
using Azure.Data.Tables;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TeamsMeetingCreationPoC.Model;

namespace TeamsMeetingCreationPoC.controller
{
  internal class AzureTableController
  {
    private TableClient tableClient;
    public AzureTableController(IConfiguration config) {
      string accountName = config["AZURE_TABLE_ACCOUNTNAME"];
        string storageAccountKey = config["AZURE_TABLE_KEY"];
      string storageUrl = $"https://{accountName}.table.core.windows.net/";
      tableClient = new TableClient(new Uri(storageUrl), "Customer", new TableSharedKeyCredential(accountName, storageAccountKey));
    }

    public void CreateCustomer(string meetingID, Customer customer)
    {
      var tableEntity = new TableEntity(meetingID, customer.Id)
      {
        { "Name", customer.Name },
        { "Email", customer.Email },
        { "Phone", customer.Phone }
      };
      tableClient.AddEntity(tableEntity);
    }

    public Customer GetCustomer(string meetingID)
    {
      Pageable<TableEntity> queryResults = tableClient.Query<TableEntity>(filter: $"PartitionKey eq '{meetingID}'");
      var custEntity = queryResults.First<TableEntity>();
      Customer customer = new Customer()
      {
        Id = custEntity.RowKey,
        Name = custEntity.GetString("Name"),
        Email = custEntity.GetString("Email"),
        Phone = custEntity.GetString("Phone")
      };
      return customer;
    }
  }
}
