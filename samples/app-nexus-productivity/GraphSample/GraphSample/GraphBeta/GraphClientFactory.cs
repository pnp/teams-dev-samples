using Microsoft.AspNetCore.Components.WebAssembly.Authentication.Internal;
using Microsoft.Graph.Beta;
using Microsoft.Kiota.Http.HttpClientLibrary;

namespace GraphSampleBeta.Graph
{
    public class GraphClientFactoryBeta
    {
        private readonly IAccessTokenProviderAccessor accessor;
        private readonly HttpClient httpClient;
        private readonly ILogger<GraphClientFactoryBeta> logger;
        private GraphServiceClient? graphClient;

        public GraphClientFactoryBeta(IAccessTokenProviderAccessor accessor,
            HttpClient httpClient,
            ILogger<GraphClientFactoryBeta> logger)
        {
            this.accessor = accessor;
            this.httpClient = httpClient;
            this.logger = logger;
        }

        public GraphServiceClient GetAuthenticatedClient()
        {
            // Use the existing one if it's there
            if (graphClient == null)
            {
                // Create a GraphServiceClient using a scoped
                // HttpClient
                var requestAdapter = new HttpClientRequestAdapter(
                    new BlazorAuthProvider(accessor), null, null, httpClient);
                graphClient = new GraphServiceClient(requestAdapter);
            }

            return graphClient;
        }
    }
}
