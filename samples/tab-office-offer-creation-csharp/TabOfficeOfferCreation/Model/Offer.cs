namespace TabOfficeOfferCreation.Model
{
    public class Offer
    {
        public string Title { get; set; }
        public DateTime OfferDate { get; set; }
        public float Price { get; set; }
        public string SelectedVAT { get; set; }
        public string Description { get; set; }
    }
}
