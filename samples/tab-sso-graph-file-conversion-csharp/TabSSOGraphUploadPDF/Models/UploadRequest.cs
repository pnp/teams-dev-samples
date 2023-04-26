namespace TabSSOGraphFileConversion.Models
{
    public class UploadRequest
    {
        public IFormFile file { get; set; }
        public string Name { get; set; }
        public string SiteUrl { get; set; }
        public string TargetType { get; set; }
    }
}
