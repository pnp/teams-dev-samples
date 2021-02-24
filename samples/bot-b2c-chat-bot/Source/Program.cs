// <copyright file="Program.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot
{
    using Microsoft.AspNetCore.Hosting;
    using Microsoft.Extensions.Hosting;

    /// <summary>
    /// Program class of the web chat application.
    /// </summary>
    public class Program
    {
        /// <summary>
        /// Main function of the web chat application.
        /// It builds a web host, then launches the web chat into it.
        /// </summary>
        /// <param name="args">Arguments passed in to the function.</param>
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        /// <summary>
        /// Create the web host builder.
        /// </summary>
        /// <param name="args">Arguments passed into the main function.</param>
        /// <returns>A web host builder instance.</returns>
        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
