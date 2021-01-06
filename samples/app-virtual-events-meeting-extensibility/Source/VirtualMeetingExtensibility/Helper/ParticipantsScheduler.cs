// <copyright file="ParticipantsScheduler.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Helper
{
    using System;
    using System.Collections.Generic;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using Microsoft.Graph;
    using VirtualMeetingExtensibility.Models;
    using VirtualMeetingExtensibility.Repository;

    /// <summary>
    /// Scheduler for getting participants
    /// </summary>
    public class ParticipantsScheduler : IHostedService
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<ParticipantsScheduler> _logger;
        private Timer timer;

        /// <summary>
        /// Initializes a new instance of the <see cref="ParticipantsScheduler" /> class.
        /// </summary>
        /// <param name="logger">ILogger instance.</param>
        /// <param name="configuration">IConfiguration instance</param>
        /// <param name="httpClientFactory">IHttpClientFactory instance</param>
        public ParticipantsScheduler(ILogger<ParticipantsScheduler> logger, IConfiguration configuration, IHttpClientFactory httpClientFactory)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /// <summary>
        /// Starts service
        /// </summary>
        /// <param name="cancellationToken">Cancellation token data as input</param>
        /// <returns>Completed task</returns>
        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(RunJob, null, TimeSpan.FromSeconds(0), TimeSpan.FromMinutes(3));
            return Task.CompletedTask;
        }

        /// <summary>
        /// Stops service
        /// </summary>
        /// <param name="cancellationToken">Cancellation Token</param>
        /// <returns>Completed task</returns>
        public Task StopAsync(CancellationToken cancellationToken)
        {
            return Task.CompletedTask;
        }

        /// <summary>
        /// Runs job
        /// </summary>
        /// <param name="state">state information</param>
        private async void RunJob(object state)
        {
            try
            {
                string token = await AuthenticationHelper.GetAccessTokenAsync(_configuration, _httpClientFactory);
                GraphServiceClient graphserviceClient = new GraphServiceClient(
                    new DelegateAuthenticationProvider(
                            (requestMessage) =>
                            {
                                requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", token);

                                return Task.FromResult(0);
                            }));
                var callsInformation = await DocumentDBRepository.GetItemsAsync<CallInfo>(c => c.Status == null);

                foreach (var call in callsInformation)
                {
                    try
                    {
                        var participants = await graphserviceClient.Communications.Calls[call.CallId.ToString()].Participants
                            .Request()
                            .GetAsync();
                        var attendees = new List<Models.Attendee>();
                        foreach (var participant in participants.CurrentPage)
                        {
                            if (participant.Info.Identity.User != null)
                            {
                                var attendee = new Models.Attendee()
                                {
                                    DisplayName = participant.Info.Identity.User.DisplayName,
                                    AadId = participant.Info.Identity.User.Id,
                                };
                                attendees.Add(attendee);
                            }
                        }

                        var meetingAttendees = new MeetingAttendees()
                        {
                            LogTime = DateTime.UtcNow.ToString(),
                            CallId = call.CallId,
                            EventId = call.EventId,
                            ListOfAttendees = attendees
                        };
                        if (meetingAttendees.ListOfAttendees.Count > 0)
                        {
                            await DocumentDBRepository.CreateItemAsync<MeetingAttendees>(meetingAttendees);
                        }
                    }
                    catch (Exception e)
                    {
                        _logger.LogError(e.Message + ' ' + e.StackTrace);

                        if (((ServiceException)e).StatusCode == System.Net.HttpStatusCode.NotFound)
                        {
                            call.Status = (int?)System.Net.HttpStatusCode.NotFound;
                            await DocumentDBRepository.UpdateItemAsync(call.Id, call);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
            }
        }
    }
}