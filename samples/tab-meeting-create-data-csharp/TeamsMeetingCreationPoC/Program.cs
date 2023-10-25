using Azure.Core;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Identity.Client;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using TeamsMeetingCreationPoC.controller;
using System.Net.Http.Headers;
using TeamsMeetingCreationPoC.Model;

var environmentName = Environment.GetEnvironmentVariable("DOTNET_ENVIRONMENT");

var builder = new ConfigurationBuilder()
    .AddJsonFile($"appsettings.{environmentName}.json");
var config = builder.Build();

string clientId = config["AZURE_CLIENT_ID"];
string tenantId = config["AZURE_TENANT_ID"];
string clientSecret = config["AZURE_CLIENT_SECRET"];
string userPrincipalName = config["MEETING_OWNER"];
string dummyAttendee = config["MEETING_ATTENDEE"];

string customerName = "Contoso";
string customerEmail = "JohnJohnson@contoso.com";
string customerPhone = "+491515445556";
string customerId = "47110815";

Customer customer = new Customer()
{
  Id = customerId,
  Name = customerName,
  Email = customerEmail,
  Phone = customerPhone
};

GraphController graphController = new GraphController(tenantId, clientId, clientSecret);

string meetingSubject = "Test Meeting with App / Tab 6";

string userID = await graphController.GetUserId(userPrincipalName);
string joinUrl = await graphController.CreateTeamsMeeting(userID, userPrincipalName, dummyAttendee, meetingSubject);

string chatId = await graphController.GetMeetingChatId(userID, joinUrl);

string appId = await graphController.GetAppId();
if (appId != "")
{
  bool appInstalled = await graphController.InstallAppInChat(appId, chatId);
  if (appInstalled)
  {
    await graphController.InstallTabInChat(appId, chatId);
  }
}
AzureController azrCtrl = new AzureController(config);
azrCtrl.storeConfigValue($"TEAMSMEETINGSERVICECALL:{chatId}:CUSTOMERNAME", customerName);
azrCtrl.storeConfigValue($"TEAMSMEETINGSERVICECALL:{chatId}:CUSTOMERPHONE", customerPhone);
azrCtrl.storeConfigValue($"TEAMSMEETINGSERVICECALL:{chatId}:CUSTOMEREMAIL", customerEmail);
azrCtrl.storeConfigValue($"TEAMSMEETINGSERVICECALL:{chatId}:CUSTOMERID", customerId);

AzureTableController azureTableController = new AzureTableController(config);
azureTableController.CreateCustomer(chatId, customer);
Console.ReadLine();