using Microsoft.Kiota.Abstractions.Authentication;

namespace MsgextGraphSrchCfg.Helpers
{
    public class TokenProvider : IAccessTokenProvider
    {
        private string _token;
        public TokenProvider(string token) 
        {
            _token = token;
        }
        public Task<string> GetAuthorizationTokenAsync(Uri uri, Dictionary<string, object> additionalAuthenticationContext = default,
            CancellationToken cancellationToken = default)
        {            
            return Task.FromResult(_token);
        }

        public AllowedHostsValidator AllowedHostsValidator { get; }
    }
}
