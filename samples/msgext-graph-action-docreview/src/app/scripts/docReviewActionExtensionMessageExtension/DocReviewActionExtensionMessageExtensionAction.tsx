import * as React from "react";
import { Provider, Flex, Header, List, RedbangIcon } from "@fluentui/react-northstar";
import Axios from "axios";
import * as jwt from "jsonwebtoken";
import TeamsBaseComponent, { ITeamsBaseComponentState } from "msteams-react-base-component";
import * as microsoftTeams from "@microsoft/teams-js";
import { IDocument } from "../../../model/IDocument";

/**
 * State for the DocReviewActionExtensionMessageExtensionAction React component
 */
export interface IDocReviewActionExtensionMessageExtensionActionState extends ITeamsBaseComponentState {
  entityId?: string;
  name?: string;
  ssoToken: string;
  error?: string;
  email: string;
  documents: IDocument[];
  selectedListItem: number;
}

/**
 * Properties for the DocReviewActionExtensionMessageExtensionAction React component
 */
export interface IDocReviewActionExtensionMessageExtensionActionProps {

}

/**
 * Implementation of the Doc Review Action Extension Task Module page
 */
export class DocReviewActionExtensionMessageExtensionAction extends TeamsBaseComponent<IDocReviewActionExtensionMessageExtensionActionProps, IDocReviewActionExtensionMessageExtensionActionState> {
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
            this.setState({ name: decoded!.name,
                            ssoToken: token });
            this.loadFiles();
            microsoftTeams.appInitialization.notifySuccess();
          },
          failureCallback: (message: string) => {
            this.setState({ error: message });
            microsoftTeams.appInitialization.notifyFailure({
                reason: microsoftTeams.appInitialization.FailedReason.AuthFailed,
                message
            });
          },
          resources: [`api://${process.env.HOSTNAME}/${process.env.GRAPH_APP_ID}`]
        });
      });
    });
  }

  public render() {
    let listItems: any[] = [];
    if (this.state.documents) {
      this.state.documents.forEach((doc) => {
        let urgentLimit = new Date();
        urgentLimit.setDate(urgentLimit.getDate() - 7);
        const urgent: boolean = doc.nextReview < urgentLimit;
        listItems.push({
            key: doc.id,
            header: doc.name,
            media: urgent ? <RedbangIcon /> : null,
            important: urgent,
            headerMedia: doc.nextReview.toLocaleDateString(),
            content: doc.description
        });
      });
    }
    return (
      <Provider theme={this.state.theme}>
        <Flex fill={true} column styles={{
            padding: ".8rem 0 .8rem .5rem"
        }}>
          <Flex.Item>
            <div>
              <Header content="Documents for review: " />
              <List selectable
                      selectedIndex={this.state.selectedListItem}
                      onSelectedIndexChange={this.listItemSelected}
                      items={listItems}
                      />
            </div>
          </Flex.Item>
        </Flex>
      </Provider>
    );
  }

  private loadFiles = () => {
    if (this.state.ssoToken) {
      Axios.get(`https://${process.env.HOSTNAME}/api/files`, {
                      responseType: "json",
                      headers: {
                        Authorization: `Bearer ${this.state.ssoToken}`
                      }
          }).then(result => {
            let docs: IDocument[] = [];
            result.data.forEach(d => {
              docs.push({ name: d.name, id: d.id, description: d.description, author: d.author, nextReview: new Date(d.nextReview), modified: new Date(d.modified), url: d.url });
            });
            this.setState({
              documents: docs
            });
          })
          .catch((error) => {
            console.log(error);
          });
    }
  }

  
  private listItemSelected = (e, newProps) => {
    const selectedDoc = this.state.documents.filter(doc => doc.id === newProps.items[newProps.selectedIndex].key)[0];
    microsoftTeams.tasks.submitTask({
      doc: selectedDoc
    });
    this.setState({
      selectedListItem: newProps.selectedIndex
    });
  }
}
