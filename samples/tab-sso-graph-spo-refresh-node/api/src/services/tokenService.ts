import Axios from "axios";
import config from "../config";

export const exchangeForToken = (tenantID: string, token: string, scopes: string[]): Promise<{accessToken: string,refreshToken: string}> => {
  return new Promise((resolve, reject) => {
    const url = `https://login.microsoftonline.com/${tenantID}/oauth2/v2.0/token`;
    var bodyFormData = new FormData();
    bodyFormData.append('client_id', config.clientId);
    bodyFormData.append('client_secret', config.clientSecret);
    bodyFormData.append('grant_type', "urn:ietf:params:oauth:grant-type:jwt-bearer");
    bodyFormData.append('assertion', token);
    bodyFormData.append('requested_token_use', "on_behalf_of");
    bodyFormData.append('scope', scopes.join(" "));
    
      Axios.post(url,
        //qs.stringify(params), {
        bodyFormData, {
        headers: {
          "Accept": "application/json",
          "Content-Type": "x-www-form-urlencoded"
        }
      }).then(result => {
        if (result.status !== 200) {
          reject(result);
        } else {
          resolve({accessToken: result.data.access_token, refreshToken: result.data.refresh_token});
        }
    }).catch(err => {
      // error code 400 likely means you have not done an admin consent on the app
      reject(err);
    });
  });
};

export const getSPOToken = async (scope: string, refreshToken: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const url = `https://login.microsoftonline.com/${config.tenantId}/oauth2/v2.0/token`;
    var bodyFormData = new FormData();
    bodyFormData.append('client_id', config.clientId);
    bodyFormData.append('client_secret', config.clientSecret);
    bodyFormData.append('grant_type', "refresh_token");
    bodyFormData.append('refresh_token', refreshToken);
    bodyFormData.append('scope', scope);
    
    Axios.post(url,
      bodyFormData, {
      headers: {
        "Accept": "application/json",
        "Content-Type": "x-www-form-urlencoded"
      }
    }).then(result => {
      if (result.status !== 200) {
        reject(result);
      } else {
        resolve(result.data.access_token);
      }
    }).catch(err => {
      reject(err);
    });
  });
};