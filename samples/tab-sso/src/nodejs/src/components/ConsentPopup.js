// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { withMsal } from '@azure/msal-react';

/**
 * This component is used to redirect the user to the Azure authorization endpoint from a popup
 */
class ConsentPopup extends React.Component {

    componentDidMount() {

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();

        this.props.msalContext.instance.loginRedirect();
    }

    componentDidUpdate(prevState, nextState) {
        console.log('component update');
    }

    render() {
        return (
            <div>
                <h1>Redirecting to consent page...</h1>
            </div>
        );
    }
}

export default ConsentPopup = withMsal(ConsentPopup);