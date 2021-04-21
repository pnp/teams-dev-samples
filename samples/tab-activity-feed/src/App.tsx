import React from 'react';
import './App.css';
import { TeamsProvider } from '@microsoft/mgt-teams-provider';
import { Providers } from '@microsoft/mgt-element';
import * as microsoftTeams from '@microsoft/teams-js';
import { Login } from '@microsoft/mgt-react';

TeamsProvider.microsoftTeamsLib = microsoftTeams;
Providers.globalProvider = new TeamsProvider({
  clientId: process.env.REACT_APP_CLIENT_ID!,
  authPopupUrl: '/auth.html',
  scopes: [
    'User.Read',
    'User.ReadBasic.All'
  ],
});

function App() {
  return (
    <div className="App">
      <Login></Login>
    </div>
  );
}

export default App;
