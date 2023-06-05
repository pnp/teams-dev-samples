const config = {
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  botDomain: process.env.BOT_DOMAIN,
  tenantId: process.env.AAD_APP_TENANT_ID,
  authorityHost: process.env.AAD_APP_OAUTH_AUTHORITY_HOST,
  clientId: process.env.AAD_APP_CLIENT_ID,  
  clientSecret: process.env.AAD_APP_CLIENT_SECRET,  
  siteId: process.env.SP_SITE_ID,
  listId: process.env.SP_LIST_ID
};

export default config;
