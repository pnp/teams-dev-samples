import * as React from "react";
import { useState, useEffect } from "react";
import Axios from "axios";
import { Provider, Flex, Text, Header } from "@fluentui/react-northstar";
import { Providers, SimpleProvider, ProviderState } from "@microsoft/mgt";
import { People, Person, PersonViewType } from "@microsoft/mgt-react";
import { useTeams } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import jwtDecode from "jwt-decode";

export const PeopleMgtTabSSO = (props) => {
    const [{ inTeams, theme, context }] = useTeams();
    const [name, setName] = useState<string>();
    const [error, setError] = useState<string>();
    const [ssoToken, setSsoToken] = useState<string>();

    useEffect(() => {
        if (inTeams === true) {
            microsoftTeams.authentication.getAuthToken({
                successCallback: (token: string) => {
                    const decoded: { [key: string]: any; } = jwtDecode(token) as { [key: string]: any; };
                    setName(decoded!.name);
                    microsoftTeams.appInitialization.notifySuccess();
                    setSsoToken(token);                    
                },
                failureCallback: (message: string) => {
                    setError(message);
                    microsoftTeams.appInitialization.notifyFailure({
                        reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                        message
                    });
                },
                resources: [`api://${process.env.PUBLIC_HOSTNAME}/${process.env.TAB_APP_ID}` as string]
            });
        }
    }, [inTeams]);

    useEffect(() => {
        if (ssoToken) {
            let provider = new SimpleProvider((scopes: string[]): Promise<string> => {
                return Axios.get(`https://${process.env.PUBLIC_HOSTNAME}/api/accesstoken`, {
                                responseType: "json",
                                headers: {
                                    Authorization: `Bearer ${ssoToken}`
                                }
                            }).then(result => {
                                const accessToken = result.data.access_token;
                                console.log(accessToken);                                
                                return accessToken
                            })
                            .catch((error) => {
                                console.log(error);
                                return "";
                            });
            });
            Providers.globalProvider = provider;
            Providers.globalProvider.setState(ProviderState.SignedIn);
        }
    },[ssoToken]);

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
                    </div>
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