using MeetingExtension_SP.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MeetingExtension_SP.Models
{
    public class ActionType
    {       
        public ActionTypes action { get; set; }
        public string data { get; set; }
    }

    public class SubmitNewResourceRequest :ActionType
    {
        public string WebhookURL { get; set; }
        public NewResourceInformation ResourceInfo { get; set; }
        public string AppId { get; set; }
    }

    public class ActionTypes
    {
        public string type { get; set; }
        public string title { get; set; }
        public string verb { get; set; }
    }
}
