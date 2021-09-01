namespace IncidentManagement.Models
{
    public class ReviewIncidentCardOptions
    {
        public string CreatedBy { get; set; }
        public string CreatedByUserID { get; set; }
        public string CreatedUtc { get; set; }
        public string ServiceName { get; set; }
        public string ImagePath { get; set; }
        public string ImageAlt { get; set; }
        public string ProfileImage { get; set; }
        public string AssignedToUserID { get; set; }
        public string IncidentTitle { get; set; }
        public string IncidentDescription { get; set; }
        public string IncidentCategory { get; set; }
        public string UserMRI { get; set; }
    }
}
