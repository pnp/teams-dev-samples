using System;
namespace SharedModels.Models;
using MongoDB.Bson.Serialization.Attributes;

public class AssessmentBson
	{
        //[BsonElement("Assessment")]
        public Assessment assessment { get; set; }

        //[BsonElement("TimelineID")]
        public int timelineID { get; set; }

    }


