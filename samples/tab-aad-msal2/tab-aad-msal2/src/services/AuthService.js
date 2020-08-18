import * as msal from '@azure/msal-browser';
import * as Config from '../Config';

// AuthService is a singleton so one PublicClientApplication
// can retain state. This module exports the single instance
// of the service rather than the service class; just use it,
// don't new it up.
class AuthService {

    constructor() {

        const msalConfig = {
            auth: {
                clientId: Config.clientId,
                authority: Config.authority,
                redirectUri: Config.redirectUri
            },
            cache: {
                cacheLocation: "sessionStorage", // This configures where your cache will be stored
                storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
            }
        };

        // MSAL request object to use over and over
        this.request = {
            scopes: ["user.read"]
        }

        // Keep this MSAL client around to manage state across SPA "pages"
        this.msalClient = new msal.PublicClientApplication(msalConfig);
    }

    // Call this on every request to an authenticated page
    // Promise returns true if user is logged in, false if user is not
    async init() {

        let response = await this.msalClient.handleRedirectPromise();
        if (response != null && response.account.username) {
            return true;
        } else {
            const accounts = this.msalClient.getAllAccounts();
            if (accounts === null || accounts.length === 0) {
                return false;
            } else if (accounts.length > 1) {
                throw new Error("ERROR: Multiple accounts are logged in");
            } else if (accounts.length === 1) {
                return true;
            }
        }

    }

    // Determine if someone is logged in
    isLoggedIn() {
        const accounts = this.msalClient.getAllAccounts();
        return (accounts && accounts.length === 1);
    }

    // Get the logged in user name or null if not logged in
    getUsername() {
        const accounts = this.msalClient.getAllAccounts();
        let result = null;

        if (accounts && accounts.length === 1) {
            result = accounts[0].username;
        } else if (accounts && accounts.length > 1) {
            console.log('ERROR: Multiple users logged in');
        }
        return result;
    }

    // Call this to log the user in
    login() {
        try {
            this.msalClient.loginRedirect(this.request);
        }
        catch (err) { console.log(err); }
    }

    // Call this to get the access token
    async getAccessToken(scopes) {
        let { accessToken } =
            await this.getAccessTokenEx(scopes);
        return accessToken;
    }

    // Call this to get the username, access token, and expiration date
    async getAccessTokenEx(scopes) {

        this.request.account =
            this.msalClient.getAccountByUsername(this.getUsername());
        if (scopes) {
            this.request.scopes = scopes;
        }
        try {
            let resp = await this.msalClient.acquireTokenSilent(this.request);
            if (resp && resp.accessToken) {
                return {
                    username: this.getUsername(),
                    accessToken: resp.accessToken,
                    expiresOn: (new Date(resp.expiresOn)).getTime() 
                }
            } else {
                return null;
            }
        }
        catch (error) {
            if (error instanceof msal.InteractionRequiredAuthError) {
                console.warn("Silent token acquisition failed; acquiring token using redirect");
                this.msalClient.acquireTokenRedirect(this.request);
            } else {
                throw (error);
            }
        }
    }
}

export default new AuthService();