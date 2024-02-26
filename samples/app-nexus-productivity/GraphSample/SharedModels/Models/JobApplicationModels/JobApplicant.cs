using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
namespace SharedModels.Models;

public class JobApplicant
{
    [BsonId]
    [BsonRepresentation(BsonType.String)]
    //[BsonElement("Username")]
    public string username { get; set; }

    //[BsonElement("ApplicationTimelines")]
    public List<ApplicationTimeline> applicationTimelines { get; set; }

    //[BsonElement("TimelineCounter")]
    public int timelineCounter { get; set; }

}

