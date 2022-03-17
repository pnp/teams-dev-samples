import * as React from "react";
import { Provider} from "@fluentui/react-northstar";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import {Providers} from '@microsoft/mgt-element';
import {TeamsMsal2Provider, HttpMethod} from '@microsoft/mgt-teams-msal2-provider';
import { ProviderComponent } from "./ProviderComponent";

/**
 * Implementation of the ProviderComponent page
 */
export const HomeTab = () => {

    const [{ inTeams, theme, context }] = useTeams();
    TeamsMsal2Provider.microsoftTeamsLib = microsoftTeams;

    Providers.globalProvider = new TeamsMsal2Provider({
      clientId: `13237e16-1fc7-47a0-a8cf-acad64ab4e0b`,
      authPopupUrl: '/auth.html',
      scopes: ['User.Read','Mail.ReadBasic', 'User.ReadBasic.All','ChatMessage.Send', 'User.Read.All', 'Chat.ReadWrite','People.Read','Team.ReadBasic.All','Group.Read.All','Channel.ReadBasic.all','Chat.Create','Chat.ReadWrite'],
      ssoUrl: '/api/token',
      httpMethod: HttpMethod.POST
    });

    
    /**
     * The render() method to create the UI of the tab
     */
    return (
        <Provider theme={theme}>
           <ProviderComponent></ProviderComponent>
        </Provider>
    );
};
