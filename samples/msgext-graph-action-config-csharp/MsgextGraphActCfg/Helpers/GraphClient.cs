using Microsoft.Graph;
using Microsoft.Kiota.Abstractions.Authentication;
using MsgextGraphSrchCfg.Models;

namespace MsgextGraphSrchCfg.Helpers
{
    public class GraphClient
    {
        private readonly GraphServiceClient _graphClient;

        public GraphClient(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new ArgumentNullException(nameof(token));
            }
            var authenticationProvider = new BaseBearerTokenAuthenticationProvider(new TokenProvider(token));
            this._graphClient = new GraphServiceClient(authenticationProvider);
        }
        
        public async Task<Document[]> GetDocuments(string siteID, string listID)
        {
            var docItems = await this._graphClient
                                    .Sites[siteID]
                                    .Lists[listID]
                                    .Items
                                    .GetAsync(requestConfiguration =>
                                    {
                                        requestConfiguration.QueryParameters.Expand = new string[] { "driveItem" };
                                    });
            List<Document> result = new List<Document>();
            foreach ( var item in docItems.Value)
            {
                result.Add(new Document { Id = item.Id, Name = item.DriveItem.Name, Modified = item.LastModifiedDateTime.Value.DateTime, Author = item.CreatedBy.User.DisplayName, WebUrl = item.DriveItem.WebUrl });
            }
            return result.ToArray();
        }
    }
}
