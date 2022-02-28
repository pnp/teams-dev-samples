// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

import React from 'react';
import * as microsoftTeams from "@microsoft/teams-js";
import { Loader, Button } from '@fluentui/react-northstar';
import { withMsal } from '@azure/msal-react';

import './App.css';

/**
 * The 'PersonalTab' component renders the main tab content of your app.
 */
class Tab extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            context: {},
            ssoToken: "",
            consentRequired: false,
            consentProvided: false,
            profile: null,
            error: false
        }
    }

    // React lifecycle method that gets called once a component has finished mounting
    // Learn more: https://reactjs.org/docs/react-component.html#componentdidmount
    componentDidMount() {

        // Initialize the Microsoft Teams SDK
        microsoftTeams.initialize();

        // Get the user context from Teams and set it in the state
        microsoftTeams.getContext((context, error) => {
            this.setState({ context: context });
        });

        // Perform single sign-on authentication
        let authTokenRequestOptions = {
            successCallback: (result) => { this.ssoLoginSuccess(result) },
            failureCallback: (error) => { this.ssoLoginFailure(error) }
        };

        microsoftTeams.authentication.getAuthToken(authTokenRequestOptions);
    }

    // React lifecycle method that gets called after a component's state or props updates
    // Learn more: https://reactjs.org/docs/react-component.html#componentdidupdate
    componentDidUpdate = async (prevProps, prevState) => {

        // Check to see if is consentProvided
        if ((prevState.consentProvided === false) && (this.state.consentProvided === true) && (this.state.ssoToken)) {
            this.exchangeClientTokenForServerToken(this.state.ssoToken);
        }
    }

    ssoLoginSuccess = async (result) => {
        this.setState({ ssoToken: result });

        // The result variable is the SSO token
        this.exchangeClientTokenForServerToken(result);
    }

    ssoLoginFailure = (error) => {
        console.error("SSO failed: ", error);
        this.setState({ error: true });
    }

    // Exchange the SSO access token for a Graph access token
    // Learn more: https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow
    exchangeClientTokenForServerToken = async (token) => {

        const headers = new Headers();
        const bearer = `Bearer ${token}`;
    
        headers.append("Authorization", bearer);
    
        const options = {
            method: "GET",
            headers: headers
        };

        let response = await fetch("/getGraphAccessToken", options).catch(this.unhandledFetchError); //This calls getGraphAccessToken route in /api-server/server.js
        let data = await response.json().catch(this.unhandledFetchError);

        if (!response.ok) {
            // Unknown error
            this.setState({ error: true });
        } else if (response.ok && data['errorMessage']) {
            /**
             * Conditional access MFA requirement throws an AADSTS50076 error.
             * If the user has not enrolled in MFA, an AADSTS50079 error will be thrown instead.
             * If the user has not consented to required scopes, an AADSTS65001 error will be thrown instead.
             * In either case, sample middle-tier API will propagate the error back to the client.
             * For more, visit: https://docs.microsoft.com/azure/active-directory/develop/v2-conditional-access-dev-guide
             */

            if (data['errorMessage'].includes(50076) || data['errorMessage'].includes(50079) || data['errorMessage'].includes(65001)) {
                
                // Show a popup dialogue prompting the user to consent to the required API permissions.
                // Learn more: https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-tab-aad#initiate-authentication-flow
                this.setState({ consentRequired: true });
            } else {
                // Unknown error
                this.setState({ error: true });
            }
        } else {
            // Server side token exchange worked. Save the access_token to state, 
            // so that it can be picked up and used by the componentDidMount lifecycle method.
            this.setState({ profile: data })
        }
    }

    // Show a popup dialogue prompting the user to consent to the required API permissions. This opens ConsentPopup.js.
    // Learn more: https://docs.microsoft.com/en-us/microsoftteams/platform/tabs/how-to/authentication/auth-tab-aad#initiate-authentication-flow
    showConsentDialog = () => {

        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/auth-start",
            width: 600,
            height: 535,
            successCallback: (result) => { this.consentSuccess(result) },
            failureCallback: (reason) => { this.consentFailure(reason) }
        });
    }

    // Callback function for a successful authorization
    consentSuccess = (result) => {
        // Save the Graph access token in state
        this.setState({
            consentProvided: true
        });
    }

    consentFailure = (reason) => {
        console.error("Consent failed: ", reason);
        this.setState({ error: true });
    }

    // Generic error handler (avoids having to do async fetch in try/catch block)
    unhandledFetchError = (err) => {
        console.error("Unhandled fetch error: ", err);
        this.setState({ error: true });
    }

    render() {

        let title = Object.keys(this.state.context).length > 0 ?
            'Congratulations ' + this.state.context['upn'] + '! This is your tab' : <Loader />;

        let ssoMessage = this.state.ssoToken === "" ?
            <Loader label='Performing Azure AD single sign-on authentication...' /> : null;

        let serverExchangeMessage = (this.state.ssoToken !== "") && (!this.state.consentRequired) && (!this.state.profile) ?
            <Loader label='Exchanging SSO access token for Graph access token...' /> : null;

        let consentMessage = (this.state.consentRequired && !this.state.consentProvided) ?
            <Loader label='Consent required.' /> : null;

        let consentButton = (this.state.consentRequired && !this.state.consentProvided) ?
            <Button content="Consent" onClick={this.showConsentDialog} /> : null;

        let profile = this.state.profile ? JSON.stringify(this.state.profile) : null;
        
        let content = this.state.error ?
            <h1>ERROR: Please ensure pop-ups are allowed for this website and retry</h1>
            :
            <div>
                <h1>{title}</h1>
                <h3>{ssoMessage}</h3>
                <h3>{serverExchangeMessage}</h3>
                <h3>{consentMessage}</h3>
                <h3>{consentButton}</h3>
                <pre>{profile}</pre>
            </div>
        return (
            <div>
                {content}
            </div>
        );
    }
}

// Wrap your class component in withMsal HOC to access authentication state and perform other actions. 
// Visit: https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-react/docs/class-components.md
export default Tab = withMsal(Tab);
