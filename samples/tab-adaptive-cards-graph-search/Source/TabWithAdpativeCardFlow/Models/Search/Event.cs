using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TabWithAdpativeCardFlow.Models.Search
{
    public class Event
    {
        public string Subject { get; set; }
        public string Start { get; set; }
        public string End { get; set; }
        public string IsAllDay { get; set; }
    }
}
