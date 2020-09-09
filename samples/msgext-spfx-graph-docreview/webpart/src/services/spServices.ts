import { SPHttpClient } from "@microsoft/sp-http";
import { IConfig } from "../model/IConfig";

export default class SPService {
  private spClient: SPHttpClient;
  private siteUrl: string;

  public initialize (serviceScope, siteUrl: string) {
    this.spClient = serviceScope.consume(SPHttpClient.serviceKey);
    this.siteUrl = siteUrl;
  }

  public async getConfig (): Promise<IConfig> {
    const requestUrl = `${this.siteUrl}/_api/web/GetStorageEntity('DocReviewConfig')`;    
    
    return this.spClient
      .get(requestUrl, SPHttpClient.configurations.v1)
        .then((response): Promise<IConfig> => {
          return response.json()
            .then((jsonResponse) => {
              const config: IConfig = JSON.parse(jsonResponse.Value);
              return config;
            });
        });
  }
}