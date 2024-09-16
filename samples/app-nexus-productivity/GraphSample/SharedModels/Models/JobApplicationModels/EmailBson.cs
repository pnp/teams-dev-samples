using System;
namespace SharedModels.Models;
using MongoDB.Bson.Serialization.Attributes;

public class EmailBson
	{
        //[BsonElement("EmailAddress")]
        public string emailAddress { get; set; }

        //[BsonElement("TimelineID")]
        public int timelineID { get; set; }
    }


