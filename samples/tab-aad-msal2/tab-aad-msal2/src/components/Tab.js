// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import TeamsAuthService from '../services/TeamsAuthService';

class Tab extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            token: ""
        }
    }

    render() {

        return (
            <div>
                <button onClick={this.getMessages.bind(this)}>Get Mail</button>
                <p>Username: {TeamsAuthService.getUsername()}</p>
                <p>Access token: {this.state.token}</p>
            </div>
        );
    }

    getMessages() {
        TeamsAuthService.getAccessToken(["User.Read", "Mail.Read"], microsoftTeams)
            .then((token) => {
                this.setState({
                    token: token
                })
            })
            .catch((error) => { console.log(error); });
    }
}
export default Tab;