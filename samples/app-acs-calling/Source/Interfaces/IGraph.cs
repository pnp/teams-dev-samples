// <copyright file="IGraph.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Interfaces
{
    using System.Threading.Tasks;
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
        GraphServiceClient GetGraphServiceClient();

        /// <summary>
        /// Creates Online Event.
        /// </summary>
        /// <param name="graphServiceClient">Graph Service Client.</param>
        /// <returns>online event.</returns>
        Task<OnlineMeeting> CreateOnlineMeeting();
    }
}
