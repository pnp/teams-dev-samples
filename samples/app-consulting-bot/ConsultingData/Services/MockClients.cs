using ConsultingData.Models;
using System.Collections.Generic;

namespace ConsultingData.Services
{
    public static class MockClients
    {
        public static List<ConsultingClient> data = new List<ConsultingClient>
            {
                new ConsultingClient()
                {
                    ClientId = 1,
                    Name = "Consolidated Messenger",
                    Address = "11 Times Square",
                    City = "New York",
                    State = "NY",
                    Zip = "10036",
                    Latitude = 40.756620,
                    Longitude = -73.989790,
                    Phone = "+1 (212) 245-2100",
                    Contact = "Person 1",
                    LogoUrl = "https://dev.botframework.com/client/images/channels/icons/email.png",
                    Url = "https://www.microsoft.com/en-us/mtc"
                },
                new ConsultingClient()
                {
                    ClientId = 2,
                    Name = "Contoso",
                    Address = "5 Wayside Rd.",
                    City = "Burlington",
                    State = "MA",
                    Zip = "01803",
                    Latitude = 42.484283,
                    Longitude =  -71.191528,
                    Phone = "+1 (781) 487-6400",
                    Contact = "Person 2",
                    LogoUrl = "https://msdnshared.blob.core.windows.net/media/2016/03/Contoso_logo.png",
                    Url = "https://www.microsoft.com/en-us/mtc"
                },
                new ConsultingClient()
                {
                    ClientId = 3,
                    Name = "Forth Coffee",
                    Address = "200 E Randolph St.",
                    City = "Chicago",
                    State = "IL",
                    Zip = "60601",
                    Latitude = 41.885314,
                    Longitude = -87.621546,
                    Phone = "+1 (312) 555-1212",
                    Contact = "Person 3",
                    LogoUrl = "https://dev.botframework.com/client/images/channels/icons/cortana.png",
                    Url = "https://www.microsoft.com/en-us/mtc"
                },
                                new ConsultingClient()
                {
                    ClientId = 4,
                    Name = "Southridge Video",
                    Address = "200 E Randolph St.",
                    City = "Chicago",
                    State = "IL",
                    Zip = "60601",
                    Latitude = 41.885314,
                    Longitude = -87.621546,
                    Phone = "+1 (312) 555-1212",
                    Contact = "Megan Bowen",
                    LogoUrl = "https://dev.botframework.com/client/images/channels/icons/cortana.png",
                    Url = "https://www.microsoft.com/en-us/mtc"
                },
        };
    }
}
