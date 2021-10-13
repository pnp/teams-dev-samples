export function initializeTeamsSdk(client_id, authEndpoint, tabEndpoint) {
    var startLoginPageUrl = "auth-start.html";
    TeamsFx.loadConfiguration({
        authentication: {
            initiateLoginEndpoint: tabEndpoint + startLoginPageUrl,
            simpleAuthEndpoint: authEndpoint,
            clientId: client_id
        }
    });
}

export async function getUserInfo() {
    var credential = new TeamsFx.TeamsUserCredential();
    var userInfo = await credential.getUserInfo();
    return userInfo;
}

export async function getToken() {
    var credential = new TeamsFx.TeamsUserCredential();
    var scope = ["User.Read"];
    var token = credential.getToken(scope);
    return token;
}

export async function popupLoginPage() {
    var credential = new TeamsFx.TeamsUserCredential();
    var scope = ["User.Read"];
    await credential.login(scope);
    return;
}