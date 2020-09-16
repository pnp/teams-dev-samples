import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'DocReviewMarkReviewedWebPartStrings';
import DocReviewMarkReviewed from './components/DocReviewMarkReviewed';
import { IDocReviewMarkReviewedProps } from './components/IDocReviewMarkReviewedProps';

export interface IDocReviewMarkReviewedWebPartProps {
  description: string;
}

export default class DocReviewMarkReviewedWebPart extends BaseClientSideWebPart<IDocReviewMarkReviewedWebPartProps> {
  private isTeamsMessagingExtension;

  protected onInit(): Promise<void> {
    this.isTeamsMessagingExtension = (this.context as any)._host && 
                                      (this.context as any)._host._teamsManager &&
                                      (this.context as any)._host._teamsManager._appContext &&
                                      (this.context as any)._host._teamsManager._appContext.applicationName &&
                                      (this.context as any)._host._teamsManager._appContext.applicationName === 'TeamsTaskModuleApplication';    
    return Promise.resolve();                                      
  }

  public render(): void {
    const queryParms = new UrlQueryParameterCollection(window.location.href);
    const itemID = queryParms.getValue("itemID");
    // const appID = queryParms.getValue("componentId");
    const element: React.ReactElement<IDocReviewMarkReviewedProps> = React.createElement(
      DocReviewMarkReviewed,
      {
        itemID: itemID,
        serviceScope: this.context.serviceScope,
        siteUrl: this.context.pageContext.site.absoluteUrl,
        isTeamsMessagingExtension: this.isTeamsMessagingExtension,
        teamsContext: this.context.sdks.microsoftTeams
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
