import React, { useEffect } from "react";
import { app, pages } from "@microsoft/teams-js";
import { containerIdQueryParamKey, containerSchema,  createContainerID, getAzureMemberFromCtx } from "./tab/util";




export const TabConfig = () => {
  useEffect(() => {
    app.initialize().then(() => {
      app.getContext().then((ctx:any) => {
        
        pages.config.registerOnSaveHandler(async (saveEvent: any) => {
          const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
          const containerId = await createContainerID(getAzureMemberFromCtx(ctx?.user));
          
          pages.config
            .setConfig({
              suggestedDisplayName: "MindMap",
              contentUrl: baseUrl + "/index.html?" + containerIdQueryParamKey + "=" + containerId + "&name={loginHint}&tenant={tid}&group={groupId}&theme={theme}#/mindmap",
              websiteUrl: baseUrl + "/index.html?" + containerIdQueryParamKey + "=" + containerId + "&name={loginHint}&tenant={tid}&group={groupId}&theme={theme}#/mindmap",
            })
            .then(() => {
              saveEvent.notifySuccess();
            });
        });
      });


      pages.config.setValidityState(true);
    });
  }, []);
  return (
    <div>
      <h1>Welcome to MindMap!</h1>
      <div>
        Press the save button to continue.
      </div>
    </div>
  );

}


