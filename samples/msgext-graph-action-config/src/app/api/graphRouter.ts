import Axios from "axios";
import express = require("express");
import passport = require('passport');
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from 'passport-azure-ad';
import qs = require("qs");
import * as debug from 'debug';
import { IDocument } from "../../model/IDocument";
import Utilities from "./Utilities";
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
  router.get(
      "/files",
      pass.authenticate("oauth-bearer", { session: false }),
      async (req: any, res: express.Response, next: express.NextFunction) => {
        const user: any = req.user;
        const config = await Utilities.retrieveConfig();
        if (config.SiteID === "") {
          config.SiteID = process.env.SITE_ID!;
        }
        if (config.ListID === "") {
          config.ListID = process.env.LIST_ID!;
        }
        
        const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${config.SiteID}/lists/${config.ListID}/items?$expand=fields`;
        
        try {
          const accessToken = await exchangeForToken(user.tid,
              req.header("Authorization")!.replace("Bearer ", "") as string,
              ["https://graph.microsoft.com/user.read"]);
          log(accessToken);
          Axios.get(requestUrl, {
            headers: {          
                Authorization: `Bearer ${accessToken}`
            }})
            .then(response => {
                let docs: IDocument[] = [];
                console.log(response.data.value);
                response.data.value.forEach(element => {
                  docs.push({
                    name: element.fields.FileLeafRef,
                    author: element.createdBy.user.displayName,
                    url: element.webUrl,
                    id: element.id,
                    modified: new Date(element.lastModifiedDateTime)
                  });
                });                                            
                res.json(docs);
          }).catch(err => {
              res.status(500).send(err);
          });
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