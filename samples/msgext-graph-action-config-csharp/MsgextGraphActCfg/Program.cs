using MsgextGraphSrchCfg;
using MsgextGraphSrchCfg.Bot;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Integration.AspNet.Core;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Extensions.Configuration.AzureAppConfiguration;
using Azure.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor(o => o.DetailedErrors = true);
builder.Services.AddControllers();
builder.Services.AddHttpClient("WebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
builder.Services.AddHttpContextAccessor();

// Create the Bot Framework Authentication to be used with the Bot Adapter.
builder.Configuration["MicrosoftAppType"] = "MultiTenant";
builder.Configuration["MicrosoftAppId"] = builder.Configuration.GetSection("BOT_ID")?.Value;
builder.Configuration["MicrosoftAppPassword"] = builder.Configuration.GetSection("BOT_PASSWORD")?.Value;
// Azure App Configuration
string connectionString = builder.Configuration.GetSection("AZURE_CONFIG_CONNECTION_STRING")?.Value;

// Load configuration from Azure App Configuration
// Either with secret Endpoint or Managed Identity (and simple https:// endpoint ...)
if (connectionString.StartsWith("Endpoint")) {
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString)
               // Load all keys that start with `TestApp:` and have no label
               .Select("MsgExtGraphActCfg:Settings:*", LabelFilter.Null)
               // Configure to reload configuration if the registered sentinel key is modified
               .ConfigureRefresh(refreshOptions =>
                    refreshOptions.Register("MsgExtGraphActCfg:Settings:Sentinel", refreshAll: true));
    });
}
else
{
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(new Uri(connectionString), new ManagedIdentityCredential())
               // Load all keys that start with `TestApp:` and have no label
               .Select("MsgExtGraphActCfg:Settings:*", LabelFilter.Null)
               // Configure to reload configuration if the registered sentinel key is modified
               .ConfigureRefresh(refreshOptions =>
                    refreshOptions.Register("MsgExtGraphActCfg:Settings:Sentinel", refreshAll: true));
    });
}
builder.Services.AddSingleton<BotFrameworkAuthentication, ConfigurationBotFrameworkAuthentication>();

// Add Azure App Configuration middleware to the container of services.
builder.Services.AddAzureAppConfiguration();
// Add AzureAppConfigurationSettings
builder.Services.Configure<MsgextGraphSrchCfg.Models.Settings>(builder.Configuration.GetSection("MsgExtGraphActCfg:Settings"));
// Create the Bot Framework Adapter with error handling enabled.
builder.Services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

// Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
builder.Services.AddTransient<IBot, TeamsMessageExtension>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

// Use Azure App Configuration middleware for dynamic configuration refresh.
app.UseAzureAppConfiguration();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
    endpoints.MapFallbackToPage("/_Host");
    endpoints.MapBlazorHub();
});

app.Run();

