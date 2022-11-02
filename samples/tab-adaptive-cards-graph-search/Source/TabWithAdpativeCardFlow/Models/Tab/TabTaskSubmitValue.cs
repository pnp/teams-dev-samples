using Newtonsoft.Json;

namespace TabWithAdpativeCardFlow.Models.Tab
{
    public class TabTaskSubmitValue<T>
    {
        [JsonProperty("type")]
        public object Type { get; set; } = "tab/submit";

        [JsonProperty("data")]
        public T Data { get; set; }
    }
}
