import express = require("express");
import { AppConfigurationClient } from "@azure/app-configuration";
import { DefaultAzureCredential } from "@azure/identity";
import { IMovieConfig } from "../../model/IMovieConfig";

export const appConfigService = (options: any) =>  {
  const router = express.Router();

  const retrieveConfig = async (meetingID: string): Promise<IMovieConfig> => {
    const client = getClient();
    let movie1url = "";
    let movie2url = "";
    let movie3url = "";
    let containerId = "";
    try {
      const movie1Setting = await client.getConfigurationSetting({ key: `VoteMovie1Url_${meetingID}`});
      movie1url = movie1Setting.value!;
      const movie2Setting = await client.getConfigurationSetting({ key: `VoteMovie2Url_${meetingID}`});
      movie2url = movie2Setting.value!;
      const movie3Setting = await client.getConfigurationSetting({ key: `VoteMovie3Url_${meetingID}`});
      movie3url = movie3Setting.value!;
      const containerIdSetting = await client.getConfigurationSetting({ key: `ContainerId_${meetingID}`});
      containerId = containerIdSetting.value!;
    }
    catch(error) {
      
    }
    return Promise.resolve({ movie1url: movie1url, movie2url: movie2url, movie3url: movie3url, containerId: containerId });
  };
    
  const saveConfig = async (meetingID: string, newConfig: IMovieConfig) => {
    const client = getClient();
    if (newConfig.movie1url) {
      await client.setConfigurationSetting({ key: `VoteMovie1Url_${meetingID}`, value: newConfig.movie1url });
    }
    if (newConfig.movie2url) {
      await client.setConfigurationSetting({ key: `VoteMovie2Url_${meetingID}`, value: newConfig.movie2url });
    }
    if (newConfig.movie3url) {
      await client.setConfigurationSetting({ key: `VoteMovie3Url_${meetingID}`, value: newConfig.movie3url });
    }
    if (newConfig.containerId) {
      await client.setConfigurationSetting({ key: `ContainerId_${meetingID}`, value: newConfig.containerId });
    }
  };
    
  const getClient = (): AppConfigurationClient => {
    const connectionString = process.env.AZURE_CONFIG_CONNECTION_STRING!;
    const credential = new DefaultAzureCredential();
    const client = new AppConfigurationClient(connectionString, credential);
    return client;
  };

      
  router.get(
    "/config/:meetingID",
    async (req: any, res: express.Response, next: express.NextFunction) => {
        const meetingID: any = req.params.meetingID;
        const config: IMovieConfig = await retrieveConfig(meetingID);
        res.json(config);
  });
  
  router.post(
      "/config/:meetingID",
      async (req: any, res: express.Response, next: express.NextFunction) => {
          const meetingID: any = req.params.meetingID;
          const config: IMovieConfig = req.body.config;
          saveConfig(meetingID, config);
  });
  return router;
};