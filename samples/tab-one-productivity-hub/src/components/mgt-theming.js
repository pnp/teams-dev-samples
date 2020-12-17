if(window.microsoftTeams !== undefined) {
  window.microsoftTeams.initialize();
  window.microsoftTeams.getContext(function(context) { 
    if(context) {
      document.body.classList.add(`mgt-${context.theme === "default" ? "light" : context.theme}`);
      
      window.microsoftTeams.registerOnThemeChangeHandler(function(theme) { 
        document.body.classList = [""];
        document.body.classList.add(`mgt-${theme === "default" ? "light" : theme}`);
      });
    }
  });
}