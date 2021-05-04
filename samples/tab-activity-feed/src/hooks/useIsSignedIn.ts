import { useEffect, useState } from 'react';
import { Providers, ProviderState } from '@microsoft/mgt-element';

export function useIsSignedIn(): [boolean] {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);

  const updateState = () => {
    let provider = Providers.globalProvider;
    setIsSignedIn(provider && provider.state === ProviderState.SignedIn);
  };

  useEffect(() => {
    Providers.onProviderUpdated(updateState);
    updateState();

    return () => {
      Providers.removeProviderUpdatedListener(updateState);
    };
  }, []);

  return [isSignedIn];
}
