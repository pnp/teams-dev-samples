import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";

import AuthService from "../services/AuthService";

/**
 * The tab UI used when running in Teams
 */
class TeamsAuthPopup extends React.Component {

  componentDidMount() {

    if (microsoftTeams) {
      microsoftTeams.initialize(window);
      microsoftTeams.getContext((context, error) => {
        if (context) {

          // If here we have a Teams context. Ensure we're logged in
          // and then request the access token.
          if (!AuthService.isLoggedIn()) {
            AuthService.login();
            // This call won't return - catch it on the redirect
          } else {
            AuthService.getAccessTokenEx(["User.Read", "Mail.Read"])
              .then(( { username, accessToken, expiresOn } ) => {
                if (accessToken) {
                  const response = JSON.stringify({ username, accessToken, expiresOn })
                  microsoftTeams.authentication.notifySuccess(response);
                } else {
                  microsoftTeams.authentication.notifyFailure("Unexpected failure - null token received");
                }
              })
              .catch((error) => {
                console.log(error);
                microsoftTeams.microsoftTeams.notifyFailure(error);
              });
          }
        }
      });
    }
  }

  render() {
    return (<p>Authorizing...</p>);
  }
}
export default TeamsAuthPopup;