using System;
namespace SharedModels.Models;

public class AssessmentsBson
	{
        public List<Assessment> assessments { get; set; }

        public int timelineID { get; set; }

    }