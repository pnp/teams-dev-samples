// <copyright file="Startup.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility
{
    using System;
    using Helper;
    using Interface;
    using Microsoft.AspNetCore.Authentication.AzureAD.UI;
    using Microsoft.AspNetCore.Authentication.JwtBearer;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Graph.Communications.Common.Telemetry;
    using Microsoft.IdentityModel.Logging;
    using Microsoft.IdentityModel.Tokens;
    using Sample.Common.Logging;
    using VirtualMeetingExtensibility.Repository;

    public class Startup
    {
        private readonly GraphLogger logger;
        private readonly SampleObserver observer;

        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
            StaticConfig = configuration;
            logger = new GraphLogger(typeof(Startup).Assembly.GetName().Name);
            observer = new SampleObserver(logger);
            DocumentDBRepository.Initialize();
        }

        public static IConfiguration StaticConfig { get; private set; }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson(options => options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore);
            services.AddHttpContextAccessor();
            services.AddSingleton<IGraph, GraphHelper>();
            services.AddHttpClient("AzureWebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
            services.AddHttpClient("GraphWebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
            services
                     .AddSingleton(observer)
                .AddSingleton<IGraphLogger>(logger)
                .AddAuthentication(sharedOptions =>
                {
                    sharedOptions.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
                })
                .AddJwtBearer(options =>
                {
                    var azureAdOptions = new AzureADOptions();
                    Configuration.Bind("AzureAd", azureAdOptions);
                    options.Authority = $"{azureAdOptions.Instance}{azureAdOptions.TenantId}/v2.0";
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidAudiences = AuthenticationHelper.GetValidAudiences(Configuration),
                        ValidIssuers = AuthenticationHelper.GetValidIssuers(Configuration),
                        AudienceValidator = AuthenticationHelper.AudienceValidator
                    };
                });
            services
            .AddBot(options => Configuration.Bind("Bot", options))
            .AddMvc();
            IdentityModelEventSource.ShowPII = true;
            services.AddHostedService<SchedulerHelper>();
            services.AddHostedService<ParticipantsScheduler>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");

                // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
