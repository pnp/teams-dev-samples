const config = {
  initiateLoginEndpoint: process.env.REACT_APP_START_LOGIN_PAGE_URL,
  clientId: process.env.REACT_APP_CLIENT_ID,
  apiEndpoint: process.env.REACT_APP_FUNC_ENDPOINT,
  apiName: process.env.REACT_APP_FUNC_NAME,

  FRS_local:false,
  FRS_TokenProviderURL:"https://your AZFunction.azurewebsites.net/api/GetToken",
  FRS_TenantId: "ed0cda0d-your guid-4c57505481f0",
  FRS_Endpoint:"https://eu.fluidrelay.azure.com"
};

export default config;
