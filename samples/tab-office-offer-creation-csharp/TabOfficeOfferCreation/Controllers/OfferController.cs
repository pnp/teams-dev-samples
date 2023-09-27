using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.Graph;
using Microsoft.Identity.Web;
using PnP.Core.Auth;
using PnP.Core.Services;
using PnP.Core.Services.Builder.Configuration;
using TabOfficeOfferCreation.Model;

namespace TabOfficeOfferCreation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OfferController : ControllerBase
    {
        private readonly GraphServiceClient _graphClient;
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly IPnPContextFactory _pnpContextFactory;
        private readonly ILogger<GraphController> _logger;
        private readonly PnPCoreOptions _pnpCoreOptions;
        private readonly string _useGraph;
        private readonly string _siteUrl;
        public OfferController(IPnPContextFactory pnpContextFactory, ITokenAcquisition tokenAcquisition, GraphServiceClient graphClient, ILogger<GraphController> logger,
            IOptions<PnPCoreOptions> pnpCoreOptions, IConfiguration config)
        {
            _tokenAcquisition = tokenAcquisition;
            _graphClient = graphClient;
            _pnpContextFactory = pnpContextFactory;
            _logger = logger;
            _pnpCoreOptions = pnpCoreOptions?.Value;
            string siteUrl = config["PnPCore:Sites:DemoSite:SiteUrl"];
            _siteUrl = siteUrl;
            string useGraph = config["UseGraph"];
            _useGraph = useGraph;
        }
        [HttpPost]
        public async Task<ActionResult<string>> Post(Offer offer)
        {
            string userID = User.GetObjectId(); //   Claims["preferred_username"];
            _logger.LogInformation($"Received from user {userID} with name {User.GetDisplayName()}");
            _logger.LogInformation($"Received Offer {offer.Title} with descr {offer.Description}");

            if (_useGraph == "false")
            {
                SPOController spoCtrl = new SPOController(_tokenAcquisition, _pnpContextFactory, _logger, _pnpCoreOptions);
                string result = await spoCtrl.CreateOfferFromTemplate(offer);
                return result;
            }
            else
            {
                GraphController grphCtrl = new GraphController(_tokenAcquisition, _graphClient, _logger, _siteUrl);
                string result = await grphCtrl.CreateOfferFromTemplate(offer);
                return result;
            }
        }

        
    }
}
