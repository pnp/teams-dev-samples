using ConsultingData.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ConsultingData.Services
{
    // Simple mock for now
    public class ConsultingDataService
    {
        public async Task<List<ConsultingProject>> GetProjects(string query = null)
        {
            if (string.IsNullOrEmpty(query))
            {
                return MockProjects.data;
            }
            else
            {
                // Brute force string match on either client or project name
                return MockProjects.data.Where((p) =>
                    p.Client.Name.ToLower().IndexOf(query.ToLower()) >= 0 ||
                    p.Name.ToLower().IndexOf(query.ToLower()) >= 0).ToList();
            }
        }

        public async Task<ConsultingProject> GetProjectByName(string projectName)
        {
            ConsultingProject result = MockProjects.data.Where((p) =>
                p.Name == projectName).FirstOrDefault();

            return result;
        }
    }
}
