import React from "react";
import { app, pages } from "@microsoft/teams-js";

export const Config: React.FC<{}> = () =>  {
  React.useEffect(() => {
    app.initialize()
      .then(() => {
        pages.config.setValidityState(true);
        pages.config.registerOnSaveHandler((saveEvent) => {
          const configPromise = pages.config.setConfig({
            websiteUrl: `${process.env.REACT_APP_TAB_ENDPOINT}/EnsureSiteUser`,
            contentUrl: `${process.env.REACT_APP_TAB_ENDPOINT}/EnsureSiteUser`,
            entityId: "grayIconTab",
            suggestedDisplayName: "Ensure Site User"
          });
          configPromise
            .then((result) => {saveEvent.notifySuccess()})
            .catch((error) => {saveEvent.notifyFailure("failure message")});
        });
      })
      .catch((ex) => {
        console.log(ex);
      });    
  }, []);
  return (
    <div className="welcome page">
      <h1>Configure Teams Tab</h1>
    </div>
  );
}