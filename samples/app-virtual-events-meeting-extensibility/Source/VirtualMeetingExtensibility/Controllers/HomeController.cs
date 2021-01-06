// <copyright file="HomeController.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Controllers
{
    using System.Diagnostics;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Extensions.Logging;
    using Models;

    /// <summary>
    /// Controller for rendering views
    /// </summary>
    public class HomeController : Controller
    {
        private readonly ILogger<HomeController> _logger;
        private readonly IConfiguration _configuration;

        /// <summary>
        /// Initializes a new instance of the <see cref="HomeController"/> class.
        /// </summary>
        /// <param name="logger">ILogger instance</param>
        /// <param name="configuration">IConfiguration instance</param>
        public HomeController(ILogger<HomeController> logger, IConfiguration configuration)
        {
            _logger = logger;
            _configuration = configuration;
        }

        /// <summary>
        /// Returns Landing view
        /// </summary>
        /// <returns>Landing view</returns>
        public IActionResult Index()
        {
            return View();
        }

        /// <summary>
        /// Return privacy view
        /// </summary>
        /// <returns>privacy view</returns>
        public IActionResult Privacy()
        {
            return View();
        }

        /// <summary>
        /// Returns error view.
        /// </summary>
        /// <returns>error view</returns>
        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
        }

        /// <summary>
        /// Authentication start
        /// </summary>
        /// <returns>current View</returns>
        [HttpGet("Start")]
        public IActionResult Start()
        {
            ViewBag.AzureClientId = _configuration["AzureAd:AppId"];
            return View();
        }

        /// <summary>
        /// Authentication End
        /// </summary>
        /// <returns>current View</returns>
        [HttpGet("End")]
        public IActionResult End()
        {
            return View();
        }

        /// <summary>
        /// Authentication action
        /// </summary>
        /// <returns>Authentication view</returns>
        [HttpGet("auth")]
        public IActionResult Auth()
        {
            return View();
        }

        /// <summary>
        /// Configure Action
        /// </summary>
        /// <returns>Configure view</returns>
        [Route("configure")]
        public ActionResult Configure()
        {
            return View();
        }

        /// <summary>
        /// Add notes action
        /// </summary>
        /// <returns>Add Notes view</returns>
        [Route("addnotes")]
        public ActionResult AddNotes()
        {
            return View();
        }
    }
}
