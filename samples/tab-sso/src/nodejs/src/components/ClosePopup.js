// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { withMsal } from '@azure/msal-react';

/**
 * This component is loaded when the Azure implicit grant flow has completed.
 */
class ClosePopup extends React.Component {

    componentDidMount() {
        console.log('component mount');
        microsoftTeams.initialize();
        
        this.props.msalContext.instance.handleRedirectPromise().then((tokenResponse) => {

            console.log(tokenResponse);

            // Check if the tokenResponse is null
            // If the tokenResponse !== null, then you are coming back from a successful authentication redirect. 
            // If the tokenResponse === null, you are not coming back from an auth redirect.
            if (tokenResponse !== null) {
                return microsoftTeams.authentication.notifySuccess(tokenResponse);
            } else {
                return microsoftTeams.authentication.notifyFailure("No token response.");
            }
        }).catch((error) => {
            // handle error, either in the library or coming back from the server
            console.log(error);
            microsoftTeams.authentication.notifyFailure(error);
        });
    }

    componentDidUpdate(prevState, nextState) {
        console.log('component update');
    }

    render() {
        return (
            <div>
                <h1>Consent flow complete.</h1>
            </div>
        );
    }
}

export default ClosePopup = withMsal(ClosePopup);