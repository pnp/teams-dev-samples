// <copyright file="MakeCallRequestData.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Data
{
    /// <summary>
    /// The outgoing call request body.
    /// </summary>
    public class MakeCallRequestData
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="MakeCallRequestData"/> class.
        /// </summary>
        /// <param name="tenantId">The tenant id.</param>
        /// <param name="objectId">The user object id.</param>
        /// <param name="isApplication">Whether the object is application.</param>
        public MakeCallRequestData(string tenantId, string objectId, bool isApplication)
        {
            this.TenantId = tenantId;
            this.ObjectId = objectId;
            this.IsApplication = isApplication;
        }

        /// <summary>
        /// Initializes a new instance of the <see cref="MakeCallRequestData"/> class.
        /// </summary>
        private MakeCallRequestData()
        {
        }

        /// <summary>
        /// Gets or sets the tenant id.
        /// </summary>
        public string TenantId { get; set; }

        /// <summary>
        /// Gets or sets the object id.
        /// </summary>
        public string ObjectId { get; set; }

        /// <summary>
        /// Gets or sets a value indicating whether the object is application.
        /// </summary>
        public bool IsApplication { get; set; }
    }
}
