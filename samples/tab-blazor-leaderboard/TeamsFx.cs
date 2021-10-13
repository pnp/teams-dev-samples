using Microsoft.Graph;
using Microsoft.JSInterop;
using System;
using System.Threading.Tasks;

namespace TeamsLeaderboard
{
    public class TeamsFx
    {
        private readonly IJSRuntime jsRuntime;
        private readonly IJSObjectReference module;

        public static async Task<TeamsFx> CreateTeamsFx(IJSRuntime jsRuntime)
        {
            var module = await jsRuntime.InvokeAsync<IJSObjectReference>("import", "./teamsfx.js");
            return new TeamsFx(jsRuntime, module);
        }

        public TeamsFx(IJSRuntime jsRuntime, IJSObjectReference module)
        {
            this.jsRuntime = jsRuntime;
            this.module = module;
        }

        public async Task Init(string clientid, string authEndpoint, string tabEndpoint)
        {
            await module.InvokeVoidAsync("initializeTeamsSdk", clientid, authEndpoint, tabEndpoint);
        }
        public class UserInfo
        {
            public string DisplayName { get; set; }
            public string PreferredUserName { get; set; }
            public string ObjectId { get; set; }
        }
        public async Task<UserInfo> GetInfoAsync()
        {
            var user = await module.InvokeAsync<UserInfo>("getUserInfo");
            return user;
        }

        public GraphServiceClient GetGraphServiceClient()
        {
            var client = new GraphServiceClient(new DelegateAuthenticationProvider(async (r) =>
            {
                var accessToken = await GetAuthenticationToken();
                if (accessToken == null)
                {
                    accessToken = await GetAuthenticationToken();
                }
                if (accessToken == null)
                {
                    throw new UnauthorizedAccessException();
                }
                r.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken.Token);
            }));
            return client;
        }

        public class AccessToken
        {
            public string Token { get; set; }
            public string ExpiresOnTimestamp { get; set; }
        }

        public async Task<AccessToken> GetAuthenticationToken()
        {
            AccessToken token;
            try
            {
                token = await module.InvokeAsync<AccessToken>("getToken");
            }
            catch (Exception)
            {
                await module.InvokeVoidAsync("popupLoginPage");
                return null;
            }
            return token;
        }

        public async Task LoadTabConfigJS()
        {
            await jsRuntime.InvokeVoidAsync("eval", "document.getElementById('tab config').appendChild(Object.assign(document.createElement('script'),{src: './tabconfig.js' })); ");
        }
    }
}
