using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConsultingBot.Model
{
    public class ConsultingRequest
    {
        public string personName { get; set; }
        public string clientName { get; set; }
        public string projectName { get; set; }
        public string role { get; set; }
        public string monthZero { get; set; }
        public string monthOne { get; set; }
        public string monthTwo { get; set; }
        public string forecastZero { get; set; }
        public string forecastOne { get; set; }
        public string forecastTwo { get; set; }
    }

}
