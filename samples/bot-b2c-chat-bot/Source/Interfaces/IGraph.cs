// <copyright file="IGraph.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Interfaces
{
    using System.IO;
    using System.Threading.Tasks;
    using B2CChatBot.Models;
    using Microsoft.Graph;

    /// <summary>
    /// Interface for Graph.
    /// </summary>
    public interface IGraph
    {
        /// <summary>
        /// Creates Graph Service Client.
        /// </summary>
        /// <returns>Graph Service Client.</returns>
        Task<GraphServiceClient> GetGraphServiceClient();

        /// <summary>
        /// Creates Online Event.
        /// </summary>
        /// <param name="organizerUpn">user principle name.</param>
        /// <returns>online event.</returns>
        Task<Event> CreateOnlineEvent(string organizerUpn);

        /// <summary>
        /// Upload file to SharePoint.
        /// </summary>
        /// <param name="folderId">Folder id.</param>
        /// <param name="fileName">File name.</param>
        /// <param name="fileContent">File Content.</param>
        /// <returns>Drive item.</returns>
        Task<DriveItem> UploadFile(string folderId, string fileName, Stream fileContent);

        /// <summary>
        /// Create Folder.
        /// </summary>
        /// <param name="customerInfo">CustomerInformation instance.</param>
        /// <returns>Drive item.</returns>
        Task<DriveItem> CreateFolder(CustomerInformation customerInfo);
    }
}
