using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageExtension_SP.Models
{
    public class AssetData
    {
        public string ApproverName { get; set; }
        public string SubmittedBy { get; set; }
        public string DateOfSubmission { get; set; }
        public string SubitteTo { get; set; }
        public string NameOfDocument { get; set; }

        public string DocName { get; set; }
        public string url { get; set; }
        public string userChat { get; set; }
        public string userMRI { get; set; }
    }
}
