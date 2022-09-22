import Axios from "axios";
import express = require("express");
import passport = require("passport");
import { BearerStrategy, VerifyCallback, IBearerStrategyOption, ITokenPayload } from "passport-azure-ad";
import qs = require("qs");
import * as debug from "debug";
import { IFolder } from "../../model/IFolder";
import { IMail } from "../../model/IMail";
import { createMailFileName } from "./utilities";
const log = debug("msteams");

export const graphService = (options: any): express.Router => {
  const metadataExtensionName = "mmsharepoint.onmicrosoft.MailStorage";
  const router = express.Router();
  const pass = new passport.Passport();
  router.use(pass.initialize());
  
  const bearerStrategy = new BearerStrategy({
    identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    clientID: process.env.TAB_APP_ID as string,
    audience: process.env.TAB_APP_ID as string, // `api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}` as string,
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
          reject(err); // error code 400 likely means you have not done an admin consent on the app
      });
    });
  };

  const getMails = async (accessToken: string): Promise<IMail[]> => {     
    let requestUrl: string = `https://graph.microsoft.com/v1.0/me/messages?$top=10&$skip=0&$select=id,from,subject,receivedDateTime,hasAttachments&$orderby=receivedDateTime desc`;
    requestUrl += "&$expand=Extensions($filter=id+eq+'Microsoft.OutlookServices.OpenTypeExtension.mmsharepoint.onmicrosoft.MailStorage')"
    const response = await Axios.get(requestUrl, {
        headers: {          
            Authorization: `Bearer ${accessToken}`,
    }});
    let mails: IMail[] = [];
    response.data.value.forEach(element => {
      mails.push({ 
                  id: element.id,
                  from: element.from.emailAddress.name,
                  subject: element.subject,
                  hasAttachments: element.hasAttachments,
                  receivedDateTime: element.receivedDateTime,
                  alreadyStored: element.extensions !== 'undefined' && element.extensions !== null && element.extensions.length > 0,
                  savedUrl: element.extensions !== 'undefined' && element.extensions !== null && element.extensions.length > 0 ? element.extensions[0].saveUrl : "",
                  savedDisplayName: element.extensions !== 'undefined' && element.extensions !== null && element.extensions.length > 0 ? element.extensions[0].saveDisplayName : "",
                  savedDate: element.extensions !== 'undefined' && element.extensions !== null && element.extensions.length > 0 ? element.extensions[0].savedDate : "" });
    });
    return mails;
  };

  const saveMail = async (driveID: string, folderID: string, mailId: string, mailSubject: string, accessToken: string) => {
    const mailMIMEContent = await getMailContent(mailId, accessToken);
    const fileName = createMailFileName(mailSubject);
    let mailDriveItem: any = null;
    if (mailMIMEContent.length < (4 * 1024 * 1024)) {     // If Mail size bigger 4MB use resumable upload
      mailDriveItem = await storeMail2OneDrive(driveID, folderID, mailMIMEContent, fileName, accessToken);
      log(mailDriveItem);
    }
    else {
      mailDriveItem = await saveBigMail(driveID, folderID, mailMIMEContent, fileName, accessToken);
    }
    if (mailDriveItem && mailDriveItem.name && mailDriveItem.webUrl && mailDriveItem.createdDateTime) {
      saveMailMetadata(mailId, mailDriveItem.name, mailDriveItem.webUrl, accessToken);
    }
  };

  const getMailContent = async (mailId: string, accessToken: string) => {
    const requestUrl: string = `https://graph.microsoft.com/v1.0/me/messages/${mailId}/$value`;
    const response = await Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
      },
      responseType: "text"
    });

    return response.data;
  };

  const storeMail2OneDrive = async (driveID: string, folderID: string, mailContent: string, fileName: string, accessToken: string) => {
    let requestUrl: string = `https://graph.microsoft.com/v1.0/`;
    if (driveID === "*" && folderID === "*") {
      requestUrl += `me/drive/root:/${fileName}.eml:/content`;
    }
    else {
      requestUrl += `drives/${driveID}/items/${folderID}:/${fileName}.eml:/content`;
    }
    
    const response = await Axios.put(requestUrl, mailContent,
      {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
      }
    });

    return response.data;
  };

  const saveBigMail = async (driveID: string, folderID: string, mimeStream: string, fileName: string, accessToken: string) => {
    const sessionOptions = {
      "item": {
        "@microsoft.graph.conflictBehavior": "rename"
      }
    };
    let requestUrl = `https://graph.microsoft.com/v1.0/drives/${driveID}/`;
    requestUrl += driveID !== folderID ? `items/${folderID}:/${fileName}.eml:/createUploadSession` : `root:/${fileName}.eml:/createUploadSession`;
    const response = await Axios.post(requestUrl, sessionOptions,
      {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
      }
    });
    const resp = await uploadMailSlices(mimeStream, response.data.uploadUrl);
    return resp.data;   
  };

  const uploadMailSlices = async (mimeStream: string, uploadUrl: string) => {
    let minSize=0;
    let maxSize=5*327680; // 5*320kb slices --> MUST be a multiple of 320 KiB (327,680 bytes)
    while(mimeStream.length > minSize) {
      const fileSlice = mimeStream.slice(minSize, maxSize);
      const resp = await uploadMailSlice(uploadUrl, minSize, maxSize, mimeStream.length, fileSlice);
      minSize = maxSize;
      maxSize += 5*327680;
      if (maxSize > mimeStream.length) {
        maxSize = mimeStream.length;
      }
      if (resp.id !== undefined) {
        return resp;
      } 
      else {
        
      }
    }
  };

  const uploadMailSlice = async (uploadUrl: string, minSize: number, maxSize: number, totalSize: number, fileSlice: string) => {
    // Here no authorization anymore, only in createUploadSession!
    const header = {
      "Content-Length": `${maxSize - minSize}`,
      "Content-Range": `bytes ${minSize}-${maxSize-1}/${totalSize}`
    };
    const response = await Axios.put(uploadUrl, fileSlice,
    {
      headers: header
    });
    return response.data;
  };

  const saveMailMetadata = async (mailId: string, displayName: string, url: string, accessToken: string) => {
    const savedDate: Date = new Date();
    const metadataBody = {
      "@odata.type" : "microsoft.graph.openTypeExtension",
      "extensionName" : metadataExtensionName,
      "saveDisplayName" : displayName,
      "saveUrl" : url,
      "savedDate" : savedDate.toISOString()
    };
    let requestUrl = `https://graph.microsoft.com/v1.0/me/messages/${mailId}/extensions`;
    
    const response = await Axios.post(requestUrl, metadataBody,
      {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
      }
    }); 
  };

  const getJoinedTeams = async (accessToken: string): Promise<IFolder[]> => {
    let requestUrl: string = "https://graph.microsoft.com/v1.0/me/joinedTeams?$select=id, displayName";

    const response = await Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
    }});
    let teams: IFolder[] = [];
    response.data.value.forEach(item => {
      teams.push({ 
        id: item.id, name: item.displayName, driveID: item.id, parentFolder: null
      });
    });
    return teams;
  };

  const getTeamRootFolders = async (teamID: string, teamName: string, accessToken: string): Promise<IFolder[]> => {
    let requestUrl: string = `https://graph.microsoft.com/v1.0/groups/${teamID}/drive/root/children?$filter=folder ne null&$select=id, name, parentReference`;

    const response = await Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
    }});
    let teams: IFolder[] = [];
    response.data.value.forEach(item => {
      teams.push({ 
        id: item.id, name: item.name, driveID: item.parentReference.driveId, parentFolder: { id: teamID, driveID: teamID, name: teamName, parentFolder: null}
      });
    });
    return teams;
  };
  
  const getFolder = async (driveId: string, folderId: string, accessToken: string): Promise<IFolder[]> => {
    let requestUrl: string = "https://graph.microsoft.com/v1.0/";
    let folder: IFolder|null = null;
    if (folderId === "*" || driveId === "*") {
      requestUrl += `me/drive/root/children`;
      folder = { id: folderId, driveID: driveId, name: "", parentFolder: null };
    }
    else {
      requestUrl += `drives/${driveId}/items/${folderId}/children`;
    }
    requestUrl += `?$filter=folder ne null&$select=id, name, parentReference`;
    const response = await Axios.get(requestUrl, {
      headers: {          
          Authorization: `Bearer ${accessToken}`,
    }});
    let folders: IFolder[] = [];
    response.data.value.forEach(item => {
      folders.push({ 
        id: item.id, name: item.name, driveID: item.parentReference.driveId, parentFolder: folder
      });
    });
    return folders;
  };

  router.get("/mails",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      try {
        const accessToken = await exchangeForToken(user.tid,
          req.header("Authorization")!.replace("Bearer ", "") as string,
          ["https://graph.microsoft.com/mail.read"]);
        const mails = await getMails(accessToken);
        res.json(mails);
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

  router.get("/joinedTeams",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      try {
        const accessToken = await exchangeForToken(user.tid,
          req.header("Authorization")!.replace("Bearer ", "") as string,
          ["https://graph.microsoft.com/team.readbasic.all"]);
        const joinedTeams = await getJoinedTeams(accessToken);
        res.json(joinedTeams);
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

  router.get("/TeamRootFolders/:teamId/:teamName",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      try {
        const accessToken = await exchangeForToken(user.tid,
          req.header("Authorization")!.replace("Bearer ", "") as string,
          ["https://graph.microsoft.com/sites.readwrite.all"]);
        const teamId = req.params.teamId;
        const teamName = req.params.teamName;

        const rootFolders = await getTeamRootFolders(teamId, teamName, accessToken);
        res.json(rootFolders);
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

  router.get("/folders/:driveId/:folderId",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      try {
        const accessToken = await exchangeForToken(user.tid,
          req.header("Authorization")!.replace("Bearer ", "") as string,
          ["https://graph.microsoft.com/files.readwrite"]);
        const driveId = req.params.driveId;
        const folderId = req.params.folderId;
        const folders = await getFolder(driveId, folderId, accessToken);
        res.json(folders);
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

  router.post("/mail/:mailID/:mailSubject/:driveId/:folderId",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: any, res: express.Response, next: express.NextFunction) => {
      const user: any = req.user;
      try {
        const accessToken = await exchangeForToken(user.tid,
          req.header("Authorization")!.replace("Bearer ", "") as string,
          ["https://graph.microsoft.com/mail.readwrite", "https://graph.microsoft.com/files.readwrite", "https://graph.microsoft.com/sites.readwrite.all"]);
        const mailId = req.params.mailID;
        const mailSubject = req.params.mailSubject;
        const driveId = req.params.driveId;
        const folderId = req.params.folderId;
        saveMail(driveId, folderId, mailId, mailSubject, accessToken);
        
        res.json({});
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

  return router;
}     