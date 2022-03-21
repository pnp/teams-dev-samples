import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react-northstar";
import { useState, useEffect } from "react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";
// import {Providers} from '@microsoft/mgt-element';
// import {TeamsMsal2Provider, HttpMethod} from '@microsoft/mgt-teams-msal2-provider';
import { PeoplePicker, PersonType, TeamsChannelPicker, UserType } from '@microsoft/mgt-react';


/**
 * Implementation of the Home content page
 */
export const ProviderComponent = () => {

    const [{ inTeams, theme, context }] = useTeams();
    const [entityId, setEntityId] = useState<string | undefined>();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [people, setPeople] = useState<any[]>([]);
    // TeamsMsal2Provider.microsoftTeamsLib = microsoftTeams;

    // Providers.globalProvider = new TeamsMsal2Provider({
    //   clientId: `13237e16-1fc7-47a0-a8cf-acad64ab4e0b`,
    //   authPopupUrl: '/auth.html',
    //   scopes: ['User.Read','Mail.ReadBasic', 'User.ReadBasic.All','ChatMessage.Send', 'User.Read.All', 'Chat.ReadWrite','People.Read','Team.ReadBasic.All','Group.Read.All','Channel.ReadBasic.all','Chat.Create','Chat.ReadWrite'],
    //   ssoUrl: '/api/token',
    //   httpMethod: HttpMethod.POST
    // });

    const handleSelectionChanged = (event) => {
        console.log(event);
        setPeople(event.detail);
      };

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    microsoftTeams.appInitialization.notifySuccess();
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [process.env.TAB_APP_URI as string]
            });
        } else {
            setEntityId("Not in Microsoft Teams");
        }
    }, [inTeams]);

    useEffect(() => {
        if (context) {
            setEntityId(context.entityId);
        }
    }, [context]);

    /**
     * The render() method to create the UI of the tab
     */
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
                        <div>
                            <Text content={`Hello ${name}`} />
                            <PeoplePicker type={PersonType.person} userType={UserType.user} selectionChanged={handleSelectionChanged} />
                        </div>
                        {error && <div><Text content={`An SSO error occurred ${error}`} /></div>}

                        <div>
                            <Button onClick={() => alert("It worked!")}>A sample button</Button>
                        </div>
                    </div>
                </Flex.Item>
                <Flex.Item styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Text size="smaller" content="(C) Copyright BinaryRoots" />
                </Flex.Item>
            </Flex>
        </Provider>
    );
};
