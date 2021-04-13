using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;

namespace MeetingExtension_SP.Models
{
    public class NewResourceInformation
    {       
        public string Title { get; set; }
      
        public string Description { get; set; }

        public string FileName { get; set; }

        public string SharePointFilePath { get; set; }
    }

    public class FileUploaderViewModel : NewResourceInformation
    {
        [Required]
        public IFormFile File { get; set; }
    }
}
