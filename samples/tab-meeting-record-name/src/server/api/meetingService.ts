import Axios from "axios";
import express = require("express");
import passport = require("passport");
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from "passport-azure-ad";
import qs = require("qs");
import * as debug from "debug";
import { IRecording } from "../../model/IRecording";
const log = debug("msteams");

export const meetingService = (options: any): express.Router => {
    const router = express.Router();
    const pass = new passport.Passport();
    router.use(pass.initialize());
    const fileUpload = require('express-fileupload');
    router.use(fileUpload({
        createParentPath: true
    }));

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

    const uploadFile = async (file: File, accessToken: string): Promise<any> => {
        const apiUrl = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/drive/root:/${file.name}:/content`
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

    const getDriveItem = async (driveItemId: string, accessToken: string): Promise<any> => {
        const apiUrl = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/drive/items/${driveItemId}?$expand=listItem`;
        return Axios.get(apiUrl, {
            headers: {          
                Authorization: `Bearer ${accessToken}`
            }})
            .then((response) => {
                return response.data;
            }).catch(err => {
                log(err);
                return null;
            });
    };

    const getList = async (accessToken: string): Promise<any> => {
        const apiUrl = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/drive?$expand=list`;
        return Axios.get(apiUrl, {
            headers: {          
                Authorization: `Bearer ${accessToken}`
            }})
            .then((response) => {
                return response.data;
            }).catch(err => {
                log(err);
                return null;
            });
    };

    const updateDriveItem = async (itemID: string, listID: string, meetingID: string, userID: string, userName: string, accessToken: string): Promise<any> => {
        const apiUrl = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/lists/${listID}/items/${itemID}/fields`;
        const fieldValueSet = {
            MeetingID: meetingID,
            UserID: userID,
            UserDispName: userName
        };

        return Axios.patch(apiUrl, 
            fieldValueSet,
            {  headers: {      
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }})
            .then(async (response) => {
                return response.data;
            }).catch(err => {
                log(err);
                return null;
            });
    };

    const getRecordingsPerMeeting = async (meetingID: string, accessToken: string): Promise<IRecording[]> => {
        const listResponse = await getList(accessToken);        
        const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/lists/${listResponse.list.id}/items?$expand=fields($select=id,MeetingID,UserDispName,UserID),driveItem&$filter=fields/MeetingID eq '${meetingID}'`;
        const response = await Axios.get(requestUrl, {
            headers: {          
                Authorization: `Bearer ${accessToken}`,
        }});
        let recordings: IRecording[] = [];
        response.data.value.forEach(element => {
            recordings.push({ 
                            id: element.driveItem.id, 
                            name: element.driveItem.name,
                            username: element.fields.UserDispName,
                            userID: element.fields.UserID });
        });
        return recordings;
    };

    router.post(
        "/upload",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/sites.readwrite.all"]);
                
                const uploadResponse = await uploadFile(req.files.file, accessToken);
                const itemResponse = await getDriveItem(uploadResponse.id, accessToken);
                const listResponse = await getList(accessToken);
                
                const updateResponse = await updateDriveItem(itemResponse.listItem.id, 
                                                            listResponse.list.id,
                                                            req.body.meetingID,
                                                            req.body.userID,
                                                            req.body.userName,
                                                            accessToken);
                res.end("OK");
            }
            catch (ex) {

            }
    });

    router.get("/files/:meetingID",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            const meetingID = req.params.meetingID;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/sites.readwrite.all"]);
                const recordings = await getRecordingsPerMeeting(meetingID, accessToken);
                res.json(recordings);
            }
            catch (err) {
                log(err);
                if (err.status) {
                    res.status(err.status).send(err.message);
                } else {
                    res.status(500).send(err);
                }
            }
    });

    router.get("/audio/:driveItemID",
        pass.authenticate("oauth-bearer", { session: false }),
        async (req: any, res: express.Response, next: express.NextFunction) => {
            const user: any = req.user;
            const driveItemId = req.params.driveItemID;
            try {
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/sites.readwrite.all"]);
                const requestUrl: string = `https://graph.microsoft.com/v1.0/sites/${process.env.SITEID}/drive/items/${driveItemId}/content`;
                const response = await Axios.get(requestUrl, {
                    responseType: 'arraybuffer', // no 'blob' as 'blob' only works in browser
                    headers: {          
                        Authorization: `Bearer ${accessToken}`,
                }});
                res.type("audio/webm");
                res.end(response.data, "binary");
            }
            catch (err) {
                log(err);
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
                const accessToken = await exchangeForToken(user.tid,
                    req.header("Authorization")!.replace("Bearer ", "") as string,
                    ["https://graph.microsoft.com/user.read","https://graph.microsoft.com/user.readbasic.all"]);
                
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
}   