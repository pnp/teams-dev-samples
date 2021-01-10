// <copyright file="VirtualController.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Controllers
{
    using System;
    using System.IdentityModel.Tokens.Jwt;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using VirtualMeetingExtensibility.DTO;
    using VirtualMeetingExtensibility.Interface;
    using VirtualMeetingExtensibility.Models;
    using VirtualMeetingExtensibility.Repository;

    /// <summary>
    /// Virtual API controller.
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class VirtualController : ControllerBase
    {
        private readonly ILogger<VirtualController> _logger;
        private readonly IGraph _graph;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="VirtualController" /> class.
        /// </summary>
        /// <param name="logger">ILogger instance.</param>
        /// <param name="graph">IGraph instance.</param>
        /// <param name="configuration">IConfiguration instance.</param>
        public VirtualController(ILogger<VirtualController> logger, IGraph graph, IConfiguration configuration)
        {
            _logger = logger;
            _graph = graph;
            _configuration = configuration;
        }

        /// <summary>
        /// Post event view model
        /// </summary>
        /// <param name="eventViewModel">event view model as input</param>
        /// <returns>Saves event view</returns>
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] EventViewModel eventViewModel)
        {
            string userPrincipleName = null;
            string objectId = null;
            string displayName = null;

            var idToken = Request.Headers["Authorization"].ToString()?.Split(" ")[1];
            if (!string.IsNullOrEmpty(idToken))
            {
                var handler = new JwtSecurityTokenHandler();
                if (handler.ReadToken(idToken) is JwtSecurityToken tokenS)
                {
                    userPrincipleName = tokenS.Claims.Where(a => a.Type.Equals("upn")).Select(b => b).FirstOrDefault()
                        ?.Value;
                    objectId = tokenS.Claims.Where(a => a.Type.Equals("oid")).Select(b => b).FirstOrDefault()?.Value;
                    displayName = tokenS.Claims.Where(a => a.Type.Equals("name")).Select(b => b).FirstOrDefault()?.Value;
                }
            }

            try
            {
                var graphServiceClient = await _graph.GetGraphServiceClient();
                var participants = await _graph.PrepareParticipants(graphServiceClient, eventViewModel.Participants);
                var calendarEvent = await _graph.CreateOnlineEvent(graphServiceClient, eventViewModel, participants);
                var betaGraphServiceClient = await _graph.GetBetaGraphServiceClient();
                await _graph.InstallAppAndAddTabToCalendarEvent(betaGraphServiceClient, calendarEvent.OnlineMeeting.JoinUrl);

                participants.Add(new Participant()
                {
                    Name = displayName,
                    AadId = objectId,
                    EmailId = userPrincipleName
                });

                var virtualEvent = new VirtualEvent()
                {
                    Id = Guid.NewGuid().ToString(),
                    CreatedDate = DateTime.UtcNow.ToString(),
                    Subject = eventViewModel.Subject,
                    StartTime = eventViewModel.StartDate.ToString(),
                    EndTime = eventViewModel.EndDate.ToString(),
                    IsActive = true,
                    JoinWebUrl = calendarEvent.OnlineMeeting.JoinUrl,
                    ListOfParticipants = participants
                };

                await DocumentDBRepository.CreateItemAsync(virtualEvent);

                return Ok();
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
                return BadRequest("Something went wrong!");
            }
        }

        /// <summary>
        /// Updates notebook
        /// </summary>
        /// <param name="notebookPageDto">notebook page information as input</param>
        /// <returns>Updates notebook page</returns>
        [HttpPost("UpdatePage")]
        public async Task<ActionResult> UpdatePage(NotebookPageDto notebookPageDto)
        {
            try
            {
                var pages = await DocumentDBRepository.GetItemsAsync<OneNoteInfo>(o => o.ChatId == notebookPageDto.ChatId);
                var pageInfo = pages.FirstOrDefault();

                if (pageInfo != null)
                {
                    string status = await _graph.UpdatePage(notebookPageDto.PageContent, _configuration["GroupId"], pageInfo.PageId);

                    if (!string.IsNullOrEmpty(status))
                    {
                        return Ok();
                    }
                    else
                    {
                        return BadRequest("Something went wrong!");
                    }
                }
                else
                {
                    return BadRequest("No page found, please check with meeting organizer.");
                }
            }
            catch (Exception e)
            {
                _logger.LogError(e.Message + ' ' + e.StackTrace);
                return BadRequest("Error occurred while updating page");
            }
        }
    }
}
