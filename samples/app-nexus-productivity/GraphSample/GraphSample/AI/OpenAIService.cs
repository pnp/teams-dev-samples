using Azure;
using Azure.AI.OpenAI;
using Microsoft.Extensions.Options;
using static System.Environment;

namespace GraphSample.AI
{
    public class OpenAIService
    {
        public readonly string engine = "PlannerOpenAI";
        public readonly string endpoint = "https://plannerai.openai.azure.com/";
        public readonly string key = "63448da86da048d49845249803372807";

        public readonly OpenAIClient client = new OpenAIClient(new Uri("https://plannerai.openai.azure.com/"), new AzureKeyCredential("63448da86da048d49845249803372807"));
        
    }
}
