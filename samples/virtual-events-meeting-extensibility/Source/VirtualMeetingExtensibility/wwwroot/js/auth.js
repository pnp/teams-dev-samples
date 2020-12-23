$(document).ready(function () {
    microsoftTeams.initialize();
    getClientSideToken()
        .then((clientSideToken) => {
            console.log("Client token successful!");
            successfulLogin();
        })
        .catch((error) => {
            console.log(error);
            if (error === "invalid_grant") {
                // Display in-line button so user can consent
                $("#login").show();
            } else {
                // Something else went wrong
            }
        });
});

function homeLogin() {
    hideProfileAndError();
    getToken().then(data => {
        accessToken = data.accessToken;
        idToken = data.idToken;
        $("#loading").hide();
    });
}

function getToken() {
    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/Start",
            width: 600,
            height: 535,
            successCallback: result => {
                resolve(result);
            },
            failureCallback: reason => {
                reject(reason);
            }
        });
    });
}

function getClientSideToken() {

    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.getAuthToken({
            successCallback: (result) => {
                idToken = result;
                resolve(result);
            },
            failureCallback: function (error) {
                reject("Error getting token: " + error);
            }
        });

    });

}

function getServerSideToken(clientSideToken) {


    return new Promise((resolve, reject) => {

        microsoftTeams.getContext((context) => {
            var scopes = ["https://graph.microsoft.com/User.Read"];
            fetch('/GetUserAccessToken', {
                method: 'get',
                headers: {
                    "Content-Type": "application/text",
                    "Authorization": "Bearer " + clientSideToken
                },
                cache: 'default'
            })
                .then((response) => {
                    if (response.ok) {
                        return response.text();
                    } else {
                        reject(response.error);
                    }
                })
                .then((responseJson) => {
                    if (IsValidJSONString(responseJson)) {
                        if (JSON.parse(responseJson).error)
                        reject(JSON.parse(responseJson).error);
                    } else if (responseJson){
                        accessToken = responseJson;
                        console.log(accessToken);
                        $("#loading").hide();
                    }
                });
        });
    });
}

function IsValidJSONString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



