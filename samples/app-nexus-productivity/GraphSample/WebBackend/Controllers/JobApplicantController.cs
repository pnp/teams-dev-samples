using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Bson.Serialization;
using MongoDB.Driver.Core.Configuration;
using SharedModels.Models;
using static MongoDB.Driver.WriteConcern;
using System.Net.Mail;
using System.Collections.Generic;
using System;

namespace WebBackend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class JobApplicantsController : ControllerBase
{

    private readonly ILogger<JobApplicantsController> _logger;

    private readonly string _connectionString;

    private readonly MongoClient _mongoClient;

    private readonly IMongoCollection<JobApplicant> _collection;

    public JobApplicantsController(ILogger<JobApplicantsController> logger)
    {
        _logger = logger;
        _connectionString = "mongodb+srv://konSougiou:Pplkk3614@graphbackend.53zov5b.mongodb.net/?retryWrites=true&w=majority";
        _mongoClient = new MongoClient(_connectionString);
        _collection = _mongoClient.GetDatabase("GraphApplication").GetCollection<JobApplicant>("JobApplicationTimelines");

    }


    [HttpGet]
    [Route("get-timelines/{username}")]
    public async Task<IActionResult> GetTimelines(string username)
    {
        var filter = Builders<JobApplicant>.Filter.Eq("username", username);
        var applicant = await _collection.Find(filter).FirstOrDefaultAsync();
        if (applicant != null)
        {
            return Ok(applicant.applicationTimelines);
        }
        else
        {
            return NotFound();
        }
    }

