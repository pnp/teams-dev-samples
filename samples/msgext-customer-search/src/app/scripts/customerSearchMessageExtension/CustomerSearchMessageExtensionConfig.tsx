import * as React from "react";
import { Provider, Flex, Header, Checkbox, Button } from "@fluentui/react";
import TeamsBaseComponent, { ITeamsBaseComponentProps, ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the CustomerSearchMessageExtensionConfig React component
 */
export interface ICustomerSearchMessageExtensionConfigState extends ITeamsBaseComponentState {
    onOrOff: boolean;
}

/**
 * Properties for the CustomerSearchMessageExtensionConfig React component
 */
export interface ICustomerSearchMessageExtensionConfigProps extends ITeamsBaseComponentProps {

}

/**
 * Implementation of the CustomerSearch Message Extension configuration page
 */
export class CustomerSearchMessageExtensionConfig extends TeamsBaseComponent<ICustomerSearchMessageExtensionConfigProps, ICustomerSearchMessageExtensionConfigState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));
        this.setState({
            onOrOff: true
        });

        microsoftTeams.initialize();
        microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div style={ { padding: 20 } }>
                            <Header content="Northwind Customer Search configuration" />
                            <img src={`https://${process.env.HOSTNAME}/assets/northwindLogoSmall.png`}
                                 style={ { float: "left", margin: 20 } }></img>
                            <Checkbox
                                label="Setting"
                                toggle
                                checked={this.state.onOrOff}
                                onChange={() => { this.setState({ onOrOff: !this.state.onOrOff }); }} />
                            <br /><br />
                            <Button onClick={() =>
                                microsoftTeams.authentication.notifySuccess(JSON.stringify({
                                    setting: this.state.onOrOff
                                }))} primary>OK</Button>
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
