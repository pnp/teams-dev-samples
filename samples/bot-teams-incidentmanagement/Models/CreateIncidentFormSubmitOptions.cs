using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace IncidentManagementBot.Models
{
    public class CreateIncidentFormSubmitOptions
    {
        public string incidentTitle { get; set; }
        public string incidentDescription { get; set; }
        public string incidentCategory { get; set; }
        public string IncidentCreator { get; set; }
        public string ServiceName { get; set; }
        public string ImagePath { get; set; }
    }
}
