// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import './App.css';
import * as microsoftTeams from "@microsoft/teams-js";
import { withMsal } from '@azure/msal-react';
import { EventType } from '@azure/msal-browser';

/**
 * This component is loaded when the Azure implicit grant flow has completed.
 */
class ClosePopup extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            callbackId: null,
        }
    }

    componentDidMount() {
        microsoftTeams.initialize();

        // This will be run on component mount
        const callbackId = this.props.msalContext.instance.addEventCallback((message) => {
            // This will be run every time an event is emitted after registering this callback
            if (message.eventType === EventType.LOGIN_SUCCESS) {
                const result = message.payload;    
                console.log(result);
                return microsoftTeams.authentication.notifySuccess(result);
            }

            if (message.eventType === EventType.LOGIN_FAILURE) {
                const result = message.payload;    
                console.log(result);
                return microsoftTeams.authentication.notifyFailure(result);
            }
        });

        this.setState({callbackId: callbackId});
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
                <h1>Consent flow complete.</h1>
            </div>
        );
    }
}

// Wrap your class component in withMsal HOC to access authentication state and perform other actions. 
// Visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/class-components.md
export default ClosePopup = withMsal(ClosePopup);