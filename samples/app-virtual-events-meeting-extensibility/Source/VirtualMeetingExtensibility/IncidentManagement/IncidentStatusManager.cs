// <copyright file="IncidentStatusManager.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.IncidentStatus
{
    using System.Collections.Concurrent;

    /// <summary>
    /// The incident status manager class.
    /// </summary>
    public class IncidentStatusManager
    {
        private readonly ConcurrentDictionary<string, IncidentStatusData> statusDataDictionary;

        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentStatusManager"/> class.
        /// </summary>
        public IncidentStatusManager()
        {
            statusDataDictionary = new ConcurrentDictionary<string, IncidentStatusData>();
        }

        /// <summary>
        /// Add an incident.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <param name="statusData">The incident status data.</param>
        /// <returns>The incident data.</returns>
        public IncidentStatusData AddIncident(string id, IncidentStatusData statusData)
        {
            if (statusDataDictionary.TryAdd(id, statusData))
            {
                return statusData;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Get an incident.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <returns>The incident data.</returns>
        public IncidentStatusData GetIncident(string id)
        {
            statusDataDictionary.TryGetValue(id, out IncidentStatusData value);

            return value;
        }
    }
}
