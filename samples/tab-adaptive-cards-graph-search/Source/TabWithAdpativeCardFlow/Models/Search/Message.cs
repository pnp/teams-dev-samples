using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TabWithAdpativeCardFlow.Models.Search
{
    public class Message
    {
        public string Subject { get; set; }
        public string From { get; set; }
        public string CreatedDatedTime { get; set; }
        public string HasAttachments { get; set; }
        public string WebLink { get; set; }
    }
}
