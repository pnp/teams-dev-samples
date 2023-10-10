using TabOfficeOfferCreation;
using TabOfficeOfferCreation.Interop.TeamsSDK;
using Microsoft.Identity.Web;
using PnP.Core.Auth.Services.Builder.Configuration;
using PnP.Core.Services.Builder.Configuration;

var builder = WebApplication.CreateBuilder(args);

builder.Services
    // Use Web API authentication (default JWT bearer token scheme)
    .AddMicrosoftIdentityWebApiAuthentication(builder.Configuration, "TeamsFx:Authentication")
    // Enable token acquisition via on-behalf-of flow
    .EnableTokenAcquisitionToCallDownstreamApi()
    // Add authenticated Graph client via dependency injection
    .AddMicrosoftGraph(builder.Configuration.GetSection("Graph"))
    // Use in-memory token cache
    // See https://github.com/AzureAD/microsoft-identity-web/wiki/token-cache-serialization
    .AddInMemoryTokenCaches();

// Add the PnP Core SDK library
builder.Services.AddPnPCore();
builder.Services.Configure<PnPCoreOptions>(builder.Configuration.GetSection("PnPCore"));
builder.Services.AddPnPCoreAuthentication();
builder.Services.Configure<PnPCoreAuthenticationOptions>(builder.Configuration.GetSection("PnPCore"));

builder.Services.AddRazorPages();
builder.Services.AddServerSideBlazor();

var config = builder.Configuration.Get<ConfigOptions>();
builder.Services.AddTeamsFx(config.TeamsFx.Authentication);
builder.Services.AddScoped<MicrosoftTeams>();

builder.Services.AddControllers();
builder.Services.AddHttpClient("WebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
builder.Services.AddHttpContextAccessor();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
else
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapBlazorHub();
    endpoints.MapFallbackToPage("/_Host");
    endpoints.MapControllers();
});

app.Run();

