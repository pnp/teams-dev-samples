import { useEffect } from 'react';
import { Observable } from "../utilities/observable";
import configuration from "../utilities/configuration";
import config from "../utilities/configuration";
import axios from "axios";
import { IMicrosoftTeams } from "@microsoft/sp-webpart-base";
import IToken from "../models/token";
export default class BoxService {
  public readonly boxToken = new Observable<string>(null);
  public readonly errorMessage = new Observable<string>("");
  public teamsContext: IMicrosoftTeams;
  protected token: IToken = {};

  public async GetLocalStorageToken() {
    const { userObjectId } = this.teamsContext.context;
    var cachedObject = localStorage.getItem(`${userObjectId}-boxAccessToken`);
    if (cachedObject) {
      const cachedtoken: IToken = await JSON.parse(cachedObject);
      this.boxToken.set(cachedtoken.AccessToken);
    }
  }

  public async GetBoxAccessToken() {
    const { userObjectId } = this.teamsContext.context;

    const authenticationCode = await this.Authenticate(
      config.boxClientId,
      config.boxAuthorizationUrl
    );
    const tokenObject = await this.GetAccessToken(authenticationCode);
    this.token={
      AccessToken:tokenObject["access_token"],
      ExpiresIn:tokenObject["refresh_token"],
      RefreshToken:tokenObject["expires_in"]
    };
    this.boxToken.set(this.token.AccessToken);
    localStorage.setItem(
      `${userObjectId}-boxAccessToken`,
      JSON.stringify(this.token)
    );
  }

  private Authenticate(
    ClientId: string,
    AuthorizationUrl: string
  ): Promise<any> {
    const authenticationUrl = `${location.protocol}//${location.hostname}/sitepages/${config.authenticatePage}`;
    return new Promise((resolve, reject) => {
      const url = `${authenticationUrl}?clientId=${ClientId}&authorizationUrl=${AuthorizationUrl}`;
      this.teamsContext.teamsJs.authentication.authenticate({
        url,
        width: 500,
        height: 600,
        successCallback: (result) => resolve(result),
        failureCallback: (reason) => {
          this.errorMessage.set("Authentication failed, please try again!");
          reject(reason);
        },
      });
    });
  }

  private async GetAccessToken(code: string) {
    const data = {
      grant_type: "authorization_code",
      client_id: config.boxClientId,
      client_secret: config.boxClientSecret,
      code: code,
    };
    const response = await axios({
      url: config.boxGetTokenUrl,
      method: "POST",
      headers: { "content-type": "application/json" },
      data: JSON.stringify(data),
    });
    return response.data;
  }
}
