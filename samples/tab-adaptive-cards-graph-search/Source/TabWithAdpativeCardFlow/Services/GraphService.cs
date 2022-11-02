using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using TabWithAdpativeCardFlow.Constants.AdaptiveCards;
using TabWithAdpativeCardFlow.Constants.Search;
using TabWithAdpativeCardFlow.Interfaces;
using TabWithAdpativeCardFlow.Models;
using TabWithAdpativeCardFlow.Models.Search;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using TabWithAdpativeCardFlow.Helpers;

namespace TabWithAdpativeCardFlow.Services
{
    public class GraphService : IGraphService
    {
        protected readonly AppConfigOptions _appconfig;
        protected readonly IGraphHelper graphHelper;
        protected readonly ILogger logger;
        protected GraphServiceClient _graphClient = null;

        public GraphService(IOptions<AppConfigOptions> options, IGraphHelper _graphHelper, ILogger<GraphService> _logger)
        {
            _appconfig = options.Value;
            graphHelper = _graphHelper;
            logger = _logger;

        }
        public void SetAccessToken(string token)
        {
            _graphClient = graphHelper.GetDelegatedServiceClient(token);
        }

        public async Task<User> GetCurrentUserInfo()
        {
            try
            {
                var user = await _graphClient
                .Me
                .Request()
                .GetAsync();

                return user;
            }
            catch (Exception ex)
            {
                logger.LogError($"Graph Service | GetCurrentUserInfo | {ex.Message}");
                return null;
            }
        }

        private async Task<string> GetUserDisplayNameById(string id)
        {
            try
            {
                if (id == null)
                    return "";
                var user = await _graphClient.Users[id].Request().GetAsync();
                if (user != null)
                {
                    return user.DisplayName;
                }
                return "";
            }
            catch(Exception ex)
            {
                logger.LogError($"Graph Service | GetUserDisplayNameById | {ex.Message}");
                return "";
            }
        }

        public async Task<string> GetPublicURLForProfilePhoto(string userId)
        {
            try
            {
                Stream photoresponse = await _graphClient
                            .Users[userId]
                            .Photos["48x48"]
                            .Content
                            .Request()
                            .GetAsync();
                if (photoresponse != null)
                {
                    byte[] bytes = new byte[photoresponse.Length];
                    photoresponse.Read(bytes, 0, (int)photoresponse.Length);

                    if (bytes != null)
                        return "data:image/png;base64," + Convert.ToBase64String(bytes);
                    return Icons.defaultUserImage;
                }
                return Icons.defaultUserImage;
            }
            catch (Exception ex)
            {
                logger.LogError($"Graph Service | GetUserImage | {ex.Message}");
                return Icons.defaultUserImage;
            }
        }

        public async Task<SearchResults> Search(EntityType entityType, string queryString, int from = 0)
        {
            try
            {
                logger.LogInformation("Start searching...");
                var threshold = _appconfig.SearchSizeThreshold;
                var pageSize = _appconfig.SearchPageSize;
                var size = Enumerable.Range(1, threshold).Where(n => n % pageSize == 0).Last();
                var request = new List<SearchRequestObject>()
                {
                    new SearchRequestObject
                    {
                        From =from,
                        Size = size,
                        EntityTypes = new List<EntityType>(){entityType},
                        Query = new SearchQuery
                        {
                            QueryString =$"{QueryTemplates.GetQuery(entityType,queryString)}",
                            
                        },                        
                        Fields = SearchFields.GetFieldsByEntityType(entityType)
                    }
                };

                var searchResult = await
                 _graphClient
                .Search
                .Query(request)
                .Request()
                .PostAsync();

                var hitsContainer = searchResult
                        .CurrentPage
                        .FirstOrDefault()
                        .HitsContainers
                        .FirstOrDefault();

                var total = hitsContainer.Total.Value;
                var moreResultsAvailable = hitsContainer.MoreResultsAvailable.Value;
                var hits = hitsContainer.Hits;

                logger.LogInformation($"Results count: {total}");

                if (hits != null)
                {
                    logger.LogInformation($"Hints count: {hits.Count()}");

                    return new SearchResults
                    {
                        Hits = hits.ToList(),
                        Total = total,
                        EntityType = entityType,
                        From = from,
                        QueryString = queryString,
                        Action = Actions.None,
                        CurrentPage = 1
                    };
                }
                else
                    return null;
            }
            catch (Exception ex)
            {
                logger.LogError($"Graph Service | SearchClients | {ex.Message}");
                return null;
            }
        }

        public async Task<SearchResults> AdvanceSearch(EntityType entityType, FilterData data, int from = 0)
        {
            try
            {
                logger.LogInformation("Start searching...");
                var threshold = _appconfig.SearchSizeThreshold;
                var pageSize = _appconfig.SearchPageSize;
                var size = Enumerable.Range(1, threshold).Where(n => n % pageSize == 0).Last();
                var title = (data.Title != null ? $"filename:{data.Title}" : "");
                var created = (data.Created != null ? $" AND Created:{data.Created}" : "");
                var userDisplayName = await GetUserDisplayNameById(data.UserId);
                var author = data.UserId != null ? $" AND Author:{userDisplayName}" : "";
                var queryString = String.Format("{0}{1}{2}", title , created, author);
                if (queryString.IndexOf(" AND ") == 0)
                    queryString = queryString.RemoveFirstInstanceOfString(" AND ");
                var request = new List<SearchRequestObject>()
                {
                    new SearchRequestObject
                    {
                        From =from,
                        Size = size,
                        EntityTypes = new List<EntityType>(){entityType},
                        Query = new SearchQuery
                        {
                            QueryString =queryString,

                        },
                        Fields = SearchFields.GetFieldsByEntityType(entityType)
                    }
                };

                var searchResult = await
                 _graphClient
                .Search
                .Query(request)
                .Request()
                .PostAsync();

                var hitsContainer = searchResult
                        .CurrentPage
                        .FirstOrDefault()
                        .HitsContainers
                        .FirstOrDefault();

                var total = hitsContainer.Total.Value;
                var moreResultsAvailable = hitsContainer.MoreResultsAvailable.Value;
                var hits = hitsContainer.Hits;

                logger.LogInformation($"Results count: {total}");

                if (hits != null)
                {
                    logger.LogInformation($"Hints count: {hits.Count()}");

                    return new SearchResults
                    {
                        Hits = hits.ToList(),
                        Total = hits.Count(),
                        EntityType = entityType,
                        From = from,
                        QueryString = queryString,
                        Action = Actions.None,
                        CurrentPage = 1
                    };
                }
                else
                    return null;
            }
            catch (Exception ex)
            {
                logger.LogError($"Graph Service | SearchClients | {ex.Message}");
                return null;
            }
        }
    }
}
