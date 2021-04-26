import { TeamsApp } from '@microsoft/microsoft-graph-types';
import { Providers } from '@microsoft/mgt';

export async function getInstalledApp(appId: string): Promise<TeamsApp | undefined> {
  const client = Providers.globalProvider.graph.client; //useGraphClient();

  const results = await client?.api(`/appCatalogs/teamsApps?$filter=externalId eq '${appId}'`).get();

  return results && results.value && results.value.length == 1 ? (results.value[0] as TeamsApp) : undefined;
}

export async function sendNotification(
  appId: string,
  userId: string,
  categoryName: string,
  tabName: string,
  activityType: string,
  message: string
): Promise<void> {
  const client = Providers.globalProvider.graph.client;

  await client?.api(`/users/${userId}/teamwork/sendActivityNotification`).post({
    topic: {
      source: 'text',
      value: categoryName,
      webUrl: `https://teams.microsoft.com/l/entity/${appId}/${tabName}`,
    },
    activityType: activityType,
    previewText: {
      content: message,
    },
  });
}
