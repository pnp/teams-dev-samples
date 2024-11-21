using Microsoft.AspNetCore.Components.Web;
using Microsoft.AspNetCore.Components.WebAssembly.Authentication;
using Microsoft.AspNetCore.Components.WebAssembly.Hosting;
using GraphSample;
using GraphSample.Graph;
using GraphSample.Services;
using GraphSampleBeta.Graph;
using GraphSample.ReusableComponents;
using Microsoft.JSInterop;
using Blazored.Modal;
using Microsoft.Fast.Components.FluentUI;

var builder = WebAssemblyHostBuilder.CreateDefault(args);
builder.RootComponents.Add<App>("#app");
builder.RootComponents.Add<HeadOutlet>("head::after");

// HttpClient for passing into GraphServiceClient constructor
builder.Services.AddScoped(sp => new HttpClient { BaseAddress = new Uri("https://graph.microsoft.com") });

builder.Services.AddMsalAuthentication<RemoteAuthenticationState, RemoteUserAccount>(options =>
{
    //options.ProviderOptions.LoginMode = "Redirect";
    var scopes = builder.Configuration.GetValue<string>("GraphScopes");
    if (string.IsNullOrEmpty(scopes))
    {
        Console.WriteLine("WARNING: No permission scopes were found in the GraphScopes app setting. Using default User.Read.");
        scopes = "User.Read";
    }

    foreach (var scope in scopes.Split(';'))
    {
        Console.WriteLine($"Adding {scope} to requested permissions");
        options.ProviderOptions.DefaultAccessTokenScopes.Add(scope);
    }

    builder.Configuration.Bind("AzureAd", options.ProviderOptions.Authentication);
})
.AddAccountClaimsPrincipalFactory<RemoteAuthenticationState, RemoteUserAccount, GraphUserAccountFactory>();


builder.Services.AddScoped<GraphClientFactory>();
builder.Services.AddScoped<GraphClientFactoryBeta>();
builder.Services.AddScoped<IBackendApiService, BackendApiService>();
builder.Services.AddScoped<GraphSample.AI.OpenAIService>();

builder.Services.AddScoped<InputPopup>();
builder.Services.AddBlazoredModal();
builder.Services.AddFluentUIComponents();

LibraryConfiguration config = new(ConfigurationGenerator.GetIconConfiguration(), ConfigurationGenerator.GetEmojiConfiguration());
builder.Services.AddFluentUIComponents(config);

await builder.Build().RunAsync();
