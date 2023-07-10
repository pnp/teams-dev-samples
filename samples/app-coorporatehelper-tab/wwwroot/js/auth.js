let accessToken;
let managerName;
let managerEmail;
let principalName;
let displayName;

$(document).ready(function () {
    microsoftTeams.app.initialize();
    microsoftTeams.app.getContext().then((context) => {
       if (context.page.id == "vacation") {
           aaa = new Date().toISOString().split("T")[0];
           $("#iddate1").min = new Date().toISOString().split("T")[0];
           $("#iddate2").min = new Date().toISOString().split("T")[0];
        }
        
    });

    getClientSideToken()
        .then((clientSideToken) => {
            return getServerSideToken(clientSideToken);

        })
        .catch((error) => {
            if (error === "invalid_grant") {
                // Display in-line button so user can consent
                $("#divError").text("Error while exchanging for Server token - invalid_grant - User or admin consent is required.");
                $("#divError").show();
                $("#consent").show();
            } else {
                // Something else went wrong
            }
        });



});

function requestConsent() {
    getToken()
        .then(data => {
            $("#consent").hide();
            $("#divError").hide();
            accessToken = data.accessToken;
            microsoftTeams.app.getContext().then((context) => {
                principalName = context.user.userPrincipalName;
                getUserInfo(context.user.userPrincipalName);
            });
        });
}

function getToken() {
    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.authenticate({
            url: window.location.origin + "/Auth/Start",
            width: 600,
            height: 535,
        }).then((result) => {
            resolve(result);
        }).catch((error) => {
            reject(error);
        });
    });
}

function getClientSideToken() {

    return new Promise((resolve, reject) => {
        microsoftTeams.authentication.getAuthToken().then((result) => {
            resolve(result);
        }).catch((error) => {
            reject("Error getting token: " + error);
        });
    });

}

