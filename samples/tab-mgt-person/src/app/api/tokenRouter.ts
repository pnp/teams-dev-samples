import express = require("express");
import passport = require("passport");
import { BearerStrategy, IBearerStrategyOption, ITokenPayload, VerifyCallback } from "passport-azure-ad";
import qs = require("querystring");
import Axios from "axios";
import * as debug from "debug";
const log = debug("msteams");

export const tokenRouter = (options: any): express.Router => {
    const router = express.Router();
    const pass = new passport.Passport();
    router.use(pass.initialize());

    const bearerStrategy = new BearerStrategy({
        identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
        clientID: process.env.TAB_APP_ID as string,
        audience: `api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}` as string,
        loggingLevel: "warn",
        validateIssuer: false,
        passReqToCallback: false
    } as IBearerStrategyOption,
        (token: ITokenPayload, done: VerifyCallback) => {
            done(null, { tid: token.tid, name: token.name, upn: token.upn }, token);
        }
    );
    pass.use(bearerStrategy);

    const exchangeForToken = (tid: string, token: string, scopes: string[]): Promise<string> => {
        return new Promise((resolve, reject) => {
            const url = `https://login.microsoftonline.com/${tid}/oauth2/v2.0/token`;
            const params = {
                client_id: process.env.TAB_APP_ID,
                client_secret: process.env.TAB_APP_SECRET,
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
                } else {
                    resolve(result.data.access_token);
                }
            }).catch(err => {
                // error code 400 likely means you have not done an admin consent on the app
                reject(err);
            });
        });
    };

    router.get(
        "/accesstoken",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/user.read","https://graph.microsoft.com/people.read"]);
                
                res.json({ access_token: accessToken});
            } catch (err) {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    res.status(500).send(err);
                }
            }
        });
    router.post(
        "/token",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: express.Request, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            try {
                log(req.query.ssoToken);
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/user.read","https://graph.microsoft.com/people.read"]);
                
                res.json({ access_token: accessToken});
            } catch (err) {
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    res.status(500).send(err);
                }
            }
        });
    return router;
};