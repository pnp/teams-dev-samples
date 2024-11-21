window.mgtInterop = {
    configureProvider: (accessToken) => {
      let provider = new mgt.SimpleProvider((scopes) => {
        return Promise.resolve(accessToken);
      });
  
      mgt.Providers.globalProvider = provider;
      mgt.Providers.globalProvider.setState(mgt.ProviderState.SignedIn);
    },
  };