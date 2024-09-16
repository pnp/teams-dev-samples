using Microsoft.AspNetCore.Components.WebAssembly.Authentication.Internal;
using Microsoft.Graph;
using Microsoft.Kiota.Http.HttpClientLibrary;

namespace GraphSample.Graph
{
    public class GraphClientFactory
    {
        private readonly IAccessTokenProviderAccessor accessor;
        private readonly HttpClient httpClient;
        private readonly ILogger<GraphClientFactory> logger;
        private GraphServiceClient? graphClient;

        public GraphClientFactory(IAccessTokenProviderAccessor accessor,
            HttpClient httpClient,
            ILogger<GraphClientFactory> logger)
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
