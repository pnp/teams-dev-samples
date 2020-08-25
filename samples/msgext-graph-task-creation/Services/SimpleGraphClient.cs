// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
//
// Generated with Bot Builder V4 SDK Template for Visual Studio EchoBot v4.9.1

extern alias BetaLib;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Beta = BetaLib.Microsoft.Graph;
using Microsoft.Graph;

namespace Bot.Builder.Community.Samples.Teams.Services
{
    // This class is a wrapper for the Microsoft Graph API
    // See: https://developer.microsoft.com/en-us/graph
    public class SimpleGraphClient
    {
        private readonly string _token;

        public SimpleGraphClient(string token)
        {
            if (string.IsNullOrWhiteSpace(token))
            {
                throw new ArgumentNullException(nameof(token));
            }

            _token = token;
        }

        // Searches the user's mail Inbox using the Microsoft Graph API
        public async Task<Beta.Message[]> SearchMailInboxAsync(string search)
        {
            var graphClient = GetAuthenticatedClient();
            var searchQuery = new QueryOption("search", search);
            var messages = await graphClient.Me.MailFolders.Inbox.Messages.Request(new List<Option>() { searchQuery }).GetAsync();
            return messages.Take(10).ToArray();
        }
        public async Task<Beta.Message[]> GetGroup(string search)
        {
            var graphClient = GetAuthenticatedClient();
            var searchQuery = new QueryOption("search", search);
            var messages = await graphClient.Me.MailFolders.Inbox.Messages.Request(new List<Option>() { searchQuery }).GetAsync();
            return messages.Take(10).ToArray();
        }

        // Get information about the user.
        public async Task<Beta.User> GetMeAsync()
        {
            var graphClient = GetAuthenticatedClient();
            var me = await graphClient.Me.Request().GetAsync();
            return me;
        }

        public async Task<Beta.OutlookTask> GetTaskAsync()
        {
            var graphClient = GetAuthenticatedClient();
            var tasks = await graphClient.Me.Outlook.Tasks.Request().GetAsync();
            return tasks[0];
        }

        public async Task<Beta.IPlannerUserFavoritePlansCollectionWithReferencesPage> GetFavoritePlans()
        {
            var graphClient = GetAuthenticatedClient();
            var plans = await graphClient.Me.Planner.FavoritePlans.Request().GetAsync();
            return plans;
        }

        public async Task<Beta.IPlannerGroupPlansCollectionPage> GetCurrentPlan(string groupId)
        {
            var graphClient = GetAuthenticatedClient();
            var plans = await graphClient.Groups[groupId].Planner.Plans.Request().GetAsync();
            return plans;
        }
        public async Task<Beta.PlannerTask> CreatePlannerTaskAsync(string planId, string subject, string dueDate, string startTime, string userId)
        {
            var graphClient = GetAuthenticatedClient();
            var assignments = new Beta.PlannerAssignments();
            assignments.AddAssignee(userId);
            var plannerTask = new Beta.PlannerTask
            {
                DueDateTime = DateTimeOffset.Parse(dueDate),
                StartDateTime = DateTimeOffset.Parse(startTime),
                Title = subject,
                PlanId = planId,
                Assignments = assignments
                //BucketId = bucketId
            };
            var plans = await graphClient.Planner.Tasks.Request().AddAsync(plannerTask);
            return plans;
        }

        public async Task<Beta.OutlookTask> CreateTaskAsync(string subject, string dueDate, string startTime, Beta.ItemBody body)
        {
            var graphClient = GetAuthenticatedClient();
            var outlookTask = new Beta.OutlookTask
            {
                Subject = subject,
                StartDateTime = new Beta.DateTimeTimeZone
                {
                    DateTime = startTime,
                    TimeZone = "Eastern Standard Time"
                },
                DueDateTime = new Beta.DateTimeTimeZone
                {
                    DateTime = dueDate,
                    TimeZone = "Eastern Standard Time"
                },
                Body = body
            };
            var res = await graphClient.Me.Outlook.Tasks.Request().Header("Prefer", "outlook.timezone=\"Pacific Standard Time\"").AddAsync(outlookTask);
            return res;
        }

        // Get an Authenticated Microsoft Graph client using the token issued to the user.
        private Beta.GraphServiceClient GetAuthenticatedClient()
        {
            var graphClient = new Beta.GraphServiceClient(
                new DelegateAuthenticationProvider(
                    requestMessage =>
                    {
                        // Append the access token to the request.
                        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("bearer", _token);

                        // Get event times in the current time zone.
                        requestMessage.Headers.Add("Prefer", "outlook.timezone=\"" + TimeZoneInfo.Local.Id + "\"");

                        return Task.CompletedTask;
                    }));
            return graphClient;
        }
    }
}