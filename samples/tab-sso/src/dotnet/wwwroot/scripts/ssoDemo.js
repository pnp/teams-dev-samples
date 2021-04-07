(function () {
    'use strict';

    // 1. Get auth token
    // Ask Teams to get us a token from AAD
    function getClientSideToken() {

        return new Promise((resolve, reject) => {

            display("1. Get auth token from Microsoft Teams");

            microsoftTeams.authentication.getAuthToken({
                successCallback: (result) => {
                    display(result);

                    let decodedToken = jwt_decode(result);

                    display("Now let's use the token's data:", "div");
                    display("name: " + decodedToken.name, "div");
                    display("objectId: " + decodedToken.oid, "div");
                    display("preferred_username: " + decodedToken.preferred_username, "div");
                    display("tenantId: " + decodedToken.tid, "div");

                    display("We will send the client side token to service. Service will validate the token and call Microsoft graph on behalf of user:");

                    resolve(result);
                },
                failureCallback: function (error) {
                    reject("Error getting token: " + error);
                }
            });

        });

    }

    // 2. Get users detail from Microsoft Graph
    // using the web service (see /auth/token handler in app.js)
    function getUserDataFromServer(clientSideToken) {

        display("2. Fetch data from Microsoft graph");

        return new Promise((resolve, reject) => {

            microsoftTeams.getContext((context) => {
                const headers = new Headers();
                const bearer = `Bearer ${clientSideToken}`;

                headers.append("Authorization", bearer);

                const options = {
                    method: "GET",
                    headers: headers
                };
                fetch('/auth/token', options)
                    .then((response) => {
                        // console.log(response.json())
                        if (response.ok) {
                            return response.text();
                        } else {
                            reject(response.error);
                        }
                    })
                    .then((responseJson) => {
                        if (responseJson.error) {
                            reject(responseJson.error);
                        }
                        else if ("unauthorized_client" === responseJson || "invalid_grant" === responseJson) {
                            reject(responseJson);
                        } else {
                            console.log(responseJson);
                            const serverSideToken = responseJson.split(',');
                            serverSideToken.map(x=>display(x));
                            resolve(serverSideToken);
                        }
                    });
            });
        });
    }

    // Show the consent pop-up
    function requestConsent() {
        return new Promise((resolve, reject) => {
            microsoftTeams.authentication.authenticate({
                url: window.location.origin + "/auth/authPopup",
                width: 600,
                height: 535,
                successCallback: (result) => {
                    resolve(result);
                },
                failureCallback: (reason) => {
                    reject(JSON.stringify(reason));
                }
            });
        });
    }

    // Add text to the display in a <p> or other HTML element
    function display(text, elementTag) {
        var logDiv = document.getElementById('logs');
        var newElement = document.createElement(elementTag ? elementTag : "p");
        newElement.innerText = text;
        logDiv.append(newElement);
        console.log("ssoDemo: " + text);
        return newElement;
    }

    microsoftTeams.initialize();

    // In-line code
    getClientSideToken()
        .then((clientSideToken) => {
            return getUserDataFromServer(clientSideToken);
        })
        .catch((error) => {
            if ("unauthorized_client" === error || "invalid_grant" === error) {
                display(`Error: ${error} - user or admin consent required`);
                // Display in-line button so user can consent
                let button = display("Consent", "button");
                button.onclick = (() => {
                    requestConsent()
                        .then((result) => {
                            if (result) {
                                // Consent succeeded - use the token we got back
                                display(`Received access token ${result.accessToken}`);
                                window.location.reload();
                            }
                        })
                        .catch((error) => {
                            display(`ERROR ${error}`);
                            // Consent failed - offer to refresh the page
                            button.disabled = true;
                            let refreshButton = display("Refresh page", "button");
                            refreshButton.onclick = (() => { window.location.reload(); });
                        });
                });
            } else {
                // Something else went wrong
                display(`Error from web service: ${error}`);
            }
        });

    // Use the current user's theme
    microsoftTeams.getContext(function (context) {
        setTheme(context.theme);
    });

    // Handle theme changes
    microsoftTeams.registerOnThemeChangeHandler(function (theme) {
        setTheme(theme);
    });

    // Set the desired theme
    function setTheme(theme) {
        if (theme) {
            document.body.className = 'theme-' + (theme === 'default' ? 'light' : theme);
        }
    }

})();
