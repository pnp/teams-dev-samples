import React from "react";
import { app, authentication } from "@microsoft/teams-js";
import "./EnsureSiteUser.css"
import { Button, Field, Input, InputOnChangeData } from "@fluentui/react-components";
import Axios from "axios";
import config from "./lib/config";

export const EnsureSiteUser: React.FC<{}> = () =>  {
  const [siteUrl, setSiteUrl] = React.useState<string>("");
  const [groupId, setGroupId] = React.useState<string>("");
  const [userLogin, setUserLogin] = React.useState<string>("");
  const [token, setToken] = React.useState<string>("");

  const onUserLoginChange =  React.useCallback((ev: React.ChangeEvent<HTMLInputElement>, newValue: InputOnChangeData) => {
    setUserLogin(newValue.value);
  }, []);

  const onEnsureUser = React.useCallback(() => {
    const requestBody = {
      groupId: groupId,
      userLogin: userLogin
    };

    Axios.post(`${config.apiEndpoint}/api/getSPOUser`, requestBody, {
      responseType: "json",
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(result => {
      console.log(result);
    })
    .catch((error) => {
      console.log(error);
    });
  }, [token, groupId, userLogin]);

  React.useEffect(() => {
    app.initialize()
    .then(() => {
      app.getContext()
      .then((context) => {
        if (context.sharePointSite !== undefined) {
          setSiteUrl(context.sharePointSite?.teamSiteUrl!);
          setGroupId(context.team?.groupId!);
          setUserLogin(context.user?.userPrincipalName!);
        }
        authentication.getAuthToken()
          .then((token) => {
            setToken(token);          
          });
      });
    });  
  }, []);

  return (
    <div className="block">
      <div className="field">
        <Field label='Site Url' >
          <Input disabled  value={siteUrl} />
        </Field>
      </div>
      <div className="field">
        <Field label='Group / Team ID' >
          <Input disabled value={groupId} />
        </Field>
      </div>      
      <div className="field">
        <Field label='User' >
          <Input value={userLogin} onChange={onUserLoginChange} />
        </Field>
      </div>      
      <div className="button">
        <Button appearance="primary" onClick={onEnsureUser}>Ensure user</Button>
      </div>
    </div>
  );
}