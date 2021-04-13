using Microsoft.Bot.Schema.Teams;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MessageExtension_SP.Models
{
    public class MEAction
    {
        public string commandId { get; set; }
        public MessageActionsPayload MessagePayload { get; set; }
    }

    public class MESearch
    {
        public string commandId { get; set; }
        public IList<MessagingExtensionParameter> Parameters { get; set; }
    }
}
