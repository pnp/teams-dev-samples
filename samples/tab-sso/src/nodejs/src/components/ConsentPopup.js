// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { withMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';

/**
 * This component is used to redirect the user to the Azure authorization endpoint from a popup
 */
class ConsentPopup extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();
        
        this.props.msalContext.instance.loginRedirect();
    }

    componentDidUpdate(prevState, nextState) {
    }

    componentWillUnmount() {
        // This will be run on component unmount
        if (this.state.callbackId) {
            this.props.msalContext.instance.removeEventCallback(this.state.callbackId);
        }
    }

    render() {
        return (
            <div>
                <h1>Redirecting to consent page...</h1>
            </div>
        );
    }
}

// Wrap your class component in withMsal HOC to access authentication state and perform other actions. 
// Visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/class-components.md
export default ConsentPopup = withMsal(ConsentPopup);