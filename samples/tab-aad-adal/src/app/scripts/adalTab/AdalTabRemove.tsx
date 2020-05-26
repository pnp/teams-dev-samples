import * as React from "react";
import { Provider, Flex, Text, Header } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";


export interface IAdalTabRemoveState extends ITeamsBaseComponentState {
    value: string;
}
export interface IAdalTabRemoveProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of ADAL Tab remove page
 */
export class AdalTabRemove  extends TeamsBaseComponent<IAdalTabRemoveProps, IAdalTabRemoveState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));

        if (this.inTeams()) {
            microsoftTeams.initialize();
        } else {
        }
    }

    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div>
                            <Header content="You're about to remove your tab..." />
                            <Text content="You can just add stuff here if you want to clean up when removing the tab. For instance, if you have stored data in an external repository, you can delete or archive it here. If you don't need this remove page you can remove it." />
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
