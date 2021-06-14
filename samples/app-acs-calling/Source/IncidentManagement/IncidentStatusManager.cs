// <copyright file="IncidentStatusManager.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.IncidentBot.IncidentStatus
{
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// The incident status manager class.
    /// </summary>
    public class IncidentStatusManager
    {
        private ConcurrentDictionary<string, IncidentStatusData> statusDataDictionary;

        /// <summary>
        /// Initializes a new instance of the <see cref="IncidentStatusManager"/> class.
        /// </summary>
        public IncidentStatusManager()
        {
            this.statusDataDictionary = new ConcurrentDictionary<string, IncidentStatusData>();
        }

        /// <summary>
        /// Gets the incident count.
        /// </summary>
        public int IncidentCount => this.statusDataDictionary.Count;

        /// <summary>
        /// Add an incident.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <param name="statusData">The incident status data.</param>
        /// <returns>The incident data.</returns>
        public IncidentStatusData AddIncident(string id, IncidentStatusData statusData)
        {
            if (this.statusDataDictionary.TryAdd(id, statusData))
            {
                return statusData;
            }
            else
            {
                return null;
            }
        }

        /// <summary>
        /// Remove an incident.
        /// </summary>
        /// <param name="id">The incident id.</param>
        public void RemoveIncident(string id)
        {
            this.statusDataDictionary.TryRemove(id, out IncidentStatusData data);
        }

        /// <summary>
        /// Get most recent incidents based on the incident server time.
        /// </summary>
        /// <param name="maxCount">The maximum count in return data.</param>
        /// <returns>The data collection of incidents in descending order.</returns>
        public IEnumerable<IncidentStatusData> GetRecentIncidents(int maxCount)
        {
            return this.statusDataDictionary.Values.OrderBy(v => v.DataCreationTime).Reverse().Take(maxCount);
        }

        /// <summary>
        /// Get an incident.
        /// </summary>
        /// <param name="id">The incident id.</param>
        /// <returns>The incident data.</returns>
        public IncidentStatusData GetIncident(string id)
        {
            this.statusDataDictionary.TryGetValue(id, out IncidentStatusData value);

            return value;
        }
    }
}
