// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamsAuthService from '../services/TeamsAuthService';

/**
 * The 'PersonalTab' component renders the main tab content
 * of your app.
 */
class Tab extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      context: {},
      username: "",
      token: ""
    }
  }

  componentDidMount(){
    // Get the user context from Teams and set it in the state
    if (microsoftTeams) {
      microsoftTeams.getContext((context, error) => {
        this.setState({
          context: context
        });
      });
    }  
  }

  render() {

      let userName = Object.keys(this.state.context).length > 0 ? this.state.context['upn'] : "";

      return (
      <div>
        <h1>Congratulations {userName}!</h1> <h3>This is your new tab! :-)</h3>
        <button onClick={this.handleGetProfile.bind(this)}>Get My Profile</button>
        <p>Username: {TeamsAuthService.getUsername()}</p>
        <p>Access token: {this.state.token}</p>
      </div>
      );
  }

  handleGetProfile() {
    // if (AuthService.isLoggedIn()) {
        TeamsAuthService.getAccessToken(["User.Read", "Mail.Read"], microsoftTeams)
      .then((token) => {
        this.setState({
          token: token
        })
      })
      .catch((error) => { console.log(error); });
    // } else {
    //   AuthService.login();
    // }
  }
}
export default Tab;