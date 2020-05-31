import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { escape } from '@microsoft/sp-lodash-subset';

import styles from './CallGraphWebPart.module.scss';
import * as strings from 'CallGraphWebPartStrings';
import * as MicrosoftGraph from '@microsoft/microsoft-graph-types';

export interface ICallGraphWebPartProps {
  description: string;
}

export default class CallGraphWebPart extends BaseClientSideWebPart<ICallGraphWebPartProps> {

  private mailboxHtml: string = "";
  private errorMessage: string = "";

  public onInit(): Promise<void> {

    return new Promise<void>((resolve) => {
      
      this.context.msGraphClientFactory.getClient()
      .then((client) => {
        client.api("me/mailFolders/inbox/messages")
          .get((error, response) => {
            if (error) {
              this.errorMessage = error.message;
            } else {
              const messages: [MicrosoftGraph.Message] = response.value;
              if (messages.length > 0) {
                this.mailboxHtml += `${this.properties.description}<br />` +
                                    `${messages.length} messages returned` +                                    
                                    `<ul>`;
                for (const m of messages) {
                  this.mailboxHtml += `<li>${m.receivedDateTime}<br />${m.subject}</li>`;
                }
                this.mailboxHtml += `</ul>`;
              } else {
                this.mailboxHtml = "No messages found";
              }
            }
            resolve();
          });
      });
    });
  }

  public render(): void {
    
    let resultHtml = "";
    if (this.errorMessage) {
      resultHtml = escape(this.errorMessage);
    } else {
      resultHtml = this.mailboxHtml;
    }

    this.domElement.innerHTML = `
      <div class="${ styles.callGraph }">
        <div class="${ styles.container }">
          <div class="${ styles.row }">
            <div class="${ styles.column }">
              <span class="${ styles.title }">Your Inbox from Graph</span>
              <p class="${ styles.description }">${resultHtml}</p>
            </div>
          </div>
        </div>
      </div>`;
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
