import express = require("express");
import passport = require("passport");
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from "passport-azure-ad";
import qs = require("querystring");
import Axios from "axios";
import * as debug from "debug";
const log = debug("msteams");
import Utilities from "./Utilities";

export const graphRouter = (options: any): express.Router => {
    const router = express.Router();
    const fileUpload = require('express-fileupload');
    const pass = new passport.Passport();
    router.use(pass.initialize());
    router.use(fileUpload({
        createParentPath: true
    }));

    const bearerStrategy = new BearerStrategy({
        identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
        clientID: process.env.PDFUPLOADER_APP_ID as string,
        audience: `api://${process.env.HOSTNAME}/${process.env.PDFUPLOADER_APP_ID}` as string,
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
                client_id: process.env.PDFUPLOADER_APP_ID,
                client_secret: process.env.PDFUPLOADER_APP_SECRET,
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

    const uploadTmpFileToOneDrive = async (file: File, accessToken: string): Promise<string> => {
      const apiUrl = `https://graph.microsoft.com/v1.0/me//drive/root:/TempUpload/${file.name}:/content`;
      const response = await uploadFile(apiUrl, file, accessToken);  
      const fileID = response.id;
      return fileID;
    };
    const uploadFile = async (apiUrl: string, file: File, accessToken: string): Promise<any> => {
      if (file.size <(4 * 1024 * 1024)) {
        const fileBuffer = file as any; 
        return Axios.put(apiUrl, fileBuffer.data, {
                    headers: {          
                        Authorization: `Bearer ${accessToken}`
                    }})
                    .then(response => {
                        log(response);
                        return response.data;
                    }).catch(err => {
                        log(err);
                        return null;
                    });
      }
      else {
        // File.size>4MB, refer to https://mmsharepoint.wordpress.com/2020/01/12/an-outlook-add-in-with-sharepoint-framework-spfx-storing-mail-with-microsoftgraph/
        return null;
      }
    };
    const downloadTmpFileAsPDF = async (fileID: string, fileName: string, accessToken: string): Promise<any> => {
      const apiUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}/content?format=PDF`; //
      return Axios.get(apiUrl, {
                      responseType: 'arraybuffer', // no 'blob' as 'blob' only works in browser
                      headers: {          
                          Authorization: `Bearer ${accessToken}`
                      }})
                      .then(response => {
                          log(response.data);
                          const respFile = { data: response.data, name: fileName, size: response.data.length };
                          return respFile;
                      }).catch(err => {
                          log(err);
                          return null;
                      });
    };
    const uploadFileToTargetSite = async (file: File, accessToken: string, domain: string, siteRelative: string, channelName: string): Promise<string> => {
      const apiSiteUrl =`https://graph.microsoft.com/v1.0/sites/${domain}:/${siteRelative}`;
      return Axios.get(apiSiteUrl, {        
                headers: {          
                    Authorization: `Bearer ${accessToken}`
                }})
                .then(async siteResponse => {
                    log(siteResponse.data);
                    const apiUrl = `https://graph.microsoft.com/v1.0/sites/${siteResponse.data.id}/drive/root:/${channelName}/${file.name}:/content`;
                    const response = await uploadFile(apiUrl, file, accessToken);
                    const webUrl = response.webUrl;
                    return webUrl;
                }).catch(err => {
                    log(err);
                    return null;
                });
    };
    const deleteTmpFileFromOneDrive = async (fileID: string, accessToken: string) => {
        const apiUrl = `https://graph.microsoft.com/v1.0/me/drive/items/${fileID}`;
        Axios.delete(apiUrl, {        
            headers: {          
                Authorization: `Bearer ${accessToken}`
            }});
    };
    router.post(
        "/upload",
        pass.authenticate("oauth-bearer", { session: false }),        
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/files.readwrite","https://graph.microsoft.com/sites.readwrite.all"]);
                const tmpFileID = await uploadTmpFileToOneDrive(req.files.file, accessToken);
                const filename = Utilities.getFileNameAsPDF(req.files.file.name);
                const pdfFile = await downloadTmpFileAsPDF(tmpFileID, filename, accessToken);
                const webUrl = await uploadFileToTargetSite(pdfFile, accessToken, req.body.domain, req.body.sitepath, req.body.channelname);
                deleteTmpFileFromOneDrive(tmpFileID, accessToken);
                res.end(webUrl);
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
