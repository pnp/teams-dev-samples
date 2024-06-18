using System;
using System.Threading.Tasks;
using SharedModels.Models;

namespace GraphSample.Services
{
	public interface IBackendApiService
	{
        public Task<List<ApplicationTimeline>?> getUserTimelinesAsync(string username);
        public Task<ApplicationTimeline> getUserTimelineAsync(string username, int timelineID);
        public Task<bool> removeEmail(string email, string username, int timelineID);
        public Task<bool> addEmail(string email, string username, int timelineID);
        public Task<bool> removeAssessment(Assessment assessment, string username, int timelineID);
        public Task<bool> addAssessment(Assessment assessment, string username, int timelineID);
        public Task<bool> addAssessments(List<Assessment> assessments, string username, int timelineID);
        public Task<bool> updateAssessments(List<Assessment> assessments, string username, int timelineID);
        public Task<int> addTimeline(string username, TimelineBson newTimeLineBson);
        public Task<bool> removeTimeline(string username, int timelineID);
        public Task<bool> updateReadEmailsDict(string username, ReadEmailsBson readEmails);
        public Task<bool> createApplicant(string username);
        public Task<bool> updateAssessmentStatus(Assessment assessment, string username, int timelineID, AssessmentStatus newStatus);
        public Task<bool> updateAssessmentType(Assessment assessment, string username, int timelineID, AssessmentType newType, string? customDescription);
        public Task<bool> updateAssessmentDate(string username, int timelineID, DateTimeOffset oldDate, DateTimeOffset newDate);
        public Task<bool> updateAssessmentTodo(Assessment assessment, string username, int timelineID, bool newTodoStatus);
        public Task<bool> updateAlertLevel(int timelineID, string username, int newLevel);
        public Task<bool> updateArchivedStatus(int timelineID, string username, bool newStatus);
        public Task<bool> addEmails(List<string> emails, string username, int timelineID);
    }
}

