// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { HashRouter as Router, Route } from "react-router-dom";

import AuthService from '../services/AuthService'

import Privacy from "./Privacy";
import TermsOfUse from "./TermsOfUse";
import Tab from "./Tab";
import TeamsAuthPopup from './TeamsAuthPopup';
import TeamsHostError from './TeamsHostError';
import Web from './Web';

class App extends React.Component {

  constructor() {
    super();
    this.state = {
      authInitialized: false
    }
  }

  componentDidMount() {
    // React routing and OAuth don't play nice together
    // Take care of the OAuth fun before routing
    AuthService.init().then(() => {
      this.setState({
        authInitialized: true
      });
    })
  }

  render() {

    if (microsoftTeams) {

      if (!this.state.authInitialized) {

        // Wait for Auth Service to initialize
        return (<p>Authorizing...</p>);

      } else {

        // Set app routings that don't require microsoft Teams
        // SDK functionality.  Show an error if trying to access the
        // Home page.
        if (window.parent === window.self) {
          return (
            <Router>
              <Route exact path="/privacy" component={Privacy} />
              <Route exact path="/termsofuse" component={TermsOfUse} />
              <Route exact path="/tab" component={TeamsHostError} />
              <Route exact path="/web" component={Web} />
              <Route exact path="/teamsauthpopup" component={TeamsAuthPopup} />
            </Router>
          );
        }

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize(window);

        // Display the app home page hosted in Teams
        return (
          <Router>
            <Route exact path="/tab" component={Tab} />
          </Router>
        );
      }

      // // Error when the Microsoft Teams SDK is not found
      // // in the project.
      // return (
      //   <h3>Microsoft Teams SDK not found.</h3>
      // );
    }
  }
}

export default App;
