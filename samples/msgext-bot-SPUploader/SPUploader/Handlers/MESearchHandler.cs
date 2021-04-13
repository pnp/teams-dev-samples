using Microsoft.Bot.Schema;
using Microsoft.Extensions.Configuration;
using MeetingExtension_SP.Helpers;
using MeetingExtension_SP.Models;
using MeetingExtension_SP.Models.Sharepoint;
using MeetingExtension_SP.Repositories;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MessageExtension_SP.Helpers;

namespace MeetingExtension_SP.Handlers
{
    public class MESearchHandler
    {
        public static async Task<List<AssetCard>> Search(string command, string assetTitle, IConfiguration configuration)
        {
            List<DocumentLibrary> assetCards=new List<DocumentLibrary>();
            SharePointRepository repository = new SharePointRepository(configuration);
            var data = await repository.GetAllItemsAsync<DocumentLibrary>("UploadedDocuments");

            var filteredData = data.ToList().Where(x => x.Name.ToLower().Contains(assetTitle)).ToList();

            if (command == Constants.RecentlyAdded)
            {
                filteredData = data.ToList().Where(x => x.Name.ToLower().Contains(assetTitle)).OrderByDescending(x=>x.TimeLastModified).ToList();
            }


            List<AssetCard> assetData = new List<AssetCard>();
            foreach (var val in filteredData)
            {
                assetData.Add(new AssetCard()
                {
                    Description = val.Description,
                    ServerRelativeUrl =val.LinkingUri!=null?val.LinkingUri: configuration["BaseURL"] + val.ServerRelativeUrl,
                    Title = val.Name,
                    ImageUrl= configuration["BaseUri"] + "/Images/MSC17_cloud_006.png",
                });
            }
            return assetData.ToList();
        }
    }
}
