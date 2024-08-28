/* This code sample provides a starter kit to implement server side logic for your Teams App in TypeScript,
 * refer to https://docs.microsoft.com/en-us/azure/azure-functions/functions-reference for complete Azure Functions
 * developer guide.
 */

// Import polyfills for fetch required by msgraph-sdk-javascript.
import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import {
  OnBehalfOfCredentialAuthConfig,
  OnBehalfOfUserCredential,
  UserInfo,
} from "@microsoft/teamsfx";
import config from "../config";
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { Client } from "@microsoft/microsoft-graph-client";
import { exchangeForToken, getSPOToken } from "../services/tokenService";
import { ensureSPOUserByLogin, getWeb } from "../services/spoService";
import { EnsureRequest } from "../../model/EnsureRequest";

/**
 * This function handles requests from teamsapp client.
 * The HTTP request should contain an SSO token queried from Teams in the header.
  
 * @param {InvocationContext} context - The Azure Functions context object.
 * @param {HttpRequest} req - The HTTP request.
 */
export async function getSPOUser(
  req: HttpRequest,
  context: InvocationContext
): Promise<HttpResponseInit> {
  context.log("HTTP trigger function processed a request.");

  // Initialize response.
  const res: HttpResponseInit = {
    status: 200,
  };
  const body = Object();

  const reqBodyTxt = await req.text();
  const reqBodyJsn = JSON.parse(reqBodyTxt) as EnsureRequest; 
  // Prepare access token.
  const accessToken: string = req.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!accessToken) {
    return {
      status: 400,
      body: JSON.stringify({
        error: "No access token was found in request header.",
      }),
    };
  }

  const oboAuthConfig: OnBehalfOfCredentialAuthConfig = {
    authorityHost: config.authorityHost,
    clientId: config.clientId,
    tenantId: config.tenantId,
    clientSecret: config.clientSecret,
  };

  let oboCredential: OnBehalfOfUserCredential;
  try {
    oboCredential = new OnBehalfOfUserCredential(accessToken, oboAuthConfig);
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: JSON.stringify({
        error:
          "Failed to construct OnBehalfOfUserCredential using your accessToken. " +
          "Ensure your function app is configured with the right Microsoft Entra App registration.",
      }),
    };
  }

  try {
    const scopes: string[] = ["https://graph.microsoft.com/.default", "offline_access"];
    // Create an instance of the TokenCredentialAuthenticationProvider by passing the tokenCredential instance and options to the constructor
    const authProvider = new TokenCredentialAuthenticationProvider(oboCredential, {
      scopes: scopes,
    });
    const authToken = await exchangeForToken(config.tenantId, accessToken, scopes);

    const spoToken = await getSPOToken(config.spoScope, authToken.refreshToken);

    // Initialize Graph client instance with authProvider
    const graphClient = Client.initWithMiddleware({
      authProvider: authProvider,
    });
    const groupRequestUrl = `/groups/${reqBodyJsn.groupId}/sites/root`; 
    const site = await graphClient.api(groupRequestUrl).get();
    // const web = await getWeb(spoToken, site.webUrl);
    const user = await ensureSPOUserByLogin(spoToken, reqBodyJsn.userLogin, site.webUrl);
    body.user = site.user;
  } catch (e) {
    context.error(e);
    return {
      status: 500,
      body: JSON.stringify({
        error:
          "Failed to retrieve user profile from Microsoft Graph. The application may not be authorized.",
      }),
    };
  }
  
  res.body = JSON.stringify(body);

  return res;
}

app.http("getSPOUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  handler: getSPOUser,
});

