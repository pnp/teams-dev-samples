using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MsTeamsQuizBot.Services.Cosmos;
public class CosmosSettings
{
    public string Endpoint { get; set; }
    public string Key { get; set; }
    public string Database { get; set; }
    public string Container { get; set; }
}
