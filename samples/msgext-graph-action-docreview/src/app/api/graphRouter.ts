import express = require('express');
import passport = require('passport');
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from 'passport-azure-ad';
import Axios from 'axios';
import qs = require('querystring');
import * as debug from 'debug';
import { IDocument } from "../../model/IDocument";
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

  const exchangeForToken = (tid: string, token: string, scopes: string[]): Promise<string> => {
    return new Promise((resolve, reject) => {
        const url = `https://login.microsoftonline.com/${tid}/oauth2/v2.0/token`;
        const params = {
            client_id: process.env.GRAPH_APP_ID,
            client_secret: process.env.GRAPH_APP_SECRET,
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
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        const user: any = req.user;
        const today = new Date().toISOString().substr(0,10);
        const siteID = process.env.SITE_ID;
        const listID = process.env.LIST_ID;
        const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${siteID}/lists/${listID}/items?$filter=fields/NextReview lt '${today}'&expand=fields`;
        
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
                      description: element.fields.Description0,
                      author: element.createdBy.user.displayName,
                      url: element.webUrl,
                      id: element.id,
                      modified: new Date(element.lastModifiedDateTime),
                      nextReview: new Date(element.fields.NextReview)
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