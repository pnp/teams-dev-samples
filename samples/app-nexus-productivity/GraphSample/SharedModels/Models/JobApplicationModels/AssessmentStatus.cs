using System;
using System.Text.Json.Serialization;

namespace SharedModels.Models;


    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum AssessmentStatus
	{
        Scheduled,
        Passed,
        Pending,
        Failed
	}


