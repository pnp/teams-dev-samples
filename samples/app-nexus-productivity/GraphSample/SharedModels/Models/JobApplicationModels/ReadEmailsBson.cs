using System;
namespace SharedModels.Models
{
	public class ReadEmailsBson
	{
		public int timelineID { get; set; }

		public Dictionary<string, bool> readEmails { get; set; }
	}
}

