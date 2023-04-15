(function (TabFile, $, undefined) {
  ssoToken = "";
  siteUrl = "";
  selectedFilyType = "";

  TabFile.getSSOToken = function () {
    if (microsoftTeams) {
      microsoftTeams.initialize();
      microsoftTeams.authentication.getAuthToken({
        successCallback: (token, event) => {
          TabFile.ssoToken = token;
        },
        failureCallback: (error) => {
          renderError(error);
        }
      });
    }
  }

  TabFile.getContext = function () {
    if (microsoftTeams) {
      microsoftTeams.app.getContext()
        .then(context => {
          if (context.sharePointSite.teamSiteUrl !== "") {
            TabFile.siteUrl = context.sharePointSite.teamSiteUrl;
          }
          else {
            TabFile.siteUrl = "https://" + context.sharePointSite.teamSiteDomain;
          }
        });
    }
    TabFile.selectedFilyType = "PDF";
  }
  TabFile.inputUpload = function (event) {
    const input = document.getElementById('myfile');
    const files = Array.prototype.slice.call(input.files);
    TabFile.uploadFiles(files);
  }
  TabFile.executeUpload = function (event) {
    TabFile.Drag.allowDrop(event);    
    TabFile.Drag.disableHighlight(event);
    const dt = event.dataTransfer;
    const files = Array.prototype.slice.call(dt.files); // [...dt.files];
    TabFile.uploadFiles(files);
  }
  TabFile.uploadFiles = function (files) {
    const loaderDIV = document.getElementsByClassName('loader')[0];
    loaderDIV.style.display = 'flex';
    files.forEach(fileToUpload => {
      const extensions = fileToUpload.name.split('.');
      const fileExtension = extensions[extensions.length - 1];
      if (TabFile.Utilities.isFileTypeSupported(fileExtension, TabFile.selectedFilyType)) {
        const formData = new FormData();
        formData.append('file', fileToUpload);
        formData.append('Name', fileToUpload.name);
        formData.append('SiteUrl', TabFile.siteUrl);
        formData.append('TargetType', TabFile.selectedFilyType);

        fetch("/api/Upload", {
          method: "post",
          headers: {
            "Authorization": "Bearer " + TabFile.ssoToken,
            // "Content-Type": "multipart/form-data; boundary=--WebKitFormBoundaryfgtsKTYLsT7PNUVD"
          },
          body: formData
        })
          .then((response) => {
            response.text().then(resp => {
              console.log(resp);
              TabFile.addConvertedFile(resp);
              loaderDIV.style.display = 'none';
            });
          });
      }
      else {
        alert('File type not supported!')
      }
    });
  }
  TabFile.addConvertedFile = function (fileUrl) {
    const resultSpan = document.getElementById('resultSpan');
    resultSpan.innerHTML = 'File uploaded to target and available <a href=' + fileUrl + ' target="_new"> here.</a >';
  }

  TabFile.fileTypeChanged = function (event) {
    const fileType = event.target.value;
    TabFile.changeFileType(fileType);
  }

  TabFile.changeFileType = function (fileType) {
    TabFile.selectedFilyType = fileType.toUpperCase();
    const span = document.getElementById('fileTypes');
    span.innerText = TabFile.Utilities.getSupportedFileTypes(fileType.toUpperCase());
    const icon = document.getElementById('fileIcon');
    switch (fileType.toUpperCase()) {
      case 'PDF':
        icon.className = 'ms-Icon ms-Icon--PDF pdfLogo';
        break;
      case 'HTML':
        icon.className = 'ms-Icon ms-Icon--FileHTML pdfLogo';
        break;
      case 'JPG':
        icon.className = 'ms-Icon ms-Icon--PictureCenter pdfLogo';
        break;
    }
  }
  /// Class 'Drag' for TabFile
  TabFile.Drag = {};
  {
    TabFile.Drag.allowDrop = function (event) {
      event.preventDefault();
      event.stopPropagation();
      event.dataTransfer.dropEffect = 'copy';
    }

    TabFile.Drag.enableHighlight = function (event) {
      TabFile.Drag.allowDrop(event);
      const bgDIV = document.getElementsByClassName('dropZone');
      bgDIV[0].classList.add('dropZoneHighlight');
    }

    TabFile.Drag.disableHighlight = function (event) {
      TabFile.Drag.allowDrop(event);
      const bgDIV = document.getElementsByClassName('dropZone');
      bgDIV[0].classList.remove('dropZoneHighlight');
    }
  }

  TabFile.Utilities = {};
  {
    const supportedFileTypes = {
      PDF: ['csv', 'doc', 'docx', 'odp', 'ods', 'odt', 'pot', 'potm', 'potx', 'pps', 'ppsx', 'ppsxm', 'ppt', 'pptm', 'pptx', 'rtf', 'xls', 'xlsx'],
      HTML: ['eml', 'md', 'msg'],
      JPG: ['3g2', '3gp', '3gp2', '3gpp', '3mf', 'ai', 'arw', 'asf', 'avi', 'bas', 'bash', 'bat', 'bmp', 'c', 'cbl', 'cmd', 'cool', 'cpp', 'cr2', 'crw', 'cs', 'css', 'csv', 'cur', 'dcm', 'dcm30', 'dic', 'dicm', 'dicom', 'dng', 'doc', 'docx', 'dwg', 'eml', 'epi', 'eps', 'epsf', 'epsi', 'epub', 'erf', 'fbx', 'fppx', 'gif', 'glb', 'h', 'hcp', 'heic', 'heif', 'htm', 'html', 'ico', 'icon', 'java', 'jfif', 'jpeg', 'jpg', 'js', 'json', 'key', 'log', 'm2ts', 'm4a', 'm4v', 'markdown', 'md', 'mef', 'mov', 'movie', 'mp3', 'mp4', 'mp4v', 'mrw', 'msg', 'mts', 'nef', 'nrw', 'numbers', 'obj', 'odp', 'odt', 'ogg', 'orf', 'pages', 'pano', 'pdf', 'pef', 'php', 'pict', 'pl', 'ply', 'png', 'pot', 'potm', 'potx', 'pps', 'ppsx', 'ppsxm', 'ppt', 'pptm', 'pptx', 'ps', 'ps1', 'psb', 'psd', 'py', 'raw', 'rb', 'rtf', 'rw1', 'rw2', 'sh', 'sketch', 'sql', 'sr2', 'stl', 'tif', 'tiff', 'ts', 'txt', 'vb', 'webm', 'wma', 'wmv', 'xaml', 'xbm', 'xcf', 'xd', 'xml', 'xpm', 'yaml', 'yml']
    };

    TabFile.Utilities.getSupportedFileTypes = function (srcType) {
      return supportedFileTypes[srcType].join(', ');
    }

    TabFile.Utilities.isFileTypeSupported = function (srcType, trgType) {
      if (supportedFileTypes[trgType.toUpperCase()].indexOf(srcType.toLowerCase()) > -1) {
        return true;
      }
      else {
        return false;
      }
    }
  }
}(window.TabFile = window.TabFile || {}));