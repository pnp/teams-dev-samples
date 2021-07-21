using Newtonsoft.Json;

namespace IncidentManagement.Models
{
    public class User
    {
        public User()
        {
        }

        [JsonProperty("id")]
        public string Id { get; set; }
        
        [JsonProperty("partitionKey")]
        public string PartitionKey { get; set; }

        [JsonProperty("name")]
        public string Name { get; set; }
    }
}
