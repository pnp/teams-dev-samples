import { AppConfigurationClient } from "@azure/app-configuration";
import { DefaultAzureCredential } from "@azure/identity";
import { IMovieConfig } from "../../model/IMovieConfig";

export default class appConfigService {
    public static async retrieveConfig(meetingID: string): Promise<IMovieConfig> {
        const client = this.getClient();
        let movie1url = "";
        let movie2url = "";
        let movie3url = "";
        try {
          const movie1Setting = await client.getConfigurationSetting({ key: `VoteMovie1Url_${meetingID}`});
          movie1url = movie1Setting.value!;
          const movie2Setting = await client.getConfigurationSetting({ key: `VoteMovie2Url_${meetingID}`});
          movie2url = movie2Setting.value!;
          const movie3Setting = await client.getConfigurationSetting({ key: `VoteMovie3Url_${meetingID}`});
          movie3url = movie3Setting.value!;
        }
        catch(error) {
          
        }
        return Promise.resolve({ movie1url: movie1url, movie2url: movie2url, movie3url: movie3url });
      }
    
      public static async saveConfig(meetingID: string, newConfig: IMovieConfig) {
        const client = this.getClient();
        if (newConfig.movie1url) {
          await client.setConfigurationSetting({ key: `VoteMovie1Url_${meetingID}`, value: newConfig.movie1url });
        }
        if (newConfig.movie2url) {
          await client.setConfigurationSetting({ key: `VoteMovie2Url_${meetingID}`, value: newConfig.movie2url });
        }
        if (newConfig.movie3url) {
          await client.setConfigurationSetting({ key: `VoteMovie3Url_${meetingID}`, value: newConfig.movie3url });
        }
      }
    
      private static getClient(): AppConfigurationClient {
        const connectionString = process.env.AZURE_CONFIG_CONNECTION_STRING!;
        const credential = new DefaultAzureCredential();
        const client = new AppConfigurationClient(connectionString, credential);
        return client;
      }
}