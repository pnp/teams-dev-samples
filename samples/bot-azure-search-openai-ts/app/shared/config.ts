const config = {
  appBackendEndpoint: process.env.APP_BACKEND_ENDPOINT,
  botId: process.env.BOT_ID,
  botPassword: process.env.BOT_PASSWORD,
  blobConnectionString: process.env.BLOB_STORAGE_CONNECTION_STRING,
  blobContainerName: process.env.BLOB_STORAGE_CONTAINER_NAME,
  env: process.env.TEAMSFX_ENV,
};

export default config;
