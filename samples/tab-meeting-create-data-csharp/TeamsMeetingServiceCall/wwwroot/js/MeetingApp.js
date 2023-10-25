(function (MeetingApp, $, undefined) {
  ssoToken = "";
  siteUrl = "";
  meetingId = "";

  MeetingApp.getSSOToken = function () {
    if (microsoftTeams) {
      microsoftTeams.initialize();
      microsoftTeams.authentication.getAuthToken({
        successCallback: (token, event) => {
          MeetingApp.ssoToken = token;
        },
        failureCallback: (error) => {
          console.log(error);
        }
      });
    }
  }

  MeetingApp.getContext = function () {
    if (microsoftTeams) {
      microsoftTeams.app.getContext()
        .then(context => {
          // Meeting ID
          MeetingApp.meetingId = context.meeting.id;
          // ToDo: Not needed and no teamSiteUrl anyway?
          if (context.sharePointSite.teamSiteUrl !== "") {
            MeetingApp.siteUrl = context.sharePointSite.teamSiteUrl;
          }
          else {
            MeetingApp.siteUrl = "https://" + context.sharePointSite.teamSiteDomain;
          }

          MeetingApp.getCustomerData();
        });
    }
  }

  MeetingApp.getCustomerData = function () {
    const requestUrl = "/api/Customer?meetingId=" + MeetingApp.meetingId;
    

    fetch(requestUrl, {
          method: "get",
          headers: {
            "Authorization": "Bearer " + MeetingApp.ssoToken
          }
        })
        .then((response) => {
          response.text().then(resp => {
            const jsonResp = JSON.parse(resp);
            console.log(jsonResp);
            document.getElementById('customerName').innerText = jsonResp.name;
            document.getElementById('customerPhone').innerText = jsonResp.phone;
            document.getElementById('customerEmail').innerText = jsonResp.email;
            document.getElementById('customerID').innerText = jsonResp.id;
          });
        });
  }
}(window.MeetingApp = window.MeetingApp || {}));