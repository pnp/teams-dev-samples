import { TeamsApp } from '@microsoft/microsoft-graph-types';
import { useEffect, useState } from 'react';
import { useGraphClient } from './useGraphClient';

export function useGraphService(): [
  {
    loading: boolean;
    sendNotification: (
      appId: string,
      userId: string,
      categoryName: string | null,
      tabName: string,
      activityType: string,
      message: string
    ) => Promise<void>;
  }
] {
  const [client] = useGraphClient();
  const [loading, setLoading] = useState<boolean>(false);

  const _getCatalogApps = async (appId: string): Promise<TeamsApp | undefined> => {
    const results = await client?.api(`/appCatalogs/teamsApps?$filter=externalId eq '${appId}'`).get();

    return results && results.value && results.value.length === 1 ? (results.value[0] as TeamsApp) : undefined;
  };

  const sendNotification = async (
    appId: string,
    userId: string,
    categoryName: string | null,
    tabName: string,
    activityType: string,
    message: string
  ): Promise<void> => {
    setLoading(true);
    const installedApp = await _getCatalogApps(appId);

    if (installedApp) {
      try {
        await client?.api(`/users/${userId}/teamwork/sendActivityNotification`).post({
          topic: {
            source: 'text',
            value: categoryName ? categoryName : 'Kudos App',
            webUrl: `https://teams.microsoft.com/l/entity/${installedApp.id}/${tabName}`,
          },
          activityType: activityType,
          previewText: {
            content: message,
          },
        });
      } catch (err: any) {
        setLoading(false);
        throw err;
      }
    }

    setLoading(false);
  };

  useEffect(() => {}, []);

  return [{ loading: loading, sendNotification: sendNotification }];
}
