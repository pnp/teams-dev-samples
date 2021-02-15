// <copyright file="Startup.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot
{
    using System;
    using B2CChatBot.Bots;
    using B2CChatBot.Helpers;
    using B2CChatBot.Interfaces;
    using B2CChatBot.Repository;
    using Microsoft.AspNetCore.Builder;
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Bot.Builder;
    using Microsoft.Bot.Builder.Integration.AspNet.Core;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.DependencyInjection;
    using Microsoft.Extensions.Hosting;
    using Microsoft.Extensions.Logging;

    /// <summary>
    /// Register services in DI container, and set up middle-wares in the pipeline.
    /// </summary>
    public class Startup
    {
        /// <summary>
        /// Initializes a new instance of the <see cref="Startup"/> class.
        /// </summary>
        /// <param name="configuration">IConfiguration instance.</param>
        public Startup(IConfiguration configuration)
        {
            this.Configuration = configuration;
            StaticConfig = configuration;
        }

        /// <summary>
        /// Gets the IConfiguration.
        /// </summary>
        public static IConfiguration StaticConfig { get; private set; }

        /// <summary>
        /// Gets the IConfiguration instance.
        /// </summary>
        public IConfiguration Configuration { get; }

        /// <summary>
        /// This method gets called by the runtime. Use this method to add services to the container.
        /// </summary>
        /// <param name="services">IServiceCollection instance.</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddControllersWithViews().AddNewtonsoftJson();

            services.AddHttpClient("GraphWebClient", client => client.Timeout = TimeSpan.FromSeconds(600));

            // Create the Bot Framework Adapter with error handling enabled.
            services.AddSingleton<IBotFrameworkHttpAdapter, AdapterWithErrorHandler>();

            // Create the bot as a transient. In this case the ASP Controller is expecting an IBot.
            services.AddTransient<IBot, WebChatBot>();

            services.AddSingleton<IGraph, GraphHelper>();
            services.AddSingleton<ICard, CardHelper>();
            services.AddHttpClient("AttachmentWebClient", client => client.Timeout = TimeSpan.FromSeconds(600));
            services.AddApplicationInsightsTelemetry();
        }

        /// <summary>
        /// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        /// </summary>
        /// <param name="app">IApplicationBuilder instance.</param>
        /// <param name="env">IWebHostEnvironment instance.</param>
        /// <param name="logger">ILogger instance.</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, ILogger<Startup> logger)
        {
            try
            {
                DocumentDBRepository.Initialize();
            }
            catch (Exception e)
            {
                logger.LogError(e.Message + ' ' + e.StackTrace);
            }

            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

            app.UseStaticFiles()
            .UseWebSockets()
            .UseRouting()
            .UseAuthorization()
            .UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    name: "default",
                    pattern: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
