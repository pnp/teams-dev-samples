import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'SettingsWebPartStrings';
import Settings from './components/Settings';
import { ISettingsProps } from './components/ISettingsProps';
import { loadTheme } from "office-ui-fabric-react";
const teamsDefaultTheme = require("../../common/teams-default.json");
const teamsDarkTheme = require("../../common/teams-dark.json");
const teamsContrastTheme = require("../../common/teams-contrast.json");
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';
import GraphServices from '../../services/GraphServices';
import { IGraphServices } from '../../services/IGraphServices';
import { Providers, SharePointProvider } from '@microsoft/mgt';
export interface ISettingsWebPartProps {
  description: string;
}

export default class SettingsWebPart extends BaseClientSideWebPart<ISettingsWebPartProps> {
  private graphService:IGraphServices;
  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
  protected async onInit(): Promise<void> {
    Providers.globalProvider = new SharePointProvider(this.context);
    this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
    this._themeVariant = this._themeProvider.tryGetTheme();
    this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
    if (this.context.sdks.microsoftTeams) { //if in teams
     
      const context = this.context.sdks.microsoftTeams!.context;
      this._applyTheme(context.theme || "default");
      this.context.sdks.microsoftTeams.teamsJs.registerOnThemeChangeHandler(
        this._applyTheme
      );
    }
    const graphClient = await this.context.msGraphClientFactory.getClient(); //Get graph service ready
    this.graphService = new GraphServices({graphClient: graphClient});
    return Promise.resolve();
  }

  //re-render on theme change
  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

//apply theme based on what is chosen
//todo: move this to common 
  private _applyTheme = (theme: string): void => {
    this.context.domElement.setAttribute("data-theme", theme);
    document.body.setAttribute("data-theme", theme);
    switch (theme) {
      case "dark":
        loadTheme({
          palette: teamsDarkTheme
        });
        break;
      case "contrast":
        loadTheme({
          palette: teamsContrastTheme
        });
        break;
      case "default":
        loadTheme({
          palette: teamsDefaultTheme
        });
        break;
      default:
        loadTheme({
          palette: teamsDefaultTheme
        });
        break;
    }
  }
  public render(): void {
    const element: React.ReactElement<ISettingsProps> = React.createElement(
      Settings,
      {
        context: this.context,
        themeVariant: this._themeVariant,
        graphService:this.graphService
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
