using Microsoft.Graph;
using TabWithAdpativeCardFlow.Models;
using TabWithAdpativeCardFlow.Models.Search;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace TabWithAdpativeCardFlow.Interfaces
{
    public interface IGraphService
    {
        void SetAccessToken(string token);
        Task<User> GetCurrentUserInfo();
        Task<string> GetPublicURLForProfilePhoto(string applicationBaseUrl);
        Task<SearchResults> Search(EntityType entityTypes, string queryString, int from = 0);
        Task<SearchResults> AdvanceSearch(EntityType entityType, FilterData data, int from = 0);
    }
}
