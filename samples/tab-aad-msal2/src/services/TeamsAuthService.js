// TeamsAuthService is a singleton so it can retain the user's
// state independent of React state. This module exports the single
// instance of the service rather than the service class; just use it,
// don't new it up.
class TeamsAuthService {

    constructor() {
        this.authState = {
            username: null,
            accessToken: null,
            expiresOn: Date.now()
        }
    }

    // Determine if someone is logged in
    isLoggedIn() {
        return Date.now() < this.authState.expiresOn;
    }

    // Get the logged in user name or null if not logged in
    getUsername() {
        return this.authState.username;
    }

    // Call this to get an access token
    getAccessToken(scopes, microsoftTeams) {

        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/TeamClock/#teamsauthpopup",
                width: 600,
                height: 535,
                successCallback: (response) => {
                    const { username, accessToken, expiresOn } =
                        JSON.parse(response);
                    this.authState = { username, accessToken, expiresOn };
                    resolve(accessToken);
                },
                failureCallback: (reason) => {
                    reject(reason);
                }
            });
    
        });

    }
}

export default new TeamsAuthService();