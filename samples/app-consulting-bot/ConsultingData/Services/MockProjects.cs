using ConsultingData.Models;
using System.Collections.Generic;
using System.Linq;

namespace ConsultingData.Services
{
    public static class MockProjects
    {
        public static List<ConsultingProject> data = new List<ConsultingProject> 
            {
                new ConsultingProject()
                {
                    ProjectId = 1,
                    Client = MockClients.data.FirstOrDefault<ConsultingClient>(
                        (c) => c.ClientId == 1),
                    Name = "Teams Migration",
                    Address = "11 Times Square",
                    City = "New York",
                    State = "NY",
                    Zip = "10036",
                    Latitude = 40.756620,
                    Longitude = -73.989790,
                    Phone = "+1 (212) 245-2100",
                    Contact = "Person 1",
                    Description = "Get everybody on Teams",
                    DocumentsUrl = "https://bgtest18.sharepoint.com/sites/Bot4Test/Shared Documents/",
                    TeamUrl = "https://teams.microsoft.com/l/team/19%3ad90eb69425bc4cc7a6a43df04be83bba%40thread.skype/conversations?groupId=a54cd0e7-1d00-420a-8b51-060c288620eb&tenantId=a25d4ef1-c73a-4dc1-bdb1-9a342260f216"
                },
                new ConsultingProject()
                {
                    ProjectId = 2,
                    Client = MockClients.data.FirstOrDefault<ConsultingClient>(
                        (c) => c.ClientId == 2),
                    Name = "Intranet Modernization",
                    Address = "5 Wayside Rd.",
                    City = "Burlington",
                    State = "MA",
                    Zip = "01803",
                    Latitude = 42.484283,
                    Longitude =  -71.191528,
                    Phone = "+1 (781) 487-6400",
                    Contact = "Person 2",
                    Description = "Make an amazing new Intranet with Modern SharePoint",
                    DocumentsUrl = "https://bgtest18.sharepoint.com/sites/Bot4Test/Shared Documents/",
                    TeamUrl = "https://teams.microsoft.com/l/team/19%3ad90eb69425bc4cc7a6a43df04be83bba%40thread.skype/conversations?groupId=a54cd0e7-1d00-420a-8b51-060c288620eb&tenantId=a25d4ef1-c73a-4dc1-bdb1-9a342260f216"
                },
                new ConsultingProject()
                {
                    ProjectId = 3,
                    Client = MockClients.data.FirstOrDefault<ConsultingClient>(
                        (c) => c.ClientId == 2),
                    Name = "Teams Development",
                    Address = "5 Wayside Rd.",
                    City = "Burlington",
                    State = "MA",
                    Zip = "01803",
                    Latitude = 42.484283,
                    Longitude =  -71.191528,
                    Phone = "+1 (781) 487-6400",
                    Contact = "Person 2",
                    Description = "Develop a killer app in Teams",
                    DocumentsUrl = "https://bgtest18.sharepoint.com/sites/Bot4Test/Shared Documents/",
                    TeamUrl = "https://teams.microsoft.com/l/team/19%3ad90eb69425bc4cc7a6a43df04be83bba%40thread.skype/conversations?groupId=a54cd0e7-1d00-420a-8b51-060c288620eb&tenantId=a25d4ef1-c73a-4dc1-bdb1-9a342260f216"
                },
                new ConsultingProject()
                {
                    ProjectId = 4,
                    Client = MockClients.data.FirstOrDefault<ConsultingClient>(
                        (c) => c.ClientId == 3),
                    Name = "O365 Consolidation",
                    Address = "200 E Randolph St.",
                    City = "Chicago",
                    State = "IL",
                    Zip = "60601",
                    Latitude = 41.885314,
                    Longitude = -87.621546,
                    Phone = "+1 (312) 555-1212",
                    Contact = "Person 3",
                    Description = "Migrate newly acquired companies into main tenant",
                    DocumentsUrl = "https://bgtest18.sharepoint.com/sites/Bot4Test/Shared Documents/",
                    TeamUrl = "https://teams.microsoft.com/l/team/19%3ad90eb69425bc4cc7a6a43df04be83bba%40thread.skype/conversations?groupId=a54cd0e7-1d00-420a-8b51-060c288620eb&tenantId=a25d4ef1-c73a-4dc1-bdb1-9a342260f216"
                },
                new ConsultingProject()
                {
                    ProjectId = 5,
                    Client = MockClients.data.FirstOrDefault<ConsultingClient>(
                        (c) => c.ClientId == 4),
                    Name = "Mark 8 Camera Development",
                    Address = "200 E Randolph St.",
                    City = "Chicago",
                    State = "IL",
                    Zip = "60601",
                    Latitude = 41.885314,
                    Longitude = -87.621546,
                    Phone = "+1 (312) 555-1212",
                    Contact = "Megan Bowen",
                    Description = "Develop a new camera for retail",
                    DocumentsUrl = "https://bgtest18.sharepoint.com/sites/Bot4Test/Shared Documents/",
                    TeamUrl = "https://teams.microsoft.com/l/team/19%3ad90eb69425bc4cc7a6a43df04be83bba%40thread.skype/conversations?groupId=a54cd0e7-1d00-420a-8b51-060c288620eb&tenantId=a25d4ef1-c73a-4dc1-bdb1-9a342260f216"
                }

        };
    }
}

