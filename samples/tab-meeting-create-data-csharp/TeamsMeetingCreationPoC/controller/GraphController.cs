using Azure.Core;
using Azure.Identity;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Microsoft.Identity.Client;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;

namespace TeamsMeetingCreationPoC.controller
{
    internal class GraphController
    {
        private bool userScope = true; // true=Delegated, false=app
        private string[] scopes = new[] { "https://graph.microsoft.com/.default" };
        private GraphServiceClient graphClient;
        
        public GraphController(string tenantId, string clientId, string clientSecret) 
        {
            string accessToken; // For debug reasons only!
            if (userScope)
            {
                var clientApplication = PublicClientApplicationBuilder.Create(clientId)
                                                          .WithRedirectUri("http://localhost")
                                                          .WithAuthority(AzureCloudInstance.AzurePublic, tenantId)
                                                          .Build();

                accessToken = clientApplication.AcquireTokenInteractive(scopes).ExecuteAsync().Result.AccessToken;
                HttpClient _httpClient = new HttpClient();
                _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                graphClient = new GraphServiceClient(_httpClient);
            }
            else
            {
                var options = new ClientSecretCredentialOptions
                {
                    AuthorityHost = AzureAuthorityHosts.AzurePublicCloud,
                };

                var clientSecretCredential = new ClientSecretCredential(
                    tenantId, clientId, clientSecret, options);

                var tokenRequestContext = new TokenRequestContext(scopes);
                accessToken = clientSecretCredential.GetTokenAsync(tokenRequestContext).Result.Token;
                graphClient = new GraphServiceClient(clientSecretCredential, scopes);
            }
        }

        public async Task<string> CreateTeamsMeeting(string userId, string userPrincipalName, string dummyAttendee, string meetingSubject)
        {
            var attendeeList = new List<Attendee>();
            Attendee attendee = new Attendee { EmailAddress = new EmailAddress { Address = dummyAttendee } };
            attendeeList.Add(attendee);
            Event evt = new Event
            {
                Subject = meetingSubject,
                IsOnlineMeeting = true,
                Organizer = new Recipient
                {
                    EmailAddress = new EmailAddress { Address = userPrincipalName }
                },
                Attendees = attendeeList,
                Start = new DateTimeTimeZone
                {
                    TimeZone = "Europe/Berlin",
                    DateTime = DateTime.Now.ToString("s")
                },
                End = new DateTimeTimeZone
                {
                    TimeZone = "Europe/Berlin",
                    DateTime = DateTime.Now.AddHours(1).ToString("s")
                }
            };
            var newEvent = await graphClient
                .Users[userId].Calendar.Events.PostAsync(evt);
            Console.WriteLine($"Event created with ID {newEvent.Id}");
            Console.WriteLine($"Event created with JoinUrl {newEvent.OnlineMeeting.JoinUrl}");
            return newEvent.OnlineMeeting.JoinUrl;
        }
        public async Task<string> GetMeetingChatId(string userID, string joinUrl)
        {
            var onlineMeeting = await graphClient.Users[userID].OnlineMeetings
                            .GetAsync((requestConfiguration) =>
                            {
                                requestConfiguration.QueryParameters.Filter = $"joinWebUrl eq '{joinUrl}'";
                            });
            string chatId = onlineMeeting.Value[0].ChatInfo.ThreadId;
            Console.WriteLine($"OnlineMeeting with ChatID {chatId}");
            return chatId;
        }

        public async Task<bool> InstallAppInChat(string appId, string chatId)
        {
            var requestBody = new TeamsAppInstallation
            {
                AdditionalData = new Dictionary<string, object>
                {
                    {
                        "teamsApp@odata.bind" , $"https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{appId}"
                    },
                }
            };
            var result = await graphClient.Chats[chatId].InstalledApps.PostAsync(requestBody);

            return true;
        }

        public async Task<bool> InstallTabInChat(string appId, string chatId)
        {
            var tabRequestBody = new TeamsTab
            {
                DisplayName = "Service Customer",
                Configuration = new TeamsTabConfiguration
                {
                    EntityId = "2DCA2E6C7A10415CAF6B8AB6661B3154", // ToDo
                    ContentUrl = "https://mmotabmeetingcreatedata.azurewebsites.net/tab",
                    RemoveUrl = "https://mmotabmeetingcreatedata.azurewebsites.net/uninstallTab",
                    WebsiteUrl = "https://mmotabmeetingcreatedata.azurewebsites.net"
                },
                AdditionalData = new Dictionary<string, object>
        {
            {
                "teamsApp@odata.bind" , $"https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{appId}"
            }
        }
            };
            var tabResult = await graphClient.Chats[chatId].Tabs.PostAsync(tabRequestBody);
            return true;
        }
        public async Task<string> GetUserId(string userPrincipalName)
        {
            User user = await graphClient.Users[userPrincipalName].GetAsync();
            string userId = user.Id;
            return userId;
        }

        public async Task<string> GetAppId()
        {
            var apps = await graphClient.AppCatalogs.TeamsApps.GetAsync((requestConfiguration) =>
            {
                requestConfiguration.QueryParameters.Filter = $"distributionMethod eq 'organization' and displayName eq 'TeamsMeetingServiceCall'";
            });

            string appId = "";
            if (apps.Value != null)
            {
                appId = apps.Value.First<TeamsApp>().Id ?? "";
            }
            return appId;
        }
    }
}
