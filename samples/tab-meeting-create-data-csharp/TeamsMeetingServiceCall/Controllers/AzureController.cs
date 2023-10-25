using Azure.Data.AppConfiguration;
using Azure.Identity;

namespace TeamsMeetingServiceCall.controller
{
    internal class AzureController
    {
        private readonly ConfigurationClient _client;
        public AzureController(string _connectionString)
        {
            if (_connectionString.StartsWith("Endpoint"))
            {
                _client = new ConfigurationClient(_connectionString);
            }
            //else
            //{
            //    _client = new ConfigurationClient(new Uri(_connectionString), new ClientSecretCredential(config["AZURE_TENANT_ID"], config["AZURE_CLIENT_ID"], config["AZURE_CLIENT_SECRET"])); // Better: ManagedIdentityCredential
            //}
        }

        public void storeConfigValue(string key, string value)
        {
            _client.SetConfigurationSetting(key, value);
        }
        public string GetConfigurationValue(string key)
        {
            var configValue = _client.GetConfigurationSetting(key);
            if (configValue != null)
            {
                return configValue.Value.Value;
            }
            else { return ""; }
        }
    }
}
