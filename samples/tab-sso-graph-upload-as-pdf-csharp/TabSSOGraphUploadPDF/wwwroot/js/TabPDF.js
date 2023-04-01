(function (TabPDF) {
  ssoToken = "";
  siteUrl = "";

  TabPDF.getSSOToken = function () {
    if (microsoftTeams) {
      microsoftTeams.initialize();
      microsoftTeams.authentication.getAuthToken({
        successCallback: (token, event) => {
          console.log(token);
          TabPDF.ssoToken = token;
          
        },
        failureCallback: (error) => {
          renderError(error);
        }
      });
    }
  }

  TabPDF.getContext = function () {
    if (microsoftTeams) {
      microsoftTeams.app.getContext()
        .then(context => {
          if (context.sharePointSite.teamSiteUrl !== "") {
            TabPDF.siteUrl = context.sharePointSite.teamSiteUrl;
          }
          else {
            TabPDF.siteUrl = "https://" + context.sharePointSite.teamSiteDomain;
          }
        });
    }
  }

  TabPDF.executeUpload = function (event) {
    TabPDF.Drag.allowDrop(event);
    const loaderDIV = document.getElementsByClassName('loader')[0];
    loaderDIV.style.display = 'flex';
    const dt = event.dataTransfer;
    const files = Array.prototype.slice.call(dt.files); // [...dt.files];
    files.forEach(fileToUpload => {
      const extensions = fileToUpload.name.split('.');
      const fileExtension = extensions[extensions.length - 1];
      TabPDF.Drag.disableHighlight(event);
      if (TabPDF.Utilities.isFileTypeSupported(fileExtension, 'PDF')) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('Name', fileToUpload.name);
        formData.append('SiteUrl', TabPDF.siteUrl);

        fetch("/api/Upload", {
          method: "post",
          headers: {
            "Authorization": "Bearer " + TabPDF.ssoToken,
            // "Content-Type": "multipart/form-data; boundary=--WebKitFormBoundaryfgtsKTYLsT7PNUVD"
          },
          body: formData
        })
        .then((response) => {
          response.text().then(resp => {
            console.log(resp);
            TabPDF.addConvertedFile(resp);
            loaderDIV.style.display = 'none';
          });
        });
      }
      else {
        alert('File type not supported!')
      }
    });
  }

  TabPDF.addConvertedFile = function (fileUrl) {
    const parentDIV = document.getElementsByClassName('dropZoneBG');
    const fileLineDIV = document.createElement('div');
    fileLineDIV.innerHTML = '<span>File uploaded to target and available <a href=' + fileUrl + '> here.</a ></span > ';
    parentDIV[0].appendChild(fileLineDIV);
  }
  /// Class 'Drag' for TabPDF
  TabPDF.Drag = {};
  {
    TabPDF.Drag.allowDrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'copy';
    }

    TabPDF.Drag.enableHighlight = function (event) {
      TabPDF.Drag.allowDrop(event);
      const bgDIV = document.getElementsByClassName('dropZone');
      bgDIV[0].classList.add('dropZoneHighlight');
    }

    TabPDF.Drag.disableHighlight = function (event) {
      TabPDF.Drag.allowDrop(event);
      const bgDIV = document.getElementsByClassName('dropZone');
      bgDIV[0].classList.remove('dropZoneHighlight');
    }
  }

  TabPDF.Utilities = {};
  {
    const supportedFileTypes = {
      PDF: ['csv', 'doc', 'docx', 'odp', 'ods', 'odt', 'pot', 'potm', 'potx', 'pps', 'ppsx', 'ppsxm', 'ppt', 'pptm', 'pptx', 'rtf', 'xls', 'xlsx']
    };

    TabPDF.Utilities.isFileTypeSupported = function (srcType, trgType) {
      if (supportedFileTypes[trgType.toUpperCase()].indexOf(srcType.toLowerCase()) > -1) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}(window.TabPDF = window.TabPDF || {}));