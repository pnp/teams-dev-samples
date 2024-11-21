using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SharedModels.Models;

	public class Mail
	{
        [BsonId]
        public ObjectId Id { get; set; }

        public string Subject { get; set; }

        public string Body { get; set; }

        public string Sender { get; set; }

        public DateTime ReceivedTime { get; set; }
    }


