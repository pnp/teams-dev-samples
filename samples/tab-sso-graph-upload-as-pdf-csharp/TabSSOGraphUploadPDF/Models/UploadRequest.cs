namespace TabSSOGraphUploadPDF.Models
{
    public class UploadRequest
    {
        public IFormFile file { get; set; }
        public string Name { get; set; }
        public string SiteUrl { get; set; }
    }
}
