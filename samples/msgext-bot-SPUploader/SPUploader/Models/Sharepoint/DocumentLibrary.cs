using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingExtension_SP.Models.Sharepoint
{
    public class DocumentLibrary : AssetCard
    {       
        /// <summary>
        /// Gets or sets name
        /// </summary>
        public string Name { get; set; }

        public string LinkingUri { get; set; }
    }
}
