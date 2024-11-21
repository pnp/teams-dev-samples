using System;
namespace SharedModels.Models;
using MongoDB.Bson.Serialization.Attributes;

public class EmailsBson
{
    //[BsonElement("EmailAddress")]
    public List<string> emailAddresses { get; set; }

    //[BsonElement("TimelineID")]
    public int timelineID { get; set; }
}


