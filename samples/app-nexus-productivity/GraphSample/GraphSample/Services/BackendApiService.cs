using System;
using System.Text.Json;
using SharedModels.Models;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using System.Net.Http.Json;
using System.Threading.Tasks;

namespace GraphSample.Services
{
	public class BackendApiService: IBackendApiService
	{

        private readonly HttpClient httpClient;

        public BackendApiService(HttpClient httpClient)
		{
			this.httpClient = httpClient;
		}

		public async Task<List<ApplicationTimeline>?> getUserTimelinesAsync(string username)
		{
			var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/get-timelines/{username}");

            if (response.IsSuccessStatusCode)
            {
                string responseBody = await response.Content.ReadAsStringAsync();

                List<ApplicationTimeline>? timelines = BsonSerializer.Deserialize<List<ApplicationTimeline>>(responseBody);
                return timelines;
            }
            return null;
        }


        public async Task<ApplicationTimeline> getUserTimelineAsync(string username, int timelineID)
        {
            var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/get-timeline/{username}/{timelineID}");
            string responseBody = await response.Content.ReadAsStringAsync();

            ApplicationTimeline timelines = BsonSerializer.Deserialize<ApplicationTimeline>(responseBody);
            return timelines;
        }

        public async Task<bool> createApplicant(string username)
        {
            var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/create-applicant/{username}");
            return response.IsSuccessStatusCode;
        }


        public async Task<int> addTimeline(string username, TimelineBson newTimelineBson)
        {
            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/add-timeline/{username}", newTimelineBson);
            string responseBody = await response.Content.ReadAsStringAsync();
            int newTimelineID = int.Parse(responseBody);
            return response.IsSuccessStatusCode ? newTimelineID : -1;

        }

        public async Task<bool> updateReadEmailsDict(string username, ReadEmailsBson readEmails)
        {
            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-read-emails/{username}", readEmails);
            return response.IsSuccessStatusCode;
        }


        public async Task<bool> removeTimeline(string username, int timelineID)
        {

            var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/remove-timeline/{username}/{timelineID}");

            return response.IsSuccessStatusCode;

        }


        public async Task<bool> removeEmail(string email, string username, int timelineID)
        {
            var selectedEmail = new EmailBson { emailAddress = email, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/remove-email/{username}", selectedEmail);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> addEmail(string email, string username, int timelineID)
        {
            var selectedEmail = new EmailBson { emailAddress = email, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/add-email/{username}", selectedEmail);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> addEmails(List<string> emails, string username, int timelineID)
        {
            var updatedEmails = new EmailsBson { emailAddresses = emails, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/add-emails/{username}", updatedEmails);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> removeAssessment(Assessment assessment, string username, int timelineID)
        {
            var selectedAssessment = new AssessmentBson { assessment =  assessment, timelineID = timelineID};

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/remove-assessment/{username}", selectedAssessment);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> addAssessment(Assessment assessment, string username, int timelineID)
        {
            var newAssessment = new AssessmentBson { assessment = assessment, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/add-assessment/{username}", newAssessment);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> addAssessments(List<Assessment> assessments, string username, int timelineID)
        {
            var newAssessments = new AssessmentsBson { assessments = assessments, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/add-assessments/{username}", newAssessments);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> updateAssessments(List<Assessment> assessments, string username, int timelineID)
        {
            var updatedAssessments = new AssessmentsBson { assessments = assessments, timelineID = timelineID };

            Console.WriteLine("In backend API funciton");
            foreach(var assessment in updatedAssessments.assessments){
                Console.WriteLine(assessment.date);
            }
            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-assessments/{username}", updatedAssessments);

            return response.IsSuccessStatusCode;

        }

        public async Task<bool> updateAssessmentStatus(Assessment assessment, string username, int timelineID, AssessmentStatus newStatus)
        {
            var  newAssessment = new AssessmentBson { assessment = assessment, timelineID =  timelineID};

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-assessment-status/{username}/{newStatus}", newAssessment);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> updateAssessmentType(Assessment assessment, string username, int timelineID, AssessmentType newType, string? customDescription)
        {
            Assessment newAssessment = new Assessment{
                date = assessment.date,
                status = assessment.status,
                taskId = assessment.taskId,
                todoScheduled = assessment.todoScheduled,
                type = newType,
                customDescription = customDescription
            };

            var  newAssessmentBson = new AssessmentBson { assessment = newAssessment, timelineID =  timelineID};

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-assessment-type/{username}", newAssessmentBson);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> updateAssessmentDate(string username, int timelineID, DateTimeOffset oldDate, DateTimeOffset newDate)
        {
            
            var  datesBson = new DatesBson { 
                oldDate = oldDate,
                newDate = newDate,
                timelineID =  timelineID
                };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-assessment-date/{username}/", datesBson);

            return response.IsSuccessStatusCode;
        }


        public async Task<bool> updateAssessmentTodo(Assessment assessment, string username, int timelineID, bool newTodoStatus)
        {
            var newAssessment = new AssessmentBson { assessment = assessment, timelineID = timelineID };

            var response = await httpClient.PostAsJsonAsync($"https://localhost:7023/api/JobApplicants/update-assessment-todo/{username}/{newTodoStatus}", newAssessment);

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> updateAlertLevel(int timelineID, string username, int newLevel)
        {
            var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/update-alert-level/{username}/{timelineID}/{newLevel}");

            return response.IsSuccessStatusCode;
        }

        public async Task<bool> updateArchivedStatus(int timelineID, string username, bool newStatus)
        {
            var response = await httpClient.GetAsync($"https://localhost:7023/api/JobApplicants/update-archived-status/{username}/{timelineID}/{newStatus}");

            return response.IsSuccessStatusCode;
        }
    }
}

