import * as React from "react";
import { Provider, Flex, Header, Input, Button, Text, Checkbox } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
import {Providers} from '@microsoft/mgt-element';
import {TeamsMsal2Provider, HttpMethod} from '@microsoft/mgt-teams-msal2-provider';
import {MgtTeamsChannelPicker} from "@microsoft/mgt-components";
import { Main } from "./Main";
/**
 * Implementation of the Forward Message Task Module page
 */
export const ForwardMessageMessageExtensionAction = () => {

    const [{ inTeams, theme }] = useTeams();
   
    TeamsMsal2Provider.microsoftTeamsLib = microsoftTeams;

    Providers.globalProvider = new TeamsMsal2Provider({
      clientId: `13237e16-1fc7-47a0-a8cf-acad64ab4e0b`,
      authPopupUrl: '/auth.html',
      scopes: ['User.Read','Mail.ReadBasic', 'User.ReadBasic.All','ChatMessage.Send', 'User.Read.All', 'Chat.ReadWrite','People.Read','Team.ReadBasic.All','Group.Read.All','Channel.ReadBasic.all','Chat.Create','Chat.ReadWrite'],
      ssoUrl: '/api/token',
      httpMethod: HttpMethod.POST
    });

MgtTeamsChannelPicker.config.useTeamsBasedScopes = true;
    
    return (
        <Provider theme={theme} styles={{ height: "100vh", width: "100vw", padding: "1em" }}>
           <Main></Main>
        </Provider>
    );
};
