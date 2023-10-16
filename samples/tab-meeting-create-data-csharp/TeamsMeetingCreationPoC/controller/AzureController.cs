using Azure.Data.AppConfiguration;
using Azure.Identity;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TeamsMeetingCreationPoC.controller
{
    internal class AzureController
    {
        private readonly ConfigurationClient _client;
        public AzureController(IConfiguration config)
        {
            string _connectionString = config["AZURE_CONFIG_CONNECTION_STRING"];
            if (_connectionString.StartsWith("Endpoint"))
            {
                _client = new ConfigurationClient(_connectionString);
            }
            else
            {
                _client = new ConfigurationClient(new Uri(_connectionString), new ClientSecretCredential(config["AZURE_TENANT_ID"], config["AZURE_CLIENT_ID"], config["AZURE_CLIENT_SECRET"])); // Better: ManagedIdentityCredential
            }
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
