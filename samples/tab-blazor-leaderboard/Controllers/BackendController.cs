// <copyright file="HomeController.cs" company="Microsoft">
// Copyright (c) Microsoft. All Rights Reserved.
// </copyright>

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Net.Http;

namespace TeamsLeaderboard.Controllers
{
    public class BackendController : Controller
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly IHttpContextAccessor _httpContextAccessor;

        /// <summary>
        /// Initializes a new instance of the <see cref="BackendController"/> class.
        /// </summary>
        /// <param name="configuration">IConfiguration instance.</param>
        /// <param name="httpClientFactory">IHttpClientFactory instance.</param>
        /// <param name="httpContextAccessor">IHttpContextAccessor instance.</param>
        public BackendController(
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory,
            IHttpContextAccessor httpContextAccessor)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
            _httpContextAccessor = httpContextAccessor;
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns>Returns </returns>
        [HttpGet("GetInfo")]
        public ActionResult<string> GetInfo()
        {
            return Json(new
            {
                showMessage = "This is Teams Blazor tab app backend",
            });
        }


    }
}
