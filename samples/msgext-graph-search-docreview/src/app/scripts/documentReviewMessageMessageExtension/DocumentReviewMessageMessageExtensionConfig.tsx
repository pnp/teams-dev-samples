import * as React from "react";
import { Provider, Flex, Header, Input, Checkbox, Button, Label } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the DocumentReviewMessageMessageExtensionConfig React component
 */
export interface IDocumentReviewMessageMessageExtensionConfigState extends ITeamsBaseComponentState {
    siteID: string;
    listID: string;
}

/**
 * Properties for the DocumentReviewMessageMessageExtensionConfig React component
 */
export interface IDocumentReviewMessageMessageExtensionConfigProps {

}

/**
 * Implementation of the Document Review Message configuration page
 */
export class DocumentReviewMessageMessageExtensionConfig extends TeamsBaseComponent<IDocumentReviewMessageMessageExtensionConfigProps, IDocumentReviewMessageMessageExtensionConfigState> {

    public componentWillMount() {
        this.updateTheme(this.getQueryVariable("theme"));

        const urlParams = new URLSearchParams(window.location.search);
        const siteID = urlParams.get('siteID');
        const listID = urlParams.get('listID');
        this.setState({
            siteID: siteID ? siteID : "",
            listID: listID ? listID : ""
        });
        microsoftTeams.initialize();
        microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
        microsoftTeams.appInitialization.notifySuccess();
    }

    /**
     * The render() method to create the UI of the tab
     */
    public render() {
        return (
            <Provider theme={this.state.theme}>
                <Flex fill={true}>
                    <Flex.Item>
                        <div>
                            <Header content="Document Review Message configuration" />
                            <Label>Site ID: </Label>
                            <Input
                                placeholder="Enter a site ID here"
                                fluid
                                clearable
                                value={this.state.siteID}
                                onChange={(e, data) => {
                                    if (data) {
                                        this.setState({
                                            siteID: data.value
                                        });
                                    }
                                }}
                                required />
                            <Label>List ID: </Label>
                            <Input
                                placeholder="Enter a list ID here"
                                fluid
                                clearable
                                value={this.state.listID}
                                onChange={(e, data) => {
                                    if (data) {
                                        this.setState({
                                            listID: data.value
                                        });
                                    }
                                }}
                                required />
                            <Button onClick={() =>
                                microsoftTeams.authentication.notifySuccess(JSON.stringify({
                                    siteID: this.state.siteID,
                                    listID: this.state.listID
                                }))} primary>OK</Button>
                        </div>
                    </Flex.Item>
                </Flex>
            </Provider>
        );
    }
}
