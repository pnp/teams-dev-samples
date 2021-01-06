// <copyright file="IGraph.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Interface
{
    extern alias BetaLib;

    using System.Collections.Generic;
    using System.Threading.Tasks;
    using Microsoft.Graph;
    using VirtualMeetingExtensibility.Models;
    using Beta = BetaLib.Microsoft.Graph;

    /// <summary>
    /// Graph interface.
    /// </summary>
    public interface IGraph
    {
        /// <summary>
        /// Get graph service client
        /// </summary>
        /// <returns>Graph service client</returns>
        Task<GraphServiceClient> GetGraphServiceClient();

        /// <summary>
        /// Get beta graph service client
        /// </summary>
        /// <returns>Beta Graph service client</returns>
        Task<Beta.GraphServiceClient> GetBetaGraphServiceClient();

        /// <summary>
        /// Prepare Participants
        /// </summary>
        /// <param name="graphServiceClient">graphServiceClient instance.</param>
        /// <param name="participants">Participants</param>
        /// <returns>Returns Participant collection</returns>
        Task<List<Models.Participant>> PrepareParticipants(GraphServiceClient graphServiceClient, string participants);

        /// <summary>
        /// Creates online event
        /// </summary>
        /// <param name="graphServiceClient">GraphServiceClient instance.</param>
        /// <param name="eventViewModel">EventViewModel instance.</param>
        /// <param name="participants">Participant instance.</param>
        /// <returns>Event details</returns>
        Task<Event> CreateOnlineEvent(GraphServiceClient graphServiceClient, EventViewModel eventViewModel, List<Models.Participant> participants);

        /// <summary>
        /// Install app and add tab
        /// </summary>
        /// <param name="graphServiceClient">graphServiceClient instance.</param>
        /// <param name="onlineMeetingJoinUrl">online Meeting Join Url</param>
        /// <returns>The task object representing the service response for the asynchronous operation.</returns>
        Task InstallAppAndAddTabToCalendarEvent(Beta.GraphServiceClient graphServiceClient, string onlineMeetingJoinUrl);
        
        /// <summary>
        /// Saves incident details of participants
        /// </summary>
        /// <param name="participants">Participant details</param>
        /// <param name="joinWebUrl">Joining web url</param>
        /// <returns>Call id of the incident</returns>
        Task<string> PostIncidentAsync(List<Models.Participant> participants, string joinWebUrl);
        
        /// <summary>
        /// Create page
        /// </summary>
        /// <param name="groupId">Group Id</param>
        /// <param name="sectionId">Section Id</param>
        /// <param name="pageName">Page Name</param>
        /// <returns>Page Id</returns>
        Task<string> CreatePage(string groupId, string sectionId, string pageName);

        /// <summary>
        /// Create section
        /// </summary>
        /// <param name="groupId">Group id</param>
        /// <param name="notebookId">Notebook Id</param>
        /// <param name="sectionName">Section name</param>
        /// <returns>Section id.</returns>
        Task<string> CreateSection(string groupId, string notebookId, string sectionName);

        /// <summary>
        /// Creates notebook
        /// </summary>
        /// <param name="groupId">Group id</param>
        /// <param name="notebookName">Notebook name</param>
        /// <returns>Notebook id.</returns>
        Task<string> CreateNoteBook(string groupId, string notebookName);

        /// <summary>
        /// Update page
        /// </summary>
        /// <param name="pageContent">Page content</param>
        /// <param name="groupId">Group id.</param>
        /// <param name="chatId">Chat or meeting id.</param>
        /// <returns>Update status.</returns>
        Task<string> UpdatePage(string pageContent, string groupId, string chatId);
    }
}
