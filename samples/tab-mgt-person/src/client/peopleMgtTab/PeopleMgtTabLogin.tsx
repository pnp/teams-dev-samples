import * as React from "react";
import * as microsoftTeams from "@microsoft/teams-js";
import { Providers, TeamsProvider } from "@microsoft/mgt";
import { Login, People } from "@microsoft/mgt-react";

export const PeopleMgtTabLogin = (props) => {
    
    TeamsProvider.microsoftTeamsLib = microsoftTeams;
    Providers.globalProvider = new TeamsProvider ({
        clientId: process.env.TAB_APP_ID!,
        authPopupUrl: '/auth.html',
        scopes: ["User.Read", "People.Read"]
    });

    return (
        <div>           
            <div>
                <Login />
            </div>
            <div>
                <People showMax={5} />
            </div>
        </div>
    );
}