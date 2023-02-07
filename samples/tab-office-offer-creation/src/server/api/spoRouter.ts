import Axios from "axios";
import express = require("express");
import passport = require("passport");
import { BearerStrategy, IBearerStrategyOption, ITokenPayload, VerifyCallback } from "passport-azure-ad";
import qs = require("qs");
import { IOffer } from '../../model/IOffer';
import * as debug from "debug";

// Initialize debug logging module
const log = debug("spoRouter");

export const spoRouter = (options: any): express.Router => {
  const router = express.Router();

  // Set up the Bearer Strategy
  const bearerStrategy = new BearerStrategy({
    identityMetadata: "https://login.microsoftonline.com/common/v2.0/.well-known/openid-configuration",
    clientID: process.env.TAB_APP_ID as string,
    audience: `api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}`,
    loggingLevel: "warn",
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
  
  /**
   * This function creates an access token to be used with SPO Rest Api
   * @param tenantName Name
   * @param token The id or bootstrap token to exchange to an access token
   * @param scope scope such as https://domain.sharepoint.com/sites.read.all
   * @returns accessToken as string
   */
  const exchangeForToken = (tenantName: string, token: string, scope: string): Promise<{accessToken: string}> => {
    return new Promise((resolve, reject) => {
      const url = `https://login.microsoftonline.com/${tenantName}/oauth2/v2.0/token`;
      const params = {
        client_id: process.env.TAB_APP_ID,
        client_secret: process.env.TAB_APP_SECRET,
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: token,
        requested_token_use: "on_behalf_of",
        scope: scope
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
          resolve({accessToken: result.data.access_token});
        }
      }).catch(err => {
        // error code 400 likely means you have not done an admin consent on the app
        log(err);
        reject(err);
      });
    });
  };
  
  const loadTemplate = async (spoAccessToken: string, offer: IOffer, siteUrl: string, teamSiteRelativeUrl: string): Promise<any> => {
    const requestUrl: string = `${siteUrl}/_api/web/GetFileByServerRelativeUrl('${teamSiteRelativeUrl}/_cts/Offering/Offering.dotx')/OpenBinaryStream()`;

    return Axios.get(requestUrl,
      {
        responseType: 'arraybuffer', // no 'blob' as 'blob' only works in browser
        headers: {          
            Authorization: `Bearer ${spoAccessToken}`
        }
      })
      .then(response => {
        const respFile = { data: response.data, name: `${offer.title}.docx`, size: response.data.length };
        return respFile;      
      }).catch(err => {
        log(err);
      });
  };

  const createOfferFile = async (spoAccessToken: string, siteUrl: string, teamSiteRelativeUrl: string, file: any): Promise<any> => {
    const uploadUrl = `${siteUrl}/_api/web/GetFolderByServerRelativeUrl('${teamSiteRelativeUrl}/Shared Documents')/files/add(overwrite=true,url='${file.name}')` ;

    return Axios.post(uploadUrl, file.data,
      {
        headers: {          
            Authorization: `Bearer ${spoAccessToken}`,
            "Content-Length": file.size,
            "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        }
      })
      .then(response => {
        return response.data;      
      }).catch(err => {
        log(err);
      });
  };

  const getFileListItem = async (spoAccessToken: string, siteUrl: string, teamSiteRelativeUrl: string, fileName: string): Promise<any> => {
    const requestUrl = `${siteUrl}/_api/web/GetFileByServerRelativeUrl('${teamSiteRelativeUrl}/Shared Documents/${fileName}')/ListItemAllFields`;

    return Axios.get(requestUrl,
      {
        headers: {          
            Authorization: `Bearer ${spoAccessToken}`
        }
      })
      .then(response => {
        const itemID = response.data.ID;
        return { id: itemID, type: response.data["odata.type"] }; // ServerRedirectedEmbedUri  
      }).catch(err => {
        log(err);
      });
  };

  const updateFileListItem = async (spoAccessToken: string, siteUrl: string, teamSiteRelativeUrl: string, itemID: string, itemType: string, offer: IOffer) => {
    const requestUrl = `${siteUrl}/_api/web/lists/GetByTitle('Documents')/items(${itemID})`;
    const requestBody = {
      "__metadata": {
          "type": itemType
      },
      "Title": offer.title,
      "OfferingDescription": offer.description,
      "OfferingVAT": offer.vat,
      "OfferingNetPrice": offer.price,
      "OfferingDate": offer.date
    };

    return Axios.post(requestUrl, requestBody,
      {
        headers: {          
            Authorization: `Bearer ${spoAccessToken}`,
            "Content-Type": "application/json;odata=verbose",
            "Accept": "application/json;odata=verbose",
            "If-Match": "*",
            "X-HTTP-Method": "MERGE"
        }
      })
      .then(response => {
        return response.data;      
      }).catch(err => {
        log(err);
      });
  };

  router.post(
    "/createoffer",
    pass.authenticate("oauth-bearer", { session: false }),
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      const teamSiteDomain = req.body.domain;
      const teamSiteUrl = process.env.SiteUrl!;
      const teamSiteRelativeUrl = teamSiteUrl.split(teamSiteDomain)[1];
      const offer: IOffer = req.body.offer;

      try {
        const tokenResult = await exchangeForToken(teamSiteDomain.toLowerCase().replace('sharepoint', 'onmicrosoft'),
            req.header("Authorization")!.replace("Bearer ", "") as string,
            `https://${teamSiteDomain}/AllSites.Write`);
        const accessToken = tokenResult.accessToken;
              
        const tmplFile = await loadTemplate(accessToken, offer, teamSiteUrl, teamSiteRelativeUrl);
        const newFile = await createOfferFile(accessToken, teamSiteUrl, teamSiteRelativeUrl, tmplFile);
        const newFileUrl = `https://${teamSiteDomain}${newFile.ServerRelativeUrl}`;
        const fileListItemInfo = await getFileListItem(accessToken, teamSiteUrl, teamSiteRelativeUrl, tmplFile.name);
        const fileListItem = await updateFileListItem(accessToken, teamSiteUrl, teamSiteRelativeUrl, fileListItemInfo.id, fileListItemInfo.type, offer);

        res.send({ item: fileListItem, fileUrl: newFileUrl });
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