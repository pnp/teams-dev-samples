import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { AadHttpClientFactory, AadHttpClient, HttpClientResponse } from '@microsoft/sp-http';

import styles from './TeamsMessageActionWebPart.module.scss';

export interface ITeamsMessageActionWebPartProps {
  description: string;
}

export default class TeamsMessageActionWebPart extends BaseClientSideWebPart<ITeamsMessageActionWebPartProps> {

  public render(): void {

    //microsofTeams.context will be empty is SPFx webpart is not running inside teams.
    const teamsContext = this.context.sdks.microsoftTeams.context;

    const teamId = teamsContext.groupId ? teamsContext.groupId : "";

    const channelId = teamsContext.channelId ? teamsContext.channelId : "";

    const chatId = teamsContext.chatId;

    //As of SPFx 1.11, the teams js types bundled with the SharePoint Framework don't contain the parentMessageId yet.
    let messageId = (teamsContext as any).parentMessageId;


    const queryStringParams = new URLSearchParams(window.location.search);
    if (!messageId) {
      messageId = queryStringParams.get("augMessageId");
    }

    const replyToId = queryStringParams.get("augReplyToId");

    this.getTeamsMessageDetails(this.context.aadHttpClientFactory, teamId, channelId, chatId, messageId, replyToId);

    this.domElement.innerHTML = `
      <div class="${styles.teamsMessageAction}">
        <div class="${styles.container}">
          <div class="${styles.row}">
              <span class="${styles.title}">SPFx web part inside Teams task modules!</span>
          </div>
            <div class="${styles.row}">
              <span class="${styles.subTitle}">Team Id (O365 Group Id):</span>
              <div id="teamIdContainer">${teamId}</div>
            </div>
            <div class="${styles.row}">
              <span class="${styles.subTitle}">Channel Id:</span>
              <div id="channelIdContainer">${channelId}</div>
            </div>
            <div class="${styles.row}">
              <span class="${styles.subTitle}">Chat Id:</span>
              <div id="chatIdContainer">${chatId}</div>
            </div>
            <div class="${styles.row}">
              <span class="${styles.subTitle}">Message Id:</span>
              <div id="parentMessageIdContainer">${messageId ? messageId : ""}</div>
            </div>
            <div class="${styles.row}">
              <span class="${styles.subTitle}">Message Body:</span>
              <div id="parentMessageBodyContainer"></div>
            </div>
        </div>
      </div>`;
  }

  private async getTeamsMessageDetails(aadHttpClientFactory: AadHttpClientFactory, teamId: string, channelId: string, chatId: string, messageId: string, replyToId: string) {

    const _aadHttpClient: AadHttpClient = await aadHttpClientFactory.getClient("https://graph.microsoft.com");

    let response: HttpClientResponse;

    //If teamId and channelId are present, it means the message action was invoked in a teams channel message
    if (teamId && channelId) {

      //If it's a reply to a message in a teams conversation
      if (replyToId) {
        response = await _aadHttpClient.get(`https://graph.microsoft.com//beta/teams/${teamId}/channels/${channelId}/messages/${replyToId}/replies/${messageId}`, AadHttpClient.configurations.v1);

      }
      else {
        response = await _aadHttpClient.get(`https://graph.microsoft.com/beta/teams/${teamId}/channels/${channelId}/messages/${messageId}`, AadHttpClient.configurations.v1);
      }
    }
    else if (chatId) {
      //If chatId is present, it means the message action was invoked in either a teams 1:1 chat or a group chat

      response = await _aadHttpClient.get(`https://graph.microsoft.com/beta/chats/${chatId}/messages/${messageId}`, AadHttpClient.configurations.v1);

    }

    const responseJSON = await response.json();

    document.getElementById("parentMessageBodyContainer").innerText = responseJSON.body.content;

  }
}
