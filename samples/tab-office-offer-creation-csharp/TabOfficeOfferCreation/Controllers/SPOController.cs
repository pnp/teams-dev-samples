using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PnP.Core.Auth;
using PnP.Core.Services.Builder.Configuration;
using PnP.Core.Services;
using Microsoft.Identity.Web;
using TabOfficeOfferCreation.Model;
using PnP.Core.Model.SharePoint;
using PnP.Core.QueryModel;

namespace TabOfficeOfferCreation.Controllers
{
    public class SPOController : ControllerBase
    {
        private readonly ITokenAcquisition _tokenAcquisition;
        private readonly IPnPContextFactory _pnpContextFactory;
        private readonly ILogger<GraphController> _logger;
        private readonly PnPCoreOptions _pnpCoreOptions;

        public SPOController(ITokenAcquisition tokenAcquisition, IPnPContextFactory pnpContextFactory, ILogger<GraphController> logger, PnPCoreOptions pnpCoreOptions)
        {
            _tokenAcquisition = tokenAcquisition;
            _pnpContextFactory = pnpContextFactory;
            _logger = logger;
            _pnpCoreOptions = pnpCoreOptions;
        }

        public async Task<string> CreateOfferFromTemplate(Offer offer)
        {
            using (var context = await createSiteContext())
            {
                // var web = await context.Web.GetAsync(w => w.Title, w => w.Description, w => w.MasterUrl);
                var file = await context.Web.GetFileByServerRelativeUrlAsync($"{context.Uri.PathAndQuery}/_cts/Offering/Offering.dotx");               
                Stream downloadedContentStream = await file.GetContentAsync();
                IFolder docs = await context.Web.Folders.Where(f => f.Name == "Shared Documents").FirstOrDefaultAsync();
                IFile newFile = await docs.Files.AddAsync($"{offer.Title}.docx", downloadedContentStream, false);
                await newFile.ListItemAllFields.LoadAsync();
                newFile.ListItemAllFields["Title"] = offer.Title;
                newFile.ListItemAllFields["OfferingDescription"] = offer.Description;
                newFile.ListItemAllFields["OfferingNetPrice"] = offer.Price.ToString();
                newFile.ListItemAllFields["OfferingDate"] = offer.OfferDate;
                newFile.ListItemAllFields["OfferingVAT"] = offer.SelectedVAT.Replace(".", ""); // "19" instead of ".19"
                await newFile.ListItemAllFields.UpdateAsync();

                return newFile.ServerRelativeUrl;
            }

            return "";
        }

        private async Task<PnPContext> createSiteContext()
        {
            var siteUrl = new Uri(_pnpCoreOptions.Sites["DemoSite"].SiteUrl);

            return await _pnpContextFactory.CreateAsync(siteUrl,
                            new ExternalAuthenticationProvider((resourceUri, scopes) =>
                            {
                                var token = _tokenAcquisition.GetAccessTokenForUserAsync(scopes).GetAwaiter().GetResult();
                                Console.WriteLine(token.ToString());
                                return token;
                            }
                            ));
        }
    }
}
