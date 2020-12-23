// <copyright file="GraphHelper.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

extern alias BetaLib;
using Beta = BetaLib.Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;
using Microsoft.Graph;
using VirtualMeetingExtensibility.Interface;
using VirtualMeetingExtensibility.Models;
using VirtualMeetingExtensibility.Data;
using System.Globalization;
using Microsoft.Graph.Communications.Common;
using Microsoft.Graph.Communications.Core.Serialization;
using System.Text;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;

namespace VirtualMeetingExtensibility.Helper
{
    public class GraphHelper : IGraph
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ILogger<GraphHelper> _logger;
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly Bot.Bot _bot;

        public GraphHelper(ILogger<GraphHelper> logger, IHttpContextAccessor httpContextAccessor, IConfiguration configuration, IHttpClientFactory httpClientFactory, Bot.Bot bot)
        {
            _httpContextAccessor = httpContextAccessor;
            _logger = logger;
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _bot = bot;

        }
        public async Task<Beta.GraphServiceClient> GetBetaGraphServiceClient()
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext;
                httpContext.Request.Headers.TryGetValue("Authorization", out StringValues assertion);
                var idToken = assertion.ToString().Split(" ")[1];
                string token = await AuthenticationHelper.GetAccessTokenOnBehalfUserAsync(_configuration, _httpClientFactory, idToken);
                return new Beta.GraphServiceClient(
                    new DelegateAuthenticationProvider(
                        (requestMessage) =>
                        {
                            requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                            return Task.FromResult(0);
                        }));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
                return null;
            }
        }

        /// <summary>
        /// Get graph service client information
        /// </summary>
        /// <returns>Graph service client</returns>
        public async Task<GraphServiceClient> GetGraphServiceClient()
        {
            try
            {
                var httpContext = _httpContextAccessor.HttpContext;
                httpContext.Request.Headers.TryGetValue("Authorization", out StringValues assertion);
                var idToken = assertion.ToString().Split(" ")[1];
                string token = await AuthenticationHelper.GetAccessTokenOnBehalfUserAsync(_configuration, _httpClientFactory, idToken);
                return new GraphServiceClient(
                new DelegateAuthenticationProvider(
                       (requestMessage) =>
                       {
                           requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                           return Task.FromResult(0);
                       }));
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
                return null;
            }
        }

        /// <summary>
        /// Prepare Participants
        /// </summary>
        /// <param name="graphServiceClient">graphServiceClient instance.</param>
        /// <param name="participants">Participants</param>
        /// <returns>Returns Participant collection</returns>
        public async Task<List<Models.Participant>> PrepareParticipants(GraphServiceClient graphServiceClient, string participants)
        {
            string[] requiredMembers = participants.Split(',');
            List<string> mergedMembers = new List<string>();
            List<Models.Participant> participantsCol = new List<Models.Participant>();
            mergedMembers.AddRange(requiredMembers);

            var members = ValidateEmailAddress(mergedMembers);
            foreach (var member in members)
            {
                Models.Participant participant = null;
                try
                {
                    var userInfo = await graphServiceClient.Users[member].Request().GetAsync();
                    participant = new Models.Participant()
                    {
                        Name = userInfo.DisplayName,
                        AadId = userInfo.Id,
                        Type = userInfo.UserType,
                        EmailId = userInfo.UserPrincipalName
                    };
                }
                catch (Exception ex)
                {
                    if (((ServiceException)ex).StatusCode == System.Net.HttpStatusCode.NotFound)
                    {
                        Invitation invitation = new Invitation
                        {
                            SendInvitationMessage = true,
                            InvitedUserEmailAddress = member,
                            InviteRedirectUrl = _configuration["BaseUrl"] + "/welcome"
                        };
                        try
                        {
                            var result = await graphServiceClient.Invitations.Request().AddAsync(invitation);
                            participant = new Models.Participant()
                            {
                                Name = result.InvitedUserEmailAddress.Split('@')[0],
                                AadId = result.InvitedUser.Id,
                                Type = result.InvitedUserType,
                                EmailId = result.InvitedUserEmailAddress
                            };
                        }
                        catch (Exception e)
                        {
                            _logger.LogError(e.Message + ' ' + e.StackTrace);
                        }
                    }
                }

                participantsCol.Add(participant);
            }

            return participantsCol;
        }

        /// <summary>
        /// Validates email address
        /// </summary>
        /// <param name="mergedMembers"></param>
        /// <returns></returns>
        public List<string> ValidateEmailAddress(List<string> mergedMembers)
        {
            List<string> members = new List<string>();
            foreach (var member in mergedMembers)
            {
                if (Validate.Validator.IsValidEmailAddress(member))
                {
                    members.Add(member);
                }
            }

            return members;
        }

        /// <summary>
        /// Create online event
        /// </summary>
        /// <param name="graphServiceClient">Graph service client </param>
        /// <param name="eventViewModel">Event view details</param>
        /// <param name="participants">Participant details</param>
        /// <returns>Event details</returns>
        public async Task<Event> CreateOnlineEvent(GraphServiceClient graphServiceClient, EventViewModel eventViewModel, List<Models.Participant> participants)
        {
            List<Microsoft.Graph.Attendee> attendees = new List<Microsoft.Graph.Attendee>();

            foreach (var participant in participants)
            {
                var attendee = new Microsoft.Graph.Attendee
                {
                    EmailAddress = new EmailAddress
                    {
                        Address = participant.EmailId,
                        Name = participant.Name
                    },
                    Type = AttendeeType.Required
                };
                attendees.Add(attendee);
            }

            var @event = new Event
            {
                Subject = eventViewModel.Subject,
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = eventViewModel.Subject
                },
                Start = new DateTimeTimeZone
                {
                    DateTime = eventViewModel.StartDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    TimeZone = "UTC"
                },
                End = new DateTimeTimeZone
                {
                    DateTime = eventViewModel.EndDate.ToString("yyyy-MM-ddTHH:mm:ss"),
                    TimeZone = "UTC"
                },
                Location = new Location
                {
                    DisplayName = "Teams meeting"
                },

                Attendees = attendees,
                IsOnlineMeeting = true,
                OnlineMeetingProvider = OnlineMeetingProviderType.TeamsForBusiness
            };

            try
            {
                return await graphServiceClient.Me.Events
                             .Request()
                             .AddAsync(@event);
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
                return null;
            }
        }

        public async Task InstallAppAndAddTabToCalendarEvent(Beta.GraphServiceClient graphServiceClient, string onlineMeetingJoinUrl)
        {
            try
            {

                var chatId = onlineMeetingJoinUrl.Split('/')[5];

                var teamsAppInstallation = new Beta.TeamsAppInstallation
                {
                    AdditionalData = new Dictionary<string, object>()
                {
                    {"teamsApp@odata.bind", $"https://graph.microsoft.com/v1.0/appCatalogs/teamsApps/{_configuration["AppId"]}"}
                }
                };

                await graphServiceClient.Chats[chatId].InstalledApps
                    .Request()
                    .AddAsync(teamsAppInstallation);

                var teamsTab = new Beta.TeamsTab
                {
                    DisplayName = "Add Notes",
                    Configuration = new Beta.TeamsTabConfiguration
                    {
                        EntityId = Guid.NewGuid().ToString("N").ToUpper(),
                        ContentUrl = $"{_configuration["BaseUrl"]}/addnotes",
                        WebsiteUrl = _configuration["BaseUrl"],
                        RemoveUrl = $"{_configuration["BaseUrl"]}/uninstallTab"
                    },
                    AdditionalData = new Dictionary<string, object>()
                {
                    {"teamsApp@odata.bind", $"https://graph.microsoft.com/beta/appCatalogs/teamsApps/{_configuration["AppId"]}"}
                }
                };

                await graphServiceClient.Chats[chatId].Tabs
                    .Request()
                    .AddAsync(teamsTab);

            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
            }
        }

        /// <summary>
        /// Saves incident details of participants
        /// </summary>
        /// <param name="participants">Participant details</param>
        /// <param name="joinWebUrl">Joining web url</param>
        /// <returns>Call id of the incident</returns>
        public async Task<string> PostIncidentAsync(List<Models.Participant> participants, string joinWebUrl)
        {
            string callId = null;
            List<string> participantsAadIds = new List<string>();
            foreach (var participant in participants)
            {
                participantsAadIds.Add(participant.AadId.ToString());
            }

            //participantsAadIds.Add(objectId);
            IncidentRequestData incidentRequestData = new IncidentRequestData()
            {
                Name = "New incident" + DateTime.UtcNow.ToString(CultureInfo.InvariantCulture),
                Time = DateTime.UtcNow,
                TenantId = _configuration["AzureAd:TenantId"],
                ObjectIds = participantsAadIds,
                JoinUrl = joinWebUrl
            };
            Validator.NotNull(incidentRequestData, nameof(incidentRequestData));

            try
            {
                var call = await _bot.RaiseIncidentAsync(incidentRequestData).ConfigureAwait(false);

                var callUriTemplate = new UriBuilder(_bot.BotInstanceUri)
                {
                    Path = HttpRouteConstants.CallRoutePrefix.Replace("{callLegId}", call.Id),
                    Query = _bot.BotInstanceUri.Query.Trim('?')
                };

                var callUri = callUriTemplate.Uri.AbsoluteUri;
                var values = new Dictionary<string, string>
                {
                    { "legId", call.Id },
                    { "scenarioId", call.ScenarioId.ToString() },
                    { "call", callUri },
                    { "logs", callUri.Replace("/calls/", "/logs/") },
                };

                var serializer = new CommsSerializer(pretty: true);
                serializer.SerializeObject(values);

                callId = call.Id;
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
            }

            return callId;
        }
        public async Task<string> CreatePage(string groupId, string sectionId, string pageName)
        {
            string pageId = null;
            string token = await AuthenticationHelper.GetAccessTokenAsync(_configuration, _httpClientFactory);
            if (token != null)
            {
                var url = $"https://graph.microsoft.com/v1.0/groups/{groupId}/onenote/sections/{sectionId}/pages";
                var httpClient = _httpClientFactory.CreateClient("GraphWebClient");

                string pageHtml = $"<html><head><title>{ pageName}</title></head><body></body></html>";
                using var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Content = new StringContent(pageHtml, Encoding.UTF8, "application/xhtml+xml");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                using HttpResponseMessage response = await httpClient.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    pageId = JsonConvert.DeserializeObject<dynamic>(responseBody).id;
                }
                else
                {
                    _logger.LogError(response.StatusCode + " " + response.RequestMessage);
                }
            }

            return pageId;
        }

        /// <summary>
        /// Create section
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="notebookId"></param>
        /// <param name="sectionName"></param>
        /// <returns></returns>
        public async Task<string> CreateSection(string groupId, string notebookId, string sectionName)
        {
            string sectionId = null;
            string token = await AuthenticationHelper.GetAccessTokenAsync(_configuration, _httpClientFactory);
            if (token != null)
            {
                var url = $"https://graph.microsoft.com/v1.0/groups/{groupId}/onenote/notebooks/{notebookId}/sections";
                var httpClient = _httpClientFactory.CreateClient("GraphWebClient");
                var oneNoteSection = new OnenoteSection
                {
                    DisplayName = sectionName
                };
                var sectionJsonData = JsonConvert.SerializeObject(oneNoteSection);

                using var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Content = new StringContent(sectionJsonData, Encoding.UTF8, "application/json");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                using HttpResponseMessage response = await httpClient.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    sectionId = JsonConvert.DeserializeObject<dynamic>(responseBody).id;
                }
                else
                {
                    _logger.LogError(response.StatusCode + " " + response.RequestMessage);
                }
            }

            return sectionId;
        }

        /// <summary>
        /// Creates notebook
        /// </summary>
        /// <param name="groupId"></param>
        /// <param name="notebookName"></param>
        /// <returns></returns>
        public async Task<string> CreateNoteBook(string groupId, string notebookName)
        {
            string notebookId = null;
            string token = await AuthenticationHelper.GetAccessTokenAsync(_configuration, _httpClientFactory);
            if (token != null)
            {
                var url = $"https://graph.microsoft.com/v1.0/groups/{groupId}/onenote/notebooks";
                var httpClient = _httpClientFactory.CreateClient("GraphWebClient");
                var oneNotebook = new Notebook
                {
                    DisplayName = notebookName
                };
                var oneNotebookJsonData = JsonConvert.SerializeObject(oneNotebook);

                using var request = new HttpRequestMessage(HttpMethod.Post, url);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Content = new StringContent(oneNotebookJsonData, Encoding.UTF8, "application/json");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                using HttpResponseMessage response = await httpClient.SendAsync(request);
                string responseBody = await response.Content.ReadAsStringAsync();
                if (response.IsSuccessStatusCode)
                {
                    notebookId = JsonConvert.DeserializeObject<dynamic>(responseBody).id;
                }
                else
                {
                    _logger.LogError(response.StatusCode + " " + response.RequestMessage);
                }
            }

            return notebookId;
        }

        /// <summary>
        /// Update page
        /// </summary>
        /// <param name="pageContent"></param>
        /// <param name="groupId"></param>
        /// <param name="pageId"></param>
        /// <returns></returns>
        public async Task<string> UpdatePage(string pageContent, string groupId, string pageId)
        {
            string status = null;
            string userPrincipleName = null;
            string displayName = null;
            var httpContext = _httpContextAccessor.HttpContext;
            httpContext.Request.Headers.TryGetValue("Authorization", out StringValues assertion);
            var idToken = assertion.ToString().Split(" ")[1];
            if (idToken.Length > 0)
            {
                var handler = new JwtSecurityTokenHandler();
                if (handler.ReadToken(idToken) is JwtSecurityToken tokenS)
                {
                    userPrincipleName = tokenS.Claims.Where(a => a.Type.Equals("upn")).Select(b => b).FirstOrDefault()?.Value;
                    displayName = tokenS.Claims.Where(a => a.Type.Equals("name")).Select(b => b).FirstOrDefault()?.Value;
                }
            }

            string token = await AuthenticationHelper.GetAccessTokenOnBehalfUserAsync(_configuration, _httpClientFactory, idToken);

            if (token != null)
            {
                var url = $"https://graph.microsoft.com/v1.0/groups/{groupId}/onenote/pages/{pageId}/content";
                var httpClient = _httpClientFactory.CreateClient("GraphWebClient");

                var updateContent = new List<OneNotePage>()
                {
                    new OneNotePage
                    {
                        Target = "body",
                        Action = "append",
                        Content = "<a href="+userPrincipleName+">"+displayName+"</a><p>"+ pageContent+"</p>"
                    }
                };
                var jsonData = JsonConvert.SerializeObject(updateContent);
                using var request = new HttpRequestMessage(HttpMethod.Patch, url);
                request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                request.Content = new StringContent(jsonData, Encoding.UTF8, "application/json");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
                using HttpResponseMessage response = await httpClient.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    status = "success";
                }
                else
                {
                    _logger.LogError(response.StatusCode + " " + response.RequestMessage);
                }
            }

            return status;
        }

    }
}
