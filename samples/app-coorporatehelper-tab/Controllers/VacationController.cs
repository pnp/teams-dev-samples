using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Diagnostics;
using System.Net.Http;
using TeamsAuthSSO.Models;

namespace CoorporateHelper.Controllers
{
	public class VacationController : Controller
	{
		private readonly IConfiguration _configuration;
		private readonly IHttpClientFactory _httpClientFactory;
		private readonly IHttpContextAccessor _httpContextAccessor;

		/// <summary>
		/// Initializes a new instance of the <see cref="VacationController"/> class.
		/// </summary>
		/// <param name="configuration">IConfiguration instance.</param>
		/// <param name="httpClientFactory">IHttpClientFactory instance.</param>
		/// <param name="httpContextAccessor">IHttpContextAccessor instance.</param>
		public VacationController(
			IConfiguration configuration,
			IHttpClientFactory httpClientFactory,
			IHttpContextAccessor httpContextAccessor)
		{
			_configuration = configuration;
			_httpClientFactory = httpClientFactory;
			_httpContextAccessor = httpContextAccessor;
		}

		public IActionResult Vacations()
		{
			return View();
		}

		[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
		public IActionResult Error()
		{
			return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
		}
	}
}
