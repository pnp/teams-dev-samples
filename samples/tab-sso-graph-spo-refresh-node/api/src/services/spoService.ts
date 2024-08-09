import Axios from "axios";
import { EnsuredUser } from "../../model/EnsuredUser";

export const getWeb = (spoToken: string, siteUrl: string): Promise<string> => {
  Axios.get(`${siteUrl}/_api/web`, {
    responseType: "json",
    headers: {
      Authorization: `Bearer ${spoToken}`
    }
  })
  .then(result => {
    const web: any = result.data;
  })
  .catch((error) => {
    console.log(error);
  });

  return Promise.resolve("");
}

export const ensureSPOUserByLogin = async (spoAccessToken: string, userEmail: string, siteUrl: string): Promise<EnsuredUser> => {
  const requestUrl: string = `${siteUrl}/_api/web/ensureuser`;      
  const userLogin = {
    logonName: userEmail
  };
  return Axios.post(requestUrl, userLogin,
  {
    headers: {          
      Authorization: `Bearer ${spoAccessToken}`
    }
  })
  .then(response => {
    const userLookupID = response.data.Id;
    const userTitle = response.data.Title;
    const user: EnsuredUser = { login: userEmail, lookupID: userLookupID, displayName: userTitle };
    return user
  })
  .catch((error) => {
    console.log(error);
    return error;
  });
};