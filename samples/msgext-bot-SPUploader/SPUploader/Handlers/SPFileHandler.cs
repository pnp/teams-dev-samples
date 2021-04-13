using MeetingExtension_SP.Models;
using MeetingExtension_SP.Models.Sharepoint;
using MeetingExtension_SP.Repositories;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Graph;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Security.Policy;
using System.Threading.Tasks;

namespace MessageExtension_SP.Handlers
{
    public class SPFileHandler
    {
        public async Task ApproveFileAsync(IConfiguration configuration)
        {
            string readFileFromTemp = System.IO.File.ReadAllText(@"Temp/TempFile.txt");
            if (System.IO.File.Exists(readFileFromTemp))
            {
                SharePointRepository repository = new SharePointRepository(configuration);                
               await repository.UploadFileToSPAsync(readFileFromTemp,  false);
                System.IO.File.Delete(readFileFromTemp);                
            }            
        }

        public async Task RejectFileAsync(IConfiguration configuration)
        {
            string readFileFromTemp = System.IO.File.ReadAllText(@"Temp/TempFile.txt");
            if (System.IO.File.Exists(readFileFromTemp))
            {
                SharePointRepository repository = new SharePointRepository(configuration);
                var data = await repository.GetAllItemsAsync<DocumentLibrary>("UserDocuments");
                string filename = Path.GetFileName(readFileFromTemp).Split('_')[1];
                var recentFile = data.ToList().Where(x => x.Name.ToLower().Contains(filename.ToLower())).FirstOrDefault();
                System.IO.File.Delete(readFileFromTemp);               
            }           
        }
    }
}
