import { useEffect, useState } from 'react';
import { Providers } from '@microsoft/mgt-element';
import { Client } from '@microsoft/microsoft-graph-client';
import { useIsSignedIn } from './useIsSignedIn';

export function useGraphClient(): [client: Client | undefined] {
  const [isSignedIn] = useIsSignedIn();
  const [client, setClient] = useState<Client | undefined>(undefined);

  useEffect(() => {
    if (isSignedIn) {
      if (Providers.globalProvider) {
        setClient(Providers.globalProvider.graph.client);
      }
    }
  }, [isSignedIn]);

  return [client];
}
