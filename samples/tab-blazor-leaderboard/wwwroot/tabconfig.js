microsoftTeams.initialize();
/**
* When the user clicks "Save", save the url for your configured tab.
* This allows for the addition of query string parameters based on
* the settings selected by the user.
*/
microsoftTeams.settings.registerOnSaveHandler((saveEvent) => {
    const baseUrl = `https://${window.location.hostname}:${window.location.port}`;
    microsoftTeams.settings.setSettings({
        "suggestedDisplayName": "My Tab",
        "entityId": "Test",
        "contentUrl": baseUrl + "/tab",
        "websiteUrl": baseUrl + "/tab"
    });
    saveEvent.notifySuccess();
});
/**
* After verifying that the settings for your tab are correctly
* filled in by the user you need to set the state of the dialog
* to be valid.  This will enable the save button in the configuration
* dialog.
*/
microsoftTeams.settings.setValidityState(true);