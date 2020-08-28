import * as React from "react";
import { Provider, Flex, Header, Label, Input, Button } from "@fluentui/react-northstar";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";

/**
 * State for the DocReviewActionExtensionMessageExtensionConfig React component
 */
export interface IDocReviewActionExtensionMessageExtensionConfigState extends ITeamsBaseComponentState {
  siteID: string;
  listID: string;
}

/**
 * Properties for the DocReviewActionExtensionMessageExtensionConfig React component
 */
export interface IDocReviewActionExtensionMessageExtensionConfigProps {

}

/**
 * Implementation of the Doc Review Action Extension configuration page
 */
export class DocReviewActionExtensionMessageExtensionConfig extends TeamsBaseComponent<IDocReviewActionExtensionMessageExtensionConfigProps, IDocReviewActionExtensionMessageExtensionConfigState> {
  public componentWillMount() {
    this.updateTheme(this.getQueryVariable("theme"));

    const urlParams = new URLSearchParams(window.location.search);
    const siteID = urlParams.get("siteID");
    const listID = urlParams.get("listID");
    this.setState({
        siteID: siteID ? siteID : "",
        listID: listID ? listID : ""
    });
    microsoftTeams.initialize();
    microsoftTeams.registerOnThemeChangeHandler(this.updateTheme);
    microsoftTeams.appInitialization.notifySuccess();
  }

  /**
   * The render() method to create the UI of the config page
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
