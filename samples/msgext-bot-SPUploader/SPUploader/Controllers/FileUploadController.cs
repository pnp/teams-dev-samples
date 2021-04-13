using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using MeetingExtension_SP.Models;
using MeetingExtension_SP.Repositories;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using MessageExtension_SP.Helpers;
using System.Net.Http;
using AdaptiveCards;
using Microsoft.Win32.SafeHandles;
using MeetingExtension_SP.Helpers;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Graph;
using System.Net.Http.Headers;
using Microsoft.Identity.Client;
using MeetingExtension_SP.Models.Sharepoint;
using MessageExtension_SP.Handlers;
using MessageExtension_SP;
using MessageExtension_SP.Models;

namespace MeetingExtension_SP.Controllers
{
    public class FileUploadController : Controller
    {
        private readonly IConfiguration configuration;
        //private readonly ISharepointRepository repository;
        private readonly IHostingEnvironment hostingEnvironment;

        public FileUploadController(IHostingEnvironment hostingEnvironment, IConfiguration configuration)
        {
            // this.repository = repository;
            this.configuration = configuration;
            this.hostingEnvironment = hostingEnvironment;
        }
      
        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public IActionResult Upload()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Upload(FileUploaderViewModel fileUpload)
        {
            if (ModelState.IsValid)
            {
                string uploadsfolder = Path.Combine(this.hostingEnvironment.WebRootPath, "Files");
                string uniqueFileName = Guid.NewGuid().ToString() + "_" + fileUpload.File.FileName;
                string fileLocation = @"wwwroot/Files/" + uniqueFileName;
                if (fileUpload.File != null)
                {
                    // Write it to server.
                    using (FileStream fs = System.IO.File.Create(fileLocation))
                    {
                        await fileUpload.File.CopyToAsync(fs);
                    }

                    SharePointRepository repository = new SharePointRepository(configuration);

                    if (await repository.UploadFileToSPAsync(fileLocation, true))
                    {
                        var tempFilePath = @"Temp/TempFile.txt";
                        System.IO.File.WriteAllText(tempFilePath, fileLocation);

                        //send the card to channel based on team member role                      
                        ChannelHandler channelHandler = new ChannelHandler();
                        await channelHandler.SendConversation(configuration, false, fileUpload);
                        return null;
                    }
                    else
                    {
                        ModelState.AddModelError(string.Empty, "Failed to upload your file. Please try again later.");
                    }
                }
            }

            return View(fileUpload);
        }
    }
}
