import * as React from "react";
import { Provider, Flex, Text, Button, Header, ThemePrepared, themes, List, Icon } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

import * as MicrosoftGraphClient from "@microsoft/microsoft-graph-client";
import * as MicrosoftGraph from "microsoft-graph";

/**
 * State for the adalTabTab React component
 */
export interface IAdalTabState extends ITeamsBaseComponentState {
    entityId: string;
    teamsTheme: ThemePrepared;
    accessToken: string;
    messages: MicrosoftGraph.Message[];
}

/**
 * Properties for the adalTabTab React component
 */
export interface IAdalTabProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the ADAL Tab content page
 */
export class AdalTab extends TeamsBaseComponent<IAdalTabProps, IAdalTabState> {

    private msGraphClient: MicrosoftGraphClient.Client;

    constructor(props: IAdalTabState, state: IAdalTabState) {
        super(props, state);

        state.messages = [];
        state.accessToken = "";

        this.state = state;
    }

    public componentWillMount() {
        this.updateComponentTheme(this.getQueryVariable("theme"));

        if (this.inTeams()) {
            microsoftTeams.initialize();
            microsoftTeams.registerOnThemeChangeHandler(this.updateComponentTheme);
            microsoftTeams.getContext((context) => {
                this.setState({
                    entityId: context.entityId
                });
                this.updateTheme(context.theme);
            });
        } else {
            this.setState({
                entityId: "This is not hosted in Microsoft Teams"
            });
        }

        // init the graph client
        this.msGraphClient = MicrosoftGraphClient.Client.init({
            authProvider: async (done) => {
                if (!this.state.accessToken) {
                    const token = await this.getAccessToken();
                    this.setState({
                        accessToken: token
                    });
                }
                done(null, this.state.accessToken);
            }
        });
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={themes.teams}>
                <Flex column gap="gap.small">
                    <Header>Recent messages in current user's mailbox</Header>
                    <Button primary
                        content="Get My Messages"
                        onClick={this.handleGetMyMessagesOnClick}></Button>
                    <List selectable>
                        {
                            this.state.messages.map(message => (
                                <List.Item media={<Icon name="email"></Icon>}
                                    header={message.receivedDateTime}
                                    content={message.subject}>
                                </List.Item>
                            ))
                        }
                    </List>
                </Flex>
            </Provider>
        );
    }

    private updateComponentTheme = (teamsTheme: string = "default"): void => {
        let componentTheme: ThemePrepared;

        switch (teamsTheme) {
            case "default":
                componentTheme = themes.teams;
                break;
            case "dark":
                componentTheme = themes.teamsDark;
                break;
            case "contrast":
                componentTheme = themes.teamsHighContrast;
                break;
            default:
                componentTheme = themes.teams;
                break;
        }
        // update the state
        this.setState(Object.assign({}, this.state, {
            teamsTheme: componentTheme
        }));
    }

    private handleGetMyMessagesOnClick = async (event): Promise<void> => {
        await this.getMessages();
    }

    private async getMessages(promptConsent: boolean = false): Promise<void> {
        if (promptConsent || this.state.accessToken === "") {
            await this.signin(promptConsent);
        }

        this.msGraphClient
            .api("me/messages")
            .select(["receivedDateTime", "subject"])
            .top(15)
            .get(async (error: any, rawMessages: any, rawResponse?: any) => {
                if (!error) {
                    this.setState(Object.assign({}, this.state, {
                        messages: rawMessages.value
                    }));
                    Promise.resolve();
                } else {
                    console.error("graph error", error);
                    // re-sign in but this time force consent
                    await this.getMessages(true);
                }
            });
    }

    private async signin(promptConsent: boolean = false): Promise<void> {
        const token = await this.getAccessToken(promptConsent);

        this.setState({
            accessToken: token
        });

        Promise.resolve();
    }

    private async getAccessToken(promptConsent: boolean = false): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/auth-start.html",
                width: 600,
                height: 535,
                successCallback: (accessToken: string) => {
                    resolve(accessToken);
                },
                failureCallback: (reason) => {
                    reject(reason);
                }
            });
        });
    }
}
