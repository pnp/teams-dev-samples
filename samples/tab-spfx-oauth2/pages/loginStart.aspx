<%@ Import Namespace="Microsoft.SharePoint.ApplicationPages" %> <%@ Register
Tagprefix="SharePoint" Namespace="Microsoft.SharePoint.WebControls"
Assembly="Microsoft.SharePoint, Version=15.0.0.0, Culture=neutral,
PublicKeyToken=71e9bce111e9429c" %> <%@ Register Tagprefix="Utilities"
Namespace="Microsoft.SharePoint.Utilities" Assembly="Microsoft.SharePoint,
Version=15.0.0.0, Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@
Register Tagprefix="asp" Namespace="System.Web.UI"
Assembly="System.Web.Extensions, Version=4.0.0.0, Culture=neutral,
PublicKeyToken=31bf3856ad364e35" %> <%@ Import Namespace="Microsoft.SharePoint"
%> <%@ Assembly Name="Microsoft.Web.CommandUI, Version=15.0.0.0,
Culture=neutral, PublicKeyToken=71e9bce111e9429c" %> <%@ Page Language="C#" %>
<!DOCTYPE html>
<html lang="en">
  <head>
<meta name="WebPartPageExpansion" content="full" />
    <script
      src="https://statics.teams.microsoft.com/sdk/v1.5.2/js/MicrosoftTeams.min.js"
      crossorigin="anonymous"
    ></script>
    <script>
      // Build query string from map of query parameter
      function toQueryString(queryParams) {
        let encodedQueryParams = [];
        for (let key in queryParams) {
          encodedQueryParams.push(
            key + "=" + encodeURIComponent(queryParams[key])
          );
        }
        return encodedQueryParams.join("&");
      }
      // Converts decimal to hex equivalent
      // (From ADAL.js: https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/dev/lib/adal.js)
      function _decimalToHex(number) {
        var hex = number.toString(16);
        while (hex.length < 2) {
          hex = "0" + hex;
        }
        return hex;
      }
      // Generates RFC4122 version 4 guid (128 bits)
      // (From ADAL.js: https://github.com/AzureAD/azure-activedirectory-library-for-js/blob/dev/lib/adal.js)
      function newGuid() {
        var cryptoObj = window.crypto || window.msCrypto; // for IE 11
        if (cryptoObj && cryptoObj.getRandomValues) {
          var buffer = new Uint8Array(16);
          cryptoObj.getRandomValues(buffer);
          //buffer[6] and buffer[7] represents the time_hi_and_version field. We will set the four most significant bits (4 through 7) of buffer[6] to represent decimal number 4 (UUID version number).
          buffer[6] |= 0x40; //buffer[6] | 01000000 will set the 6 bit to 1.
          buffer[6] &= 0x4f; //buffer[6] & 01001111 will set the 4, 5, and 7 bit to 0 such that bits 4-7 == 0100 = "4".
          //buffer[8] represents the clock_seq_hi_and_reserved field. We will set the two most significant bits (6 and 7) of the clock_seq_hi_and_reserved to zero and one, respectively.
          buffer[8] |= 0x80; //buffer[8] | 10000000 will set the 7 bit to 1.
          buffer[8] &= 0xbf; //buffer[8] & 10111111 will set the 6 bit to 0.
          return (
            _decimalToHex(buffer[0]) +
            _decimalToHex(buffer[1]) +
            _decimalToHex(buffer[2]) +
            _decimalToHex(buffer[3]) +
            "-" +
            _decimalToHex(buffer[4]) +
            _decimalToHex(buffer[5]) +
            "-" +
            _decimalToHex(buffer[6]) +
            _decimalToHex(buffer[7]) +
            "-" +
            _decimalToHex(buffer[8]) +
            _decimalToHex(buffer[9]) +
            "-" +
            _decimalToHex(buffer[10]) +
            _decimalToHex(buffer[11]) +
            _decimalToHex(buffer[12]) +
            _decimalToHex(buffer[13]) +
            _decimalToHex(buffer[14]) +
            _decimalToHex(buffer[15])
          );
        } else {
          var guidHolder = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx";
          var hex = "0123456789abcdef";
          var r = 0;
          var guidResponse = "";
          for (var i = 0; i < 36; i++) {
            if (guidHolder[i] !== "-" && guidHolder[i] !== "4") {
              // each x and y needs to be random
              r = (Math.random() * 16) | 0;
            }
            if (guidHolder[i] === "x") {
              guidResponse += hex[r];
            } else if (guidHolder[i] === "y") {
              // clock-seq-and-reserved first hex is filtered and remaining hex values are random
              r &= 0x3; // bit and with 0011 to set pos 2 to zero ?0??
              r |= 0x8; // set pos 3 to 1 as 1???
              guidResponse += hex[r];
            } else {
              guidResponse += guidHolder[i];
            }
          }
          return guidResponse;
        }
      }

      function getUrlParameter(name) {
        name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
        var regex = new RegExp("[\\?&]" + name + "=([^&#]*)");
        var results = regex.exec(location.search);
        return results === null
          ? ""
          : decodeURIComponent(results[1].replace(/\+/g, " "));
      }

      microsoftTeams.initialize();
      microsoftTeams.getContext(function (context) {
        // Generate random state string and store it, so we can verify it in the callback
        let state = newGuid();
        var callbackUrl ="https://ramindev.sharepoint.com//SitePages/loginComplete.aspx";

        var clientId = getUrlParameter("clientId");
        var authorizeUrl = getUrlParameter("authorizationUrl");
        localStorage.setItem("bt.state", state);
        localStorage.removeItem("simple.error");

        let queryParams = {
          client_id: clientId,
          response_type: "code",
          redirect_uri: callbackUrl,
          state: state,
        };
        // Go to the authorization endpoint (tenant-specific endpoint, not "common")
        let authorizeEndpoint = `${authorizeUrl}?${toQueryString(queryParams)}`;
        window.location.assign(authorizeEndpoint);
      });
    </script>
  </head>
  <body
    class="page-body right-sidebar skin-facebook horizontal-menu-skin-facebook"></body>
</html>
