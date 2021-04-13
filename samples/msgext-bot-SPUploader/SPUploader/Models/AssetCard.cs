using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingExtension_SP.Models
{
    public class AssetCard
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public string ServerRelativeUrl { get; set; }
        public string ImageUrl { get; set; }
        public string TimeCreated { get; set; }
        public string TimeLastModified { get; set; }
    }
}
