import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import express = require("express");
import passport = require('passport');
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from 'passport-azure-ad';
import qs = require("qs");
import * as debug from 'debug';
import { IDocument } from "../../model/IDocument";
import Utilities from "./Utilities";
import { Config } from "../../model/Config";
const log = debug('graphRouter');

export const graphRouter = (options: any): express.Router =>  {
  const router = express.Router();
  
    // Set up the Bearer Strategy
  const bearerStrategy = new BearerStrategy({
      identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
      clientID: process.env.GRAPH_APP_ID as string,
      audience: `api://${process.env.HOSTNAME}/${process.env.GRAPH_APP_ID}`,
      loggingLevel: "info",
      loggingNoPII: false,
      validateIssuer: false,
      passReqToCallback: false
  } as IBearerStrategyOption,
      (token: ITokenPayload, done: VerifyCallback) => {
          done(null, { tid: token.tid, name: token.name, upn: token.upn }, token);
      }
  );
  const pass = new passport.Passport();
  router.use(pass.initialize());
  pass.use(bearerStrategy);
  
  const exchangeForToken = async (tid: string, token: string, scopes: string[]): Promise<string> => {
    const appSecret = await Utilities.getSecret("TeamsAzureConfig-GRAPHAPPSECRET");
    return new Promise((resolve, reject) => {
        const url = `https://login.microsoftonline.com/${tid}/oauth2/v2.0/token`;
        const params = {
            client_id: process.env.GRAPH_APP_ID,
            client_secret: appSecret, // process.env.GRAPH_APP_SECRET,
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: token,
            requested_token_use: "on_behalf_of",
            scope: scopes.join(" ")
        };

        Axios.post(url,
            qs.stringify(params), {
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }).then(result => {
            if (result.status !== 200) {
                reject(result);
                log(result.statusText);
            } else {
                resolve(result.data.access_token);
            }
        }).catch(err => {
            // error code 400 likely means you have not done an admin consent on the app
            log(err.response.data);
            reject(err);
        });
    });
  };
  const getFilesBySite = async (accessToken: string, config: Config): Promise<IDocument[]> => {
    if (config.SiteID === "") {
      config.SiteID = process.env.SITE_ID!;
    }
    if (config.ListID === "") {
      config.ListID = process.env.LIST_ID!;
    }
    const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${config.SiteID}/lists/${config.ListID}/items?$expand=fields`;
    const response = await Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${accessToken}`
      }
    });    
    let docs: IDocument[] = [];
    response.data.value.forEach(element => {
      docs.push({
        name: element.fields.FileLeafRef,
        author: element.createdBy.user.displayName,
        url: element.webUrl,
        id: element.id,
        modified: new Date(element.lastModifiedDateTime)
      });
    });                                            
    return docs;
  };
  const getFilesBySearch = async (accessToken: string, searchQuery: string): Promise<IDocument[]> => {
    const requestUrl = `https://graph.microsoft.com/v1.0/search/query`;
    const reqeustBody = {
      requests: [
          {
              entityTypes: [
                  "listItem"
              ],
              query: {
                  "queryString": searchQuery,
              },
              fields: [
                  "title",
                  "ListItemId",
                  "ListID",
                  "Filename",
                  "WebUrl",
                  "SiteID",
                  "WebId",                  
                  "Author",
                  "LastModifiedTime"
              ]
          }
      ]
    };
    const config: AxiosRequestConfig = {  headers: {      
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }};
    try {
      const response = await Axios.post(requestUrl, reqeustBody, config);
      let docs: IDocument[] = [];
      console.log(response.data.value[0].hitsContainers[0].hits);
      response.data.value[0].hitsContainers[0].hits.forEach(element => {
        docs.push({
          name: element.resource.fields.filename,
          author: element.resource.fields.author ? element.resource.fields.author.split(";")[0] : "",
          url: element.resource.webUrl,
          id: element.resource.fields.listItemId,
          modified: new Date(element.resource.fields.lastModifiedTime)
        });
      });
      return docs;
    }
    catch (err) {
      log(err);
      return [];
    }
  };
  router.get(
    "/files",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      const config = await Utilities.retrieveConfig();        
      try {
        const accessToken = await exchangeForToken(user.tid,
            req.header("Authorization")!.replace("Bearer ", "") as string,
            ["https://graph.microsoft.com/user.read"]);
        let docs: IDocument[] = [];
        if (config.UseSearch) {
          const query = config.SearchQuery && config.SearchQuery !== "" ? config.SearchQuery : "*";
          docs = await getFilesBySearch(accessToken, query);
        }
        else {
          docs = await getFilesBySite(accessToken, config);
        }
        res.json(docs);
      } catch (err) {
        if (err.status) {
            res.status(err.status).send(err.message);
        } else {
            res.status(500).send(err);
        }
      }
    });
    return router;
  }