function getServerSideToken(clientSideToken) {
    return new Promise((resolve, reject) => {
        microsoftTeams.app.getContext().then((context) => {
            {
                
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
                        } else if (responseJson) {
                            accessToken = responseJson;
                            principalName = context.user.userPrincipalName;
                            getUserInfo(context.user.userPrincipalName);
                        }
                    });
            }
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

function getUserInfo(principalName) {

    if (principalName) {
        let graphUrl = "https://graph.microsoft.com/v1.0/users/" + principalName + "/?$expand=manager($levels=1)";
        $.ajax({
            url: graphUrl,
            type: "GET",
            beforeSend: function (request) {
                request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            },
            success: function (profile) {
                let profileDiv = $("#divGraphProfile");
                profileDiv.empty();
                for (let key in profile) {
                    if (key == "displayName") {
                        displayName = profile[key];
                        $("<div>")
                            .append($("<b>").text("Your name is: "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }

                    if (key == "mail") {
                        $("<div>")
                            .append($("<b>").text("Your e-mail is: "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }

                    if (key == "businessPhones") {
                        $("<div>")
                            .append($("<b>").text("Your business phone is: "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }

                    if (key == "jobTitle") {
                        $("<div>")
                            .append($("<b>").text("Your job title is: "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }

                    if (key == "officeLocation") {
                        $("<div>")
                            .append($("<b>").text("Your office location is: "))
                            .append($("<span>").text(profile[key]))
                            .appendTo(profileDiv);
                    }

                    if (key == "manager") {
                        managerName = profile[key]["displayName"];
                        $("<div>")
                            .append($("<b>").text("Your manager name is: "))
                            .append($("<span>").text(managerName))
                            .appendTo(profileDiv);

                        $("<div>")
                            .append($("<b>").text("Your department is: "))
                            .append($("<span>").text(profile[key]["department"]))
                            .appendTo(profileDiv);

                        managerEmail = profile[key]["mail"];
                        let managerExpenseSpan = $("#managerName").empty().text(profile[key]["displayName"]);
                    }

                }
                $("#divGraphProfile").show();
            },
            error: function () {
                console.log("Failed");
            },
            complete: function (data) {
            }
        });
    }
}

function submitExpense() {

            let graphEmailUrl = "https://graph.microsoft.com/v1.0/me/sendMail";

            $.ajax({
                url: graphEmailUrl,
                type: "POST",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
                    xhr.setRequestHeader("Content-Type", "application/json");
                    xhr.setRequestHeader("Accept", "*/*");
                    xhr.setRequestHeader("Accept-Language", "*/*");
                    xhr.setRequestHeader("Access-Control-Allow-Origin", "*/*");
                },
                data: 
                JSON.stringify({
                    "message": {
                        "subject": "Expense Report",
                        "body": {
                            "contentType": "Text",
                            "content": "Hello, " +  managerEmail + ". I have just submitted an expense report for your approval. Name of the submission: " + $("#input__text").val()
                        },
                        "toRecipients": [
                            {
                                "emailAddress": {
                                    "address": managerEmail
                                }
                            }
                        ],
                        "ccRecipients": [
                            {
                                "emailAddress": {
                                    "address": principalName
                                }
                            }
                        ]
                    },
                    "saveToSentItems": "true"
                }),
                success: function (xhr, status, error) {
                    $("#successForm").show();
                },

                error: function (xhr, status, error) {
                    $("#errorForm").show();
                },
            });
}

function submitVacation() {

    let graphMailBoxSettingsUrl = "https://graph.microsoft.com/v1.0/me/mailboxSettings";
    $.ajax({
        url: graphMailBoxSettingsUrl,
        type: "PATCH",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
            xhr.setRequestHeader("Content-Type", "application/json");
            xhr.setRequestHeader("Accept", "*/*");
            xhr.setRequestHeader("Accept-Language", "*/*");
            xhr.setRequestHeader("Access-Control-Allow-Origin", "*/*");
        },
        data:
            JSON.stringify(
                {
                    "@odata.context": "https://graph.microsoft.com/v1.0/$metadata#Me/mailboxSettings",
                    "automaticRepliesSetting": {
                        "externalAudience": "all",
                        "externalReplyMessage": "I will be OOF from " + $("#iddate1").val() + " until " + $("#iddate2").val(),
                        "internalReplyMessage": "I will be OOF from " + $("#iddate1").val() + " until " + $("#iddate2").val(),
                        "status": "Scheduled",
                        "scheduledStartDateTime": {
                            "dateTime": $("#iddate1").val(),
                            "timeZone": "UTC"
                        },
                        "scheduledEndDateTime": {
                            "dateTime": $("#iddate2").val(),
                            "timeZone": "UTC"
                        }
                    }
                }),
        success: function (xhr, status, error) {
            let getCalendarURL = "https://graph.microsoft.com/v1.0/me/calendar";
            $.ajax({
                url: getCalendarURL,
                type: "GET",
                beforeSend: function (request) {
                    request.setRequestHeader("Authorization", `Bearer ${accessToken}`);
                },
                success: function (calendarDetails) {
                    var date = new Date($("#iddate1").val());
                    let blockCalendarURL = "https://graph.microsoft.com/v1.0/me/calendars/" + calendarDetails["id"] + "/events";

                    $.ajax({
                        url: blockCalendarURL,
                        type: "POST",
                        beforeSend: function (xhr) {
                            xhr.setRequestHeader("Authorization", `Bearer ${accessToken}`);
                            xhr.setRequestHeader("Content-Type", "application/json");
                            xhr.setRequestHeader("Accept", "*/*");
                            xhr.setRequestHeader("Accept-Language", "*/*");
                            xhr.setRequestHeader("Access-Control-Allow-Origin", "*/*");
                        },
                        data:
                            JSON.stringify({
                                "subject": "OOF",
                                "body": {
                                    "contentType": "HTML",
                                    "content": "OOF"
                                },
                                "start": {
                                    "dateTime": $("#iddate1").val(),
                                    "timeZone": "Pacific Standard Time"
                                },
                                "end": {
                                    "dateTime": $("#iddate2").val(),
                                    "timeZone": "Pacific Standard Time"
                                },
                                "location": {
                                    "displayName": "N/A"
                                },
                                "attendees": [
                                    {
                                        "emailAddress": {
                                            "address": principalName,
                                            "name": displayName
                                        },
                                        "type": "required"
                                    }
                                ]
                            }),
                        success: function (xhr, status, error) {
                            $("#successFormVacation").show();
                        },

                        error: function (xhr, status, error) {
                            $("#errorFormVacation").show();
                        },

                    });
                },
                error: function () {
                    $("#errorFormVacation").show();
                }

            })
        },

        error: function (xhr, status, error) {
            $("#errorFormVacation").show();
        }

    })

}
