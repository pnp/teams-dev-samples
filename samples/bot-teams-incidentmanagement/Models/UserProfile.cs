using Newtonsoft.Json;

namespace IncidentManagementBot.Models
{
    public class UserProfile
    {
        [JsonProperty("id")]
        public string Id { get; set; }

        [JsonProperty("incidentCreator")]
        public string IncidentCreator { get; set; }

        [JsonProperty("serviceName")]
        public string ServiceName { get; set; }

        [JsonProperty("imagePath")]
        public string ImagePath { get; set; }
    }
}
