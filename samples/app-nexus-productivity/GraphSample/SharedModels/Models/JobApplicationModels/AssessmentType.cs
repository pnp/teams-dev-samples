using System;
using System.Runtime.Serialization;
using System.Text.Json.Serialization;

namespace SharedModels.Models;

[JsonConverter(typeof(JsonStringEnumConverter))]
public enum AssessmentType
{
    //[EnumMember(Value = "Online HR Interview")]
    Online_HR_Interview,

    //[EnumMember(Value = "In Person HR Interview")]
    In_Person_HR_Interview,

    //[EnumMember(Value = "Online Technical Interview")]
    Online_Technical_Interview,

    //[EnumMember(Value = "In Person Technical Interview")]
    In_Person_Technical_Interview,

    //[EnumMember(Value = "Online Assessment")]
    Online_Assessment,

    //[EnumMember(Value = "Manager Interview")]
    Manager_Interview,

    //[EnumMember(Value = "Custom")]
    Custom
}

