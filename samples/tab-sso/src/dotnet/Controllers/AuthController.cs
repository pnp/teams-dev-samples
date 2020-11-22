using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using msteams_tabs_sso_sample.Models;

namespace msteams_tabs_sso_sample.Controllers
{
    public class AuthController : Controller
    {
        private readonly ILogger<AuthController> _logger;

        public AuthController(ILogger<AuthController> logger)
        {
            _logger = logger;
        }

        [Route("auth/auth-start")]
        public IActionResult authStart()
            => View();

        [Route("auth/auth-end")]
        public IActionResult authEnd()
            => View();

    }
}
