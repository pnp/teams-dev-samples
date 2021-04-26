// <copyright file="HomeController.cs" company="Microsoft">
// Copyright (c) Microsoft. All rights reserved.
// </copyright>

namespace B2CChatBot.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    /// <summary>
    /// Controller for renderting views.
    /// </summary>
    public class HomeController : Controller
    {
        /// <summary>
        /// Index action.
        /// </summary>
        /// <returns>Index view integrated with web chat.</returns>
        public ActionResult Index()
        {
            return this.View();
        }
    }
}
