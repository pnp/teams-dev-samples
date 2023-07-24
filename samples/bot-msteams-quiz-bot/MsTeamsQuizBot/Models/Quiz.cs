using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Models;
public class Quiz
{
    [JsonProperty("id")]
    public string Id { get; set; }
    [JsonProperty("language")]
    public string Language { get; set; }
    [JsonProperty("topic")]
    public string Topic { get; set; }
}
