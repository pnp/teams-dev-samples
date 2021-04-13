using Newtonsoft.Json;

namespace MeetingExtension_SP.Models.Sharepoint
{
    public class SharePointBase
    {
        [JsonProperty("odata.nextLink")]
        public string nextLink { get; set; }
    }
}
