using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Bot.Builder.Community.Samples.Teams.Models
{
    public class ExampleData
    {
        public ExampleData()
        {
            MultiSelect = "true";
        }

        public string SubmitLocation { get; set; }

        public string Question { get; set; }

        public string MultiSelect { get; set; }

        public string Option1 { get; set; }
        public string Option2 { get; set; }
        public string Option3 { get; set; }
        public string Option4 { get; set; }
        public string Option5 { get; set; }
        public string Option1Value { get; set; }
        public string Option2Value { get; set; }
        public string Option3Value { get; set; }
        public string Option4Value { get; set; }
        public string Option5Value { get; set; }
    }
}