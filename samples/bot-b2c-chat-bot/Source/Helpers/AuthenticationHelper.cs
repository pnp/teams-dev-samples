// <copyright file="AuthenticationHelper.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Helpers
{
    using System;
    using System.Net.Http;
    using System.Net.Http.Headers;
    using System.Text;
    using System.Threading.Tasks;
    using Microsoft.Extensions.Configuration;
    using Newtonsoft.Json;

    /// <summary>
    /// Helper for authentication flow.
    /// </summary>
    public static class AuthenticationHelper
    {
        /// <summary>
        /// Azure Client Id.
        /// </summary>
        private static readonly string ClientIdConfigurationSettingsKey = "AzureAd:AppId";

        /// <summary>
        /// Azure Tenant Id.
        /// </summary>
        private static readonly string TenantIdConfigurationSettingsKey = "AzureAd:TenantId";

        /// <summary>
        /// Azure AppSecret .
        /// </summary>
        private static readonly string AppsecretConfigurationSettingsKey = "AzureAd:AppSecret";

        /// <summary>
        /// Azure Url .
        /// </summary>
        private static readonly string AzureInstanceConfigurationSettingsKey = "AzureAd:Instance";

        /// <summary>
        /// Azure Authorization Url .
        /// </summary>
        private static readonly string AzureAuthUtrlConfigurationSettingsKey = "AzureAd:AuthUrl";

        /// <summary>
        /// Get token using client credentials flow.
        /// </summary>
        /// <param name="configuration">IConfiguration instance.</param>
        /// <param name="clientFactory">IHttpClientFactory instance.</param>
        /// <returns>App access token.</returns>
        public static async Task<string> GetAccessTokenAsync(IConfiguration configuration, IHttpClientFactory clientFactory)
        {
            var body = $"grant_type=client_credentials&client_id={configuration[ClientIdConfigurationSettingsKey]}@{configuration[TenantIdConfigurationSettingsKey]}&client_secret={configuration[AppsecretConfigurationSettingsKey]}&scope=https://graph.microsoft.com/.default";
            string accessToken;
            try
            {
                var client = clientFactory.CreateClient("GraphWebClient");
                string responseBody;
                using (var request = new HttpRequestMessage(HttpMethod.Post, configuration[AzureInstanceConfigurationSettingsKey] + configuration[TenantIdConfigurationSettingsKey] + configuration[AzureAuthUtrlConfigurationSettingsKey]))
                {
                    request.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                    request.Content = new StringContent(body, Encoding.UTF8, "application/x-www-form-urlencoded");
                    using HttpResponseMessage response = await client.SendAsync(request);
                    if (response.IsSuccessStatusCode)
                    {
                        responseBody = await response.Content.ReadAsStringAsync();
                    }
                    else
                    {
                        responseBody = await response.Content.ReadAsStringAsync();
                        throw new Exception(responseBody);
                    }
                }

                accessToken = JsonConvert.DeserializeObject<dynamic>(responseBody).access_token;
            }
            catch (Exception)
            {
                throw;
            }

            return accessToken;
        }
    }
}