    [HttpGet]
    [Route("get-timeline/{username}/{timelineID}")]
    public async Task<IActionResult> GetTimeline(string username, int timelineID)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username));

        var applicant = await _collection.Find(filter).FirstOrDefaultAsync();

        if (applicant != null)
        {
            foreach (ApplicationTimeline timeline in applicant.applicationTimelines)
            {
                if (timeline.timelineID == timelineID)
                {
                    return Ok(timeline);
                }
            }
            return NotFound();

        }
        else
        {
            return NotFound();
        }
    }



    [Route("create-applicant/{username}")]
    [HttpGet]
    public async Task<IActionResult> CreateApplicant(string username)
    {

        JobApplicant newApplicant = new JobApplicant
        {
            username = username,
            applicationTimelines = new List<ApplicationTimeline>(),
            timelineCounter = 0
        };
        try
        {
            await _collection.InsertOneAsync(newApplicant);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("add-timeline/{username}")]
    [HttpPost]
    public async Task<IActionResult> AddTimeline([FromRoute] string username, [FromBody] TimelineBson timelineBson)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username));

        var applicant = await _collection.Find(filter).FirstOrDefaultAsync();
        int newTimelineID = applicant.timelineCounter;
        applicant.timelineCounter++;
        ApplicationTimeline newTimeline = new ApplicationTimeline
        {
            company = timelineBson.company,
            role = timelineBson.role,
            assessments = new List<Assessment>(),
            associatedEmailAddresses = new List<string>(),
            timelineID = newTimelineID,
            hasUnreadEmails = false,
            alertLevel = 0,
            archived = false
        };

        var timelineUpdate = Builders<JobApplicant>.Update.Push("applicationTimelines", newTimeline);
        var counterUpdate = Builders<JobApplicant>.Update.Set("timelineCounter", (newTimelineID + 1));

        try
        {
            var result1 = await _collection.UpdateOneAsync(filter, timelineUpdate);
            var result2 = await _collection.UpdateOneAsync(filter, counterUpdate);
            return Ok(newTimelineID);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("remove-timeline/{username}/{timelineID}")]
    [HttpGet]
    public async Task<IActionResult> RemoveTimeline(string username, int timelineID)
    {

        var filter = Builders<JobApplicant>.Filter.Eq(a => a.username, username);
        List<string> associatedEmails = new();
        var applicant = _collection.Find(filter).ToList();
        var timelines = applicant[0].applicationTimelines;
        int prevOunt = timelines.Count;
        timelines.RemoveAll(t => t.timelineID == timelineID);
        int newCount = timelines.Count;
        if (prevOunt != newCount)
        {
            try
            {
                var update = Builders<JobApplicant>.Update.Set("applicationTimelines", timelines);
                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }
            catch
            {
                return NotFound();
            }
        }
        return NotFound();
    }

    [Route("update-timeline/{username}/{timelineID}")]
    [HttpPost]
    public async Task<IActionResult> UpdateTimeline(string username, [FromBody] ApplicationTimeline updatedTimeline)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", updatedTimeline.timelineID)
);

        var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$", updatedTimeline);

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }


    }

    [Route("update-read-emails/{username}")]
    [HttpPost]
    public async Task<IActionResult> UpdateReadEmails(string username, [FromBody] ReadEmailsBson readEmails)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", readEmails.timelineID)
);

        var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.readEmails", readEmails.readEmails);

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }


    }


    [Route("add-email/{username}")]
    [HttpPost]
    public async Task<IActionResult> AddEmail([FromRoute] string username, [FromBody] EmailBson emailBson)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", emailBson.timelineID)
        );

        var update = Builders<JobApplicant>.Update.Push("applicationTimelines.$.associatedEmailAddresses", emailBson.emailAddress);

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Route("remove-email/{username}")]
    [HttpPost]
    public async Task<IActionResult> RemoveEmail([FromRoute] string username, [FromBody] EmailBson emailBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, emailBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<string> associatedEmails = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == emailBson.timelineID)
            {
                associatedEmails = timeline.associatedEmailAddresses;
                break;
            }
        }
        try
        {

            if (associatedEmails.Count != 0)
            {
                associatedEmails.RemoveAll(e => e == emailBson.emailAddress);
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", emailBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.associatedEmailAddresses", associatedEmails);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("add-emails/{username}")]
    [HttpPost]
    public async Task<IActionResult> AddEmails([FromRoute] string username, [FromBody] EmailsBson emailsBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, emailsBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<string> associatedEmails = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;

        try { 
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", emailsBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.associatedEmailAddresses", emailsBson.emailAddresses);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    //[Route("add-assessment/{username}")]
    //[HttpPost]
    //public async Task<IActionResult> AddAssesment([FromRoute] string username, [FromBody] AssessmentBson assessmentBson)
    //{
    //    var filter = Builders<JobApplicant>.Filter.And(
    //        Builders<JobApplicant>.Filter.Eq("username", username),
    //        Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
    //    );

    //    var update = Builders<JobApplicant>.Update.Push("applicationTimelines.$.assessments", assessmentBson.assessment);

    //    try
    //    {
    //        var result = await _collection.UpdateOneAsync(filter, update);
    //        return Ok();
    //    }
    //    catch (Exception ex)
    //    {
    //        return BadRequest(ex.Message);
    //    }
    //}

    [Route("add-assessment/{username}")]
    [HttpPost]
    public async Task<IActionResult> AddAssesment([FromRoute] string username, [FromBody] AssessmentBson assessmentBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        List<Assessment> orderedAssessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {
            assessments.Add(assessmentBson.assessment);
            orderedAssessments = assessments.OrderBy(a => a.date).ToList();
            var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
        );

            var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", orderedAssessments);

            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("add-assessments/{username}")]
    [HttpPost]
    public async Task<IActionResult> AddAssesments([FromRoute] string username, [FromBody] AssessmentsBson assessmentsBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentsBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        List<Assessment> orderedAssessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentsBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {
            assessments.AddRange(assessmentsBson.assessments);
            orderedAssessments = assessments.OrderBy(a => a.date).ToList();
            var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentsBson.timelineID)
        );

            var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", orderedAssessments);

            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("update-assessments/{username}")]
    [HttpPost]
    public async Task<IActionResult> UpdateAssesments([FromRoute] string username, [FromBody] AssessmentsBson assessmentsBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentsBson.timelineID);

        try
        {
            var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentsBson.timelineID)
        );

            var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessmentsBson.assessments);

            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }




    [Route("update-assessment-status/{username}/{status}")]
    [HttpPost]
    public async Task<IActionResult> UpdateAssesmentStatus([FromRoute] string username, [FromRoute] AssessmentStatus status,[FromBody] AssessmentBson assessmentBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {

            if (assessments.Count != 0)
            {
                for(int i = 0; i < assessments.Count(); i++)
                {
                    if (assessments[i].date == assessmentBson.assessment.date)
                    {
                        assessments[i].status = status;
                    }
                }
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessments);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Route("update-assessment-type/{username}")]
    [HttpPost]
    public async Task<IActionResult> UpdateAssesmentType([FromRoute] string username, [FromBody] AssessmentBson assessmentBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {

            if (assessments.Count != 0)
            {
                for(int i = 0; i < assessments.Count(); i++)
                {
                    if (assessments[i].date == assessmentBson.assessment.date)
                    {
                        assessments[i].type = assessmentBson.assessment.type;
                        assessments[i].customDescription = assessmentBson.assessment.customDescription;
                    }
                }
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessments);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Route("update-assessment-date/{username}")]
    [HttpPost]
    public async Task<IActionResult> UpdateAssesmentDate([FromRoute] string username, [FromBody] DatesBson datesBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, datesBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == datesBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {

            if (assessments.Count != 0)
            {
                for(int i = 0; i < assessments.Count(); i++)
                {
                    if (assessments[i].date == datesBson.oldDate)
                    {
                        assessments[i].date = datesBson.newDate;
                    }
                }
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", datesBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessments);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Route("update-assessment-todo/{username}/{status}")]
    [HttpPost]
    public async Task<IActionResult> UpdateAssesmentTodo([FromRoute] string username, [FromRoute] bool status, [FromBody] AssessmentBson assessmentBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {

            if (assessments.Count != 0)
            {
                for (int i = 0; i < assessments.Count(); i++)
                {
                    if (assessments[i].date == assessmentBson.assessment.date)
                    {
                        assessments[i].todoScheduled = status;
                        assessments[i].taskId = assessmentBson.assessment.taskId;
                    }
                }
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
            );

                var todoStatusUpdate = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessments);

                var result = await _collection.UpdateOneAsync(filter, todoStatusUpdate);

                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }



    [Route("remove-assessment/{username}")]
    [HttpPost]
    public async Task<IActionResult> RemoveAssessment([FromRoute] string username, [FromBody] AssessmentBson assessmentBson)
    {
        var userFilter = Builders<JobApplicant>.Filter.Eq(j => j.username, username);

        var timelineFilter = Builders<ApplicationTimeline>.Filter.Eq(at => at.timelineID, assessmentBson.timelineID);

        //var update = Builders<JobApplicant>.Update.PullFilter("ApplicationTimelines.$.AssociatedEmailAddresses", Builders<string>.Filter.Where(e => e == email.EmailAddress));
        List<Assessment> assessments = new();
        var applicant = _collection.Find(userFilter).ToList();
        var timelines = applicant[0].applicationTimelines;
        foreach (ApplicationTimeline timeline in timelines)
        {
            if (timeline.timelineID == assessmentBson.timelineID)
            {
                assessments = timeline.assessments;
                break;
            }
        }
        try
        {

            if (assessments.Count != 0)
            {
                assessments.RemoveAll(a => a.date == assessmentBson.assessment.date);
                var filter = Builders<JobApplicant>.Filter.And(
                Builders<JobApplicant>.Filter.Eq("username", username),
                Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", assessmentBson.timelineID)
            );

                var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.assessments", assessments);

                var result = await _collection.UpdateOneAsync(filter, update);
                return Ok();
            }

            return NotFound();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }


    [Route("update-read-count/{username}/{timelineID}/{newCount}")]
    [HttpGet]
    public async Task<IActionResult> updateReadCountEmail(string username, int timelineID, int newCount)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", timelineID)
        );

        var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.readEmailCount", newCount)
            .Set("applicationTimelines.$.hasUnreadEmails", false); ;

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("update-alert-level/{username}/{timelineID}/{newLevel}")]
    [HttpGet]
    public async Task<IActionResult> updateAlertLevel(string username, int timelineID, int newLevel)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", timelineID)
        );

        var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.alertLevel", newLevel);

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [Route("update-archived-status/{username}/{timelineID}/{newStatus}")]
    [HttpGet]
    public async Task<IActionResult> updateArchivedStatus(string username, int timelineID, bool newStatus)
    {
        var filter = Builders<JobApplicant>.Filter.And(
            Builders<JobApplicant>.Filter.Eq("username", username),
            Builders<JobApplicant>.Filter.Eq("applicationTimelines.timelineID", timelineID)
        );

        var update = Builders<JobApplicant>.Update.Set("applicationTimelines.$.archived", newStatus);

        try
        {
            var result = await _collection.UpdateOneAsync(filter, update);
            return Ok();
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

}




