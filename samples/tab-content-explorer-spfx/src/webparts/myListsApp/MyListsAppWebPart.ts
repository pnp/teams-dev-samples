import * as React                 from 'react';
import * as ReactDom              from 'react-dom';
import { Version }                from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown
}                                 from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart }  from '@microsoft/sp-webpart-base';
import * as strings               from 'MyListsAppWebPartStrings';
import MyListsApp                 from './components/MyListsApp';
import { IMyListsAppProps }       from './components/IMyListsAppProps';
import Message, { IMessageProps } from "./components/Message/Message";
import { MessageBarType }         from 'office-ui-fabric-react/lib/MessageBar';


export interface IMyListsAppWebPartProps {
  siteURL: string;
  includeDocLibraries: boolean;
  includeEventLists: boolean;
  includeCustomLists: boolean;
  includeSystemLibraries: boolean;
  includeSubsites: boolean;
  openLinksInTeams: boolean;
  displayLayout: string;
}

export default class MyListsAppWebPart extends BaseClientSideWebPart <IMyListsAppWebPartProps> {
  
  public render(): void {
    // Check if web part properties are configured
    if (this._needsConfiguration()) {
      this._renderMessage(strings.WebPartNotConfigured, MessageBarType.info, true);
    } else {
      const element: React.ReactElement<IMyListsAppProps> = React.createElement(
        MyListsApp,
        {
          siteURL: this.properties.siteURL,
          context: this.context,
          includeDocLibraries: this.properties.includeDocLibraries,
          includeEventLists: this.properties.includeEventLists,
          includeCustomLists: this.properties.includeCustomLists,
          includeSystemLibraries: this.properties.includeSystemLibraries,
          includeSubsites: this.properties.includeSubsites,
          openLinksInTeams: this.properties.openLinksInTeams,
          displayLayout: this.properties.displayLayout
        }
      );
  
      ReactDom.render(element, this.domElement);
    }
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
                PropertyPaneTextField('siteURL', {
                  placeholder: strings.SiteFieldPlaceholder
                })
              ]
            },
            {
              groupName: strings.ListsFilterGroupName,
              groupFields: [
                PropertyPaneCheckbox('includeDocLibraries', {
                  text: strings.IncludeDocLibrariesLabel,
                  checked: this.properties.includeDocLibraries
                }),
                PropertyPaneCheckbox('includeEventLists', {
                  text: strings.IncludeEventListsLabel,
                  checked: this.properties.includeEventLists
                }),
                PropertyPaneCheckbox('includeCustomLists', {
                  text: strings.IncludeCustomListsLabel,
                  checked: this.properties.includeCustomLists
                }),
                PropertyPaneCheckbox('includeSystemLibraries', {
                  text: strings.IncludeSystemLibrariesLabel,
                  checked: this.properties.includeSystemLibraries
                }),
              ]
            },
            {
              groupName: strings.SubsiteFilterGroupName,
              groupFields: [
                PropertyPaneCheckbox('includeSubsites', {
                  text: strings.IncludeSubsitesLabel,
                  checked: this.properties.includeSubsites
                })
              ]
            },
            {
              groupName: strings.LinksBehaviourGroupName,
              groupFields: [
                PropertyPaneCheckbox('openLinksInTeams', {
                  text: strings.OpenLinksInTeamsLabel,
                  checked: this.properties.openLinksInTeams
                })
              ]
            },
            {
              groupName: strings.DisplaySettingsGroupName,
              groupFields: [
                PropertyPaneDropdown('displayLayout', {
                  label: strings.LayoutLabel,
                  options: [
                    {
                      key: 'flat',
                      text: 'Flat'
                    },
                    {
                      key: 'grouped',
                      text: 'Grouped'
                    }
                  ],
                  selectedKey: 'flat'
                })
              ]
            }
          ]
        }
      ]
    };
  }

  protected get disableReactivePropertyChanges(): boolean { 
    return true; 
  }


  /*************************************************************************************
  * Checks if web part properties are configured
  *
  * @private
  * @param {string} statusMessage
  * @param {MessageBarType} statusMessageType
  * @param {boolean} display
  * @memberof ReactAggregatedCalendarWebPart
  *************************************************************************************/
  private _needsConfiguration(): boolean {
    return this.properties.siteURL === null ||
      this.properties.siteURL === undefined ||
      this.properties.siteURL.trim().length === 0;
  }


  /*************************************************************************************
  * Render Message method to render the message component
  *
  * @private
  * @param {string} statusMessage
  * @param {MessageBarType} statusMessageType
  * @param {boolean} display
  * @memberof ReactAggregatedCalendarWebPart
  *************************************************************************************/
  private _renderMessage(statusMessage: string, statusMessageType: MessageBarType,
    display: boolean): void {
    const messageElement: React.ReactElement<IMessageProps> = React.createElement(
      Message,
      {
        Message: statusMessage,
        Type: statusMessageType,
        Display: display
      }
    );

    ReactDom.render(messageElement, this.domElement);
  }
}
