using System;
using MongoDB.Bson.Serialization.Attributes;


namespace SharedModels.Models;

public class Assessment
{
    //[BsonElement("Date")]
    public DateTimeOffset date { get; set; }

    //[BsonElement("Type")]
    public AssessmentType type { get; set; }

    //[BsonElement("Status")]
    public AssessmentStatus status { get; set; }

    //[BsonElement("CustomDescription")]
    public string? customDescription { get; set; }

    public bool todoScheduled { get; set; } = false;

    public string? taskId { get; set; }

    public override string ToString()
    {
        return $"date: {date}, type: {type}, status: {status}, customDescription: {customDescription}, todoScheduled: {todoScheduled}, taskId: {taskId}";
    }
}

