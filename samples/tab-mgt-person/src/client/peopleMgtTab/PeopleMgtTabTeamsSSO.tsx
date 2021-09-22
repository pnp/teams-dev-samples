import * as React from "react";
import { useState, useEffect } from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import { Providers, ProviderState } from "@microsoft/mgt";
import { HttpMethod, TeamsMsal2Provider } from "@microsoft/mgt-teams-msal2-provider";
import { People, Person, PersonViewType } from "@microsoft/mgt-react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

export const PeopleMgtTabTeamsSSO = (props) => {
    const [{ inTeams, theme, context }] = useTeams();
    const [error, setError] = useState<string>();

    TeamsMsal2Provider.microsoftTeamsLib = microsoftTeams;

    useEffect(() => {
        if (inTeams === true) {
            let provider = new TeamsMsal2Provider({
                clientId: `${process.env.TAB_APP_ID}`,
                authPopupUrl: '',
                scopes: ['User.Read','People.Read'],
                ssoUrl: `https://${process.env.PUBLIC_HOSTNAME}/api/token`,
                httpMethod: HttpMethod.POST
              });
            Providers.globalProvider = provider;
            Providers.globalProvider.setState(ProviderState.SignedIn);
        }
    }, [inTeams]);

    return (
        <Provider theme={theme}>
            <Flex fill={true} column styles={{
                padding: ".8rem 0 .8rem .5rem"
            }}>
                <Flex.Item>
                    <Header content="This is your tab" />
                </Flex.Item>
                <Flex.Item>
                <div>                    
                    {error && <div><Text content={`An SSO error occurred ${error}`} /></div>}

                    <div>
                        <Person personQuery="me" view={PersonViewType.twolines} />
                    </div>
                    <div>
                        <People showMax={5} />
                    </div>
                </div>
                </Flex.Item>
            </Flex>
        </Provider>
    );
}