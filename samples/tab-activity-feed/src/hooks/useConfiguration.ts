import { useState } from 'react';

export default interface ApplicationConfiguration {
  clientId: string;
  teamsAppId: string;
  publicUrl: string;
}

export const useConfiguration = (): [ApplicationConfiguration] => {
  const [config] = useState<ApplicationConfiguration>({
    clientId: process.env.REACT_APP_CLIENT_ID ?? '',
    teamsAppId: process.env.REACT_APP_TEAMS_APP_ID ?? '',
    publicUrl: process.env.REACT_APP_PUBLIC_URL ?? '',
  });

  return [config];
};
