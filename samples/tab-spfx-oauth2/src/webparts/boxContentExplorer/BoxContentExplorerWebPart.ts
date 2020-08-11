import * as React from "react";
import * as ReactDom from "react-dom";
import { Version } from "@microsoft/sp-core-library";
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
} from "@microsoft/sp-property-pane";
import { BaseClientSideWebPart } from "@microsoft/sp-webpart-base";
import { boxService } from "../../services/services";
import * as strings from "BoxContentExplorerWebPartStrings";
import BoxContentExplorer from "./components/BoxContentExplorer";
import { IBoxContentExplorerProps } from "./components/IBoxContentExplorerProps";

export interface IBoxContentExplorerWebPartProps {
  folderId: string;
}

export default class BoxContentExplorerWebPart extends BaseClientSideWebPart<
  IBoxContentExplorerWebPartProps
> {
  public onInit(): Promise<void> {
    return super.onInit().then(async (_) => {
      if (this.context.sdks.microsoftTeams)
        boxService.teamsContext = this.context.sdks.microsoftTeams;
    });
  }

  public render(): void {
    const { folderId } = this.properties;
    console.log(this.context.pageContext.site.absoluteUrl);
    const element: React.ReactElement<IBoxContentExplorerProps> = React.createElement(
      BoxContentExplorer,
      {
        folderId,
        userObjectId:this.context.sdks.microsoftTeams.context.userObjectId
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse("1.0");
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription,
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField("folderId", {
                  label: strings.FolderIdFieldLabel,
                }),
              ],
            },
          ],
        },
      ],
    };
  }
}
