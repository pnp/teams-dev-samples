import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { initializeIcons } from '@uifabric/icons';
import * as strings from 'DocReviewSelectWebPartStrings';
import DocReviewSelect from './components/DocReviewSelect';
import { IDocReviewSelectProps } from './components/IDocReviewSelectProps';

export interface IDocReviewSelectWebPartProps {
  description: string;
}

export default class DocReviewSelectWebPart extends BaseClientSideWebPart<IDocReviewSelectWebPartProps> {
  private isTeamsMessagingExtension;

  protected onInit(): Promise<void> {
    initializeIcons(); // Not needed inside SharePoint but inside Teams!
    this.isTeamsMessagingExtension = (this.context as any)._host && 
                                      (this.context as any)._host._teamsManager &&
                                      (this.context as any)._host._teamsManager._appContext &&
                                      (this.context as any)._host._teamsManager._appContext.applicationName &&
                                      (this.context as any)._host._teamsManager._appContext.applicationName === 'TeamsTaskModuleApplication';    
    return Promise.resolve();                                      
  }

  public render(): void {
    const element: React.ReactElement<IDocReviewSelectProps> = React.createElement(
      DocReviewSelect,
      {
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
