// <copyright file="SchedulerHelper.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Helper
{
    using System;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;
    using VirtualMeetingExtensibility.Interface;
    using VirtualMeetingExtensibility.Models;
    using VirtualMeetingExtensibility.Repository;

    /// <summary>
    /// Scheduler for initiating calls
    /// </summary>
    public class SchedulerHelper : IHostedService
    {
        private readonly ILogger<SchedulerHelper> _logger;
        private readonly IConfiguration _configuration;
        private readonly IGraph _graph;
        private Timer timer;

        /// <summary>
        /// Initializes a new instance of the <see cref="SchedulerHelper" /> class.
        /// </summary>
        /// <param name="logger">ILogger instance</param>
        /// <param name="graph">IGraph instance</param>
        /// <param name="configuration">IConfiguration instance</param>
        public SchedulerHelper(ILogger<SchedulerHelper> logger, IGraph graph, IConfiguration configuration)
        {
            _graph = graph;
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Starts service
        /// </summary>
        /// <param name="cancellationToken">Cancellation token data as input</param>
        /// <returns>Completed task</returns>
        public Task StartAsync(CancellationToken cancellationToken)
        {
            timer = new Timer(RunJob, null, TimeSpan.FromSeconds(0), TimeSpan.FromMinutes(1));
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
                DateTime utcTimeNow = DateTime.UtcNow;
                utcTimeNow = utcTimeNow.AddSeconds(-utcTimeNow.Second);
                utcTimeNow = utcTimeNow.AddTicks(-(utcTimeNow.Ticks % TimeSpan.TicksPerSecond));

                var schedules = await DocumentDBRepository.GetItemsAsync<VirtualEvent>(e => e.IsActive == true);
                schedules.ToList();
                var currentSchedules = schedules.Where(s => s.StartTime != null && DateTime.Equals(utcTimeNow, Convert.ToDateTime(s.StartTime).AddSeconds(-Convert.ToDateTime(s.StartTime).Second).AddTicks(-(Convert.ToDateTime(s.StartTime).Ticks % TimeSpan.TicksPerSecond)))).ToList();
                foreach (var currentSchedule in currentSchedules)
                {
                    var currentEvent = await DocumentDBRepository.GetItemAsync<VirtualEvent>(currentSchedule.Id);

                    var encodedChatId = currentEvent.JoinWebUrl.Split('/')[5];
                    var chatId = Uri.UnescapeDataString(encodedChatId);
                    var sectionName = currentEvent.Subject + " Section ";
                    var pageName = currentEvent.Subject + " Page " + DateTime.Now.ToShortDateString();

                    var notebookId = await _graph.CreateNoteBook(_configuration["GroupId"], currentEvent.Subject);
                    var sectionId = await _graph.CreateSection(_configuration["GroupId"], notebookId, sectionName);
                    var pageId = await _graph.CreatePage(_configuration["GroupId"], sectionId, pageName);
                    var newNotebookSectionPage = new OneNoteInfo
                    {
                        ChatId = chatId,
                        CreatedDate = DateTime.UtcNow.ToString(),
                        NotebookName = currentEvent.Subject,
                        NoteBookId = notebookId,
                        SectionName = sectionName,
                        SectionId = sectionId,
                        PageName = pageName,
                        PageId = pageId,
                        EventId = currentEvent.Id
                    };

                    await DocumentDBRepository.CreateItemAsync<OneNoteInfo>(newNotebookSectionPage);

                    var callId = await _graph.PostIncidentAsync(currentEvent.ListOfParticipants, currentEvent.JoinWebUrl);
                    if (callId != null)
                    {
                        var callInfo = new CallInfo()
                        {
                            Id = Guid.NewGuid().ToString(),
                            CallId = callId,
                            CreatedDate = DateTime.UtcNow.ToString(),
                            EventId = currentSchedule.Id
                        };
                        await DocumentDBRepository.CreateItemAsync(callInfo);
                    }

                    currentEvent.IsActive = false;
                    await DocumentDBRepository.UpdateItemAsync(currentEvent.Id, currentEvent);
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
            }
        }
    }
}
