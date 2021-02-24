// <copyright file="GraphHelper.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Helpers
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text.RegularExpressions;
    using System.Threading.Tasks;
    using B2CChatBot.Interfaces;
    using B2CChatBot.Models;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;

    /// <summary>
    /// Helper class for Graph.
    /// </summary>
    public class GraphHelper : IGraph
    {
        private readonly IHttpClientFactory httpClientFactory;
        private readonly ILogger<GraphHelper> logger;
        private readonly IConfiguration configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="GraphHelper"/> class.
        /// </summary>
        /// <param name="httpClientFactory">IHttpClientFactory instance.</param>
        /// <param name="logger">ILogger instance.</param>
        /// <param name="configuration">IConfiguration instance.</param>
        public GraphHelper(IHttpClientFactory httpClientFactory, ILogger<GraphHelper> logger, IConfiguration configuration)
        {
            this.httpClientFactory = httpClientFactory;
            this.logger = logger;
            this.configuration = configuration;
        }

        /// <inheritdoc/>
        public async Task<GraphServiceClient> GetGraphServiceClient()
        {
            GraphServiceClient graphClient = null;
            try
            {
                var accessToken = await AuthenticationHelper.GetAccessTokenAsync(this.configuration, this.httpClientFactory);
                graphClient = new GraphServiceClient(
                new DelegateAuthenticationProvider(
                    requestMessage =>
                    {
                        // Append the access token to the request.
                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", accessToken);

                        return Task.CompletedTask;
                    }));
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + " " + e.StackTrace);
            }

            return graphClient;
        }

        /// <inheritdoc/>
        public async Task<Event> CreateOnlineEvent(string organizerUpn)
        {
            Event onlineEvent = null;
            GraphServiceClient graphServiceClient = await this.GetGraphServiceClient();
            var dateTime = DateTime.UtcNow;
            dateTime = dateTime.AddSeconds(-dateTime.Second);

            var @event = new Event
            {
                Subject = "Web chat bot meeting",
                Body = new ItemBody
                {
                    ContentType = BodyType.Html,
                    Content = "Web chat bot meeting",
                },
                Start = new DateTimeTimeZone
                {
                    DateTime = dateTime.ToString(),
                    TimeZone = "UTC",
                },
                End = new DateTimeTimeZone
                {
                    DateTime = dateTime.AddMinutes(30).ToString(),
                    TimeZone = "UTC",
                },
                Location = new Location
                {
                    DisplayName = "Teams meeting",
                },
                IsOnlineMeeting = true,
                OnlineMeetingProvider = OnlineMeetingProviderType.TeamsForBusiness,
            };

            try
            {
                if (graphServiceClient != null)
                {
                    onlineEvent = await graphServiceClient.Users[organizerUpn].Events
                                 .Request()
                                 .AddAsync(@event);
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + ' ' + e.StackTrace);
            }

            return onlineEvent;
        }

        /// <inheritdoc/>
        public async Task<DriveItem> CreateFolder(CustomerInformation customerInfo)
        {
            DriveItem folder = null;
            GraphServiceClient graphServiceClient = await this.GetGraphServiceClient();
            var timeStampRemovedSpecialChars = Regex.Replace(DateTime.Now.ToString("MM/dd/yyyy HH:mm:ss"), "[^a-zA-Z0-9_.]+", string.Empty, RegexOptions.Compiled);
            try
            {
                var driveItem = new DriveItem
                {
                    Name = $"{customerInfo.FirstName} {customerInfo.LastName} {timeStampRemovedSpecialChars}",
                    Folder = new Folder
                    {
                    },
                    AdditionalData = new Dictionary<string, object>()
                    {
                        { "@microsoft.graph.conflictBehavior", "rename" },
                    },
                };
                if (graphServiceClient != null)
                {
                    folder = await graphServiceClient.Groups[this.configuration["GroupId"]].Drive.Items[this.configuration["ChannelFilesFolderId"]].Children
                        .Request()
                        .AddAsync(driveItem);
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + ' ' + e.StackTrace);
            }

            return folder;
        }

        /// <inheritdoc/>
        public async Task<DriveItem> UploadFile(string folderId, string fileName, Stream fileContent)
        {
            DriveItem file = null;
            try
            {
                GraphServiceClient graphServiceClient = await this.GetGraphServiceClient();
                if (graphServiceClient != null)
                {
                    file = await graphServiceClient.Groups[this.configuration["GroupId"]].Drive.Items[folderId].ItemWithPath(fileName).Content.Request().PutAsync<DriveItem>(fileContent);
                }
            }
            catch (Exception e)
            {
                this.logger.LogError(e.Message + ' ' + e.StackTrace);
            }

            return file;
        }
    }
}
