using System;
namespace SharedModels.Models;
using MongoDB.Bson.Serialization.Attributes;

public class DatesBson
	{
        public DateTimeOffset oldDate { get; set; }
        public DateTimeOffset newDate { get; set; }
        public int timelineID { get; set; }
    }