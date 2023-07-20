import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

import * as strings from 'GuestUserOverviewWebPartStrings';
import { GuestUserOverview, IGuestUserOverviewProps } from './components/GuestUserOverview';
import { ApplicationContext } from '../../util/ApplicationContext';
import { graphfi, SPFx, ConsistencyLevel, Endpoint, GraphFI } from '@pnp/graph/presets/all'
import { GraphProvider } from '../../providers/GraphProvider';
import { initializeIcons } from '@fluentui/react';
import { PnPClientStorage } from "@pnp/core/storage";
import { CacheManager } from '../../providers/CacheManager';

export interface IGuestUserOverviewWebPartProps {
}

export default class GuestUserOverviewWebPart extends BaseClientSideWebPart<IGuestUserOverviewWebPartProps> {
  private storage: PnPClientStorage;

  public render(): void {
    const element: React.ReactElement<IGuestUserOverviewProps> = React.createElement(GuestUserOverview, {});
    const graph: GraphFI = graphfi().using(ConsistencyLevel("eventual"), Endpoint("beta"), SPFx(this.context))
    const ApplicationWrapper = React.createElement(ApplicationContext.Provider,
      {
        value: {
          SPFxContext: this.context,
          Graph: graph,
          GraphProvider: new GraphProvider(graph, this.context),
          Storage: new CacheManager(this.storage)
        }
      }, element);

    ReactDom.render(ApplicationWrapper, this.domElement);
  }

  protected async onInit(): Promise<void> {
    initializeIcons();
    this.storage = new PnPClientStorage();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
    this.storage.session.deleteExpired();
    this.storage.local.deleteExpired();    
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: []
    };
  }
}
