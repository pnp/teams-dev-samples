import * as React from "react";
import { Provider, Flex, Text, Button, Header } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import * as jwt from "jsonwebtoken";
/**
 * State for the ssoTabTab React component
 */
export interface ISsoTabState extends ITeamsBaseComponentState {
    entityId?: string;
    name?: string;
    error?: string;
}

/**
 * Properties for the ssoTabTab React component
 */
export interface ISsoTabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the SSO Tab content page
 */
export class SsoTab extends TeamsBaseComponent<ISsoTabProps, ISsoTabState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));


        microsoftTeams.initialize(() => {
            microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
            microsoftTeams.getContext((context) => {
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);

                microsoftTeams.authentication.getAuthToken({
                    successCallback: (token: string) => {
                        const decoded: { [key: string]: any; } = jwt.decode(token) as { [key: string]: any; };
                        this.setState({ name: decoded!.name });
                    },
                    failureCallback: (reason: string) => {
                        this.setState({ error: reason });
                    },
                    resources: [process.env.SSOTAB_APP_URI as string]
                });
            });
        });
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true} column styles={{
                    padding: ".8rem 0 .8rem .5rem"
                }}>
                    <Flex.Item>
                        <Header content="This is your tab" />
                    </Flex.Item>
                    <Flex.Item>
                        <div>

                            <div>
                                <Text content={`Hello ${this.state.name}`} />
                            </div>
                            {this.state.error && <div><Text content={`An SSO error occurred ${this.state.error}`} /></div>}

                            <div>
                                <Button onClick={() => alert("It worked!")}>A sample button</Button>
                            </div>
                        </div>
                    </Flex.Item>
                    <Flex.Item styles={{
                        padding: ".8rem 0 .8rem .5rem"
                    }}>
                        <Text size="smaller" content="(C) Copyright Contoso" />
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
