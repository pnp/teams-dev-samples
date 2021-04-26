import { useEffect, useState } from 'react';
import { Providers, ProviderState } from '@microsoft/mgt-element';
import { LoginChangedEvent } from '@microsoft/mgt-element';
import { useIsSignedIn } from './useIsSignedIn';

export function useGet(resource: string): [response: any, loading: boolean, error: any] {
  const [isSignedIn] = useIsSignedIn();
  const [response, setResponse] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<any>({});

  useEffect(() => {
    if (isSignedIn) {
      setLoading(true);
      Providers.globalProvider.graph
        .api(resource)
        .get()
        .then((r: any) => {
          setResponse(r);
        })
        .catch((e: any) => {
          setError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isSignedIn]);

  return [response, loading, error];
}
