using Google.Protobuf.Collections;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using O365C.FuncApp.ProductCatalog.Models;
using PnP.Core.Model;
using PnP.Core.Model.SharePoint;
using PnP.Core.QueryModel;
using PnP.Core.Services;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace O365C.FuncApp.ProductCatalog.Services
{
    public interface ISharePointService
    {
        Task<List<Product>> GetProductInfo(RequestInfo requestInfo);
        Task<List<RelatedDocument>> GetRelatedDocuments(string SKUID);


    }
    public class SharePointService : ISharePointService
    {
        private readonly AzureFunctionSettings _azureFunctionSettings;
        private readonly IPnPContextFactory _pnpContextFactory;
        private readonly ILogger logger;

        public SharePointService(
            IPnPContextFactory pnpContextFactory,
            ILoggerFactory loggerFactory,
            AzureFunctionSettings azureFunctionSettings
            )
        {
            logger = loggerFactory.CreateLogger<SharePointService>();
            _pnpContextFactory = pnpContextFactory;
            _azureFunctionSettings = azureFunctionSettings;
        }

        public async Task<List<Product>> GetProductInfo(RequestInfo requestInfo)
        {
            List<Product> products = new List<Product>();
            try
            {
                // Validate the input
                if (string.IsNullOrEmpty(_azureFunctionSettings.SiteUrl))
                {
                    throw new ArgumentNullException(nameof(_azureFunctionSettings.SiteUrl), "SiteUrl cannot be null or empty.");
                }

                using (var context = await _pnpContextFactory.CreateAsync(new Uri(_azureFunctionSettings.SiteUrl)))
                {

                    //Get the list
                    var productAndServicesList = context.Web.Lists.GetByTitle("Product and Services");

                    //CAML Query
                    StringBuilder camlQuery = new StringBuilder();
                    camlQuery.Append("<View>");
                    camlQuery.Append("<Query><Where>");
                    if (!string.IsNullOrEmpty(requestInfo.ProductName))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='ProductName'/><Value Type='Text'>{requestInfo.ProductName}</Value></Contains>");
                    }
                    if (!string.IsNullOrEmpty(requestInfo.ProductDescription))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='ProductDescription'/><Value Type='Text'>{requestInfo.ProductDescription}</Value></Contains>");
                    }
                    if (!string.IsNullOrEmpty(requestInfo.RevenueType))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='RevenueType'/><Value Type='Text'>{requestInfo.RevenueType}</Value></Contains>");
                    }
                    if (!string.IsNullOrEmpty(requestInfo.ServiceArea))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='ServiceArea'/><Value Type='Text'>{requestInfo.ServiceArea}</Value></Contains>");
                    }
                    if (!string.IsNullOrEmpty(requestInfo.ServiceAreaOwner))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='ServiceAreaOwner'/><Value Type='Text'>{requestInfo.ServiceAreaOwner}</Value></Contains>");
                    }                    
                    
                    camlQuery.Append("</Where></Query></View>");

                    // Load the list items
                    productAndServicesList.LoadItemsByCamlQuery(new CamlQueryOptions()
                    {
                        ViewXml = camlQuery.ToString(),
                        DatesInUtc = true
                    });
                    await context.ExecuteAsync();                
                                      

                    // Iterate over the retrieved list items
                    foreach (var item in productAndServicesList.Items.AsRequested())
                    {
                        //var user = await context.Web.GetUserByIdAsync(Convert.ToInt32(((FieldLookupValue)item["ServiceAreaOwner"]).LookupId.ToString()));
                        var skuid = item["SKUID"]?.ToString() ?? string.Empty;
                        
                        var documents = await GetRelatedDocuments(skuid);

                        products.Add(new Product()
                        {
                            SKUID = item["SKUID"]?.ToString() ?? string.Empty,
                            Catalogue = item["Catalogue"]?.ToString() ?? string.Empty,
                            ProductName = item["ProductName"]?.ToString() ?? string.Empty,
                            ProductDescription = item["ProductDescription"]?.ToString() ?? string.Empty,
                            RevenueType = item["RevenueType"]?.ToString() ?? string.Empty,
                            PLPostingGroup = item["PLPostingGroup"]?.ToString() ?? string.Empty,
                            ServiceArea = item["ServiceArea"]?.ToString() ?? string.Empty,
                            ServiceGroup = item["ServiceGroup"]?.ToString() ?? string.Empty,
                            ServiceAreaOwner = item["ServiceAreaOwner"]?.ToString() ?? string.Empty,
                            Documents = documents
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting product info");
                //Throw exception
                throw;
            }

            return products;

        }
    
        public async Task<List<RelatedDocument>> GetRelatedDocuments(string SKUID)
        {
            List<RelatedDocument> relatedDocuments = new List<RelatedDocument>();
            try
            {
                // Validate the input
                if (string.IsNullOrEmpty(_azureFunctionSettings.SiteUrl))
                {
                    throw new ArgumentNullException(nameof(_azureFunctionSettings.SiteUrl), "SiteUrl cannot be null or empty.");
                }

                using (var context = await _pnpContextFactory.CreateAsync(new Uri(_azureFunctionSettings.SiteUrl)))
                {

                    //Get the list
                    var productAndServicesList = context.Web.Lists.GetByTitle("Product Catalog");

                    //CAML Query
                    StringBuilder camlQuery = new StringBuilder();
                    camlQuery.Append("<View>");
                    //add view fields to the query
                    camlQuery.Append("<ViewFields><FieldRef Name='ID'/><FieldRef Name='SKUID'/><FieldRef Name='File_x0020_Type'/><FieldRef Name='FileLeafRef'/><FieldRef Name='FileRef'/><FieldRef Name='ServerRedirectedEmbedUrl'/></ViewFields>");
                    camlQuery.Append("<Query><Where>");
                    if (!string.IsNullOrEmpty(SKUID))
                    {
                        camlQuery.Append($"<Contains><FieldRef Name='SKUID'/><Value Type='Text'>{SKUID}</Value></Contains>");
                    }                    
                    camlQuery.Append("</Where></Query></View>");

                    // Load the list items
                    productAndServicesList.LoadItemsByCamlQuery(new CamlQueryOptions()
                    {
                        ViewXml = camlQuery.ToString(),
                        DatesInUtc = true
                    });
                    await context.ExecuteAsync();

                    // Iterate over the retrieved list items
                    foreach (var item in productAndServicesList.Items.AsRequested())
                    {
                        
                        relatedDocuments.Add(new RelatedDocument()
                        {

                            Name = item["FileLeafRef"]?.ToString() ?? string.Empty,
                            Type = item["File_x0020_Type"]?.ToString() ?? string.Empty,
                            URL = item["ServerRedirectedEmbedUrl"]?.ToString() ?? string.Empty
                        });
                          
                                                   
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error getting product documents");
                //Throw exception
                throw;
            }

            return relatedDocuments;
        }           

    }
}
