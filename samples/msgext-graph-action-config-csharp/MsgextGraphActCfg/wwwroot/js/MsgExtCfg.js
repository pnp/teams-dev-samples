(function (MsgExtCfg, $, undefined) {

  MsgExtCfg.Action = {};
  {
    //MsgExtCfg.Action.submit = function () {
    //  var name = document.getElementById("txtSelectedName").value;
    //  var id = document.getElementById("txtSelectedHiddenId").value;
    //  var newSettings = {
    //    "DocName": name,
    //    "DocID": id
    //  };
    //  microsoftTeams.authentication.notifySuccess(JSON.stringify(newSettings));
    //}
  }

  MsgExtCfg.Config = {};
  {
    MsgExtCfg.Config.saveConfig = function () {
      var siteID = document.getElementById("txtSiteID").value;
      var listID = document.getElementById("txtListID").value;
      var newSettings = {
        "siteID": siteID,
        "listID": listID
      };
      microsoftTeams.authentication.notifySuccess(JSON.stringify(newSettings));
    }
  }
}(window.MsgExtCfg = window.MsgExtCfg || {}));