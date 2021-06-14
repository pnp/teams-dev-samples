// <copyright file="ResponderCallHandler.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.IncidentBot.Bot
{
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading;
    using System.Threading.Tasks;
    using Calling.Bots;
    using Calling.Data;
    using Calling.Helpers;
    using Calling.IncidentBot.IncidentStatus;
    using Microsoft.Extensions.Configuration;
    using Microsoft.Graph;
    using Microsoft.Graph.Communications.Calls;
    using Microsoft.Graph.Communications.Common.Telemetry;
    using Microsoft.Graph.Communications.Resources;

    /// <summary>
    /// The responder call handler class.
    /// </summary>
    public class ResponderCallHandler : CallHandler
    {
        private string responderId;

        private IncidentStatusData statusData;

        private int promptTimes;

        /// <summary>
        /// Initializes a new instance of the <see cref="ResponderCallHandler"/> class.
        /// </summary>
        /// <param name="bot">The bot.</param>
        /// <param name="call">The call.</param>
        /// <param name="responderId">The responder id.</param>
        /// <param name="statusData">The incident status data.</param>
        public ResponderCallHandler(Bot bot, ICall call, string responderId, IncidentStatusData statusData)
            : base(bot, call)
        {
            this.responderId = responderId;
            this.statusData = statusData;

            this.statusData?.UpdateResponderNotificationCallId(this.responderId, call.Id, call.ScenarioId);
        }

        /// <inheritdoc/>
        protected override void CallOnUpdated(ICall sender, ResourceEventArgs<Call> args)
        {
            this.statusData?.UpdateResponderNotificationStatus(this.responderId, sender.Resource.State);

            if (sender.Resource.State == CallState.Established)
            {
                var currentPromptTimes = Interlocked.Increment(ref this.promptTimes);

                if (currentPromptTimes == 1)
                {
                    this.SubscribeToTone();
                    this.PlayNotificationPrompt();
                    this.CheckTeamsMeetingParticipants();
                }

                if (sender.Resource.ToneInfo?.Tone != null)
                {
                    Tone tone = sender.Resource.ToneInfo.Tone.Value;

                    // handle different tones from responder
                    switch (tone)
                    {
                        case Tone.Tone1:
                            this.statusData.IsAttended = true;
                            this.PlayTransferingPrompt();
                            this.TransferToIncidentMeeting();
                            break;
                        case Tone.Tone0:
                        default:
                            this.PlayNotificationPrompt();
                            break;
                    }

                    sender.Resource.ToneInfo.Tone = null;
                }
            }
        }

        /// <summary>
        /// Validate the particiapnts info to confirm whether the user has accepted the call or not.
        /// </summary>
        private void CheckTeamsMeetingParticipants()
        {
            Task.Run(async () =>
            {
                try
                {
                    await Task.Delay(25000);

                    IConfigurationBuilder configurationBuilder = new ConfigurationBuilder();
                    configurationBuilder.AddJsonFile("AppSettings.json");
                    IConfiguration configuration = configurationBuilder.Build();

                    GraphHelper graphHelper = new GraphHelper(configuration);

                    GraphServiceClient graphServiceClient = graphHelper.GetGraphServiceClient();

                    var teamsMeetingparticipants = await graphServiceClient.Communications.Calls[this.statusData?.BotMeetingCallId].Participants
                        .Request()
                        .GetAsync();

                    if (teamsMeetingparticipants.CurrentPage.Count == 1 && teamsMeetingparticipants.CurrentPage[0].Info.Identity.User == null)
                    {
                        if (!this.statusData.IsAttended)
                        {
                            this.statusData.UpdateCount();
                            this.SubsequentCall();
                        }
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            });
        }

        /// <summary>
        /// Subsequent call.
        /// </summary>
        private void SubsequentCall()
        {
            if (this.statusData.Count <= this.statusData.ObjectIds.Count() - 1)
            {
                var scenarioId = Guid.NewGuid();
                var objectId = this.statusData.ObjectIds.ToList()[this.statusData.Count];
                Task.Run(async () =>
                {
                    try
                    {
                        var makeCallRequestData =
                             new MakeCallRequestData(
                                 this.statusData.TenantId,
                                 objectId,
                                 "Application".Equals("User", StringComparison.OrdinalIgnoreCase));
                        var responderCall = await this.Bot.MakeCallAsync(makeCallRequestData, scenarioId).ConfigureAwait(false);

                        CallHandler callHandler;
                        var callee = responderCall.Resource.Targets.First();
                        callHandler = new ResponderCallHandler(this.Bot, responderCall, callee.Identity.User.Id, this.statusData);
                        this.Bot.CallHandlers[responderCall.Id] = callHandler;
                    }
                    catch (Exception ex)
                    {
                        throw;
                    }
                });
            }
        }

        /// <summary>
        /// Subscribe to tone.
        /// </summary>
        private void SubscribeToTone()
        {
            Task.Run(async () =>
            {
                try
                {
                    await this.Call.SubscribeToToneAsync().ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw;
                }
            });
        }

        /// <summary>
        /// Play the transfering prompt.
        /// </summary>
        private void PlayTransferingPrompt()
        {
            Task.Run(async () =>
            {
                try
                {
                    await this.Call.PlayPromptAsync(new List<MediaPrompt> { this.Bot.MediaMap[Bot.TransferingPromptName] }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw;
                }
            });
        }

        /// <summary>
        /// Play the notification prompt.
        /// </summary>
        private void PlayNotificationPrompt()
        {
            Task.Run(async () =>
            {
                try
                {
                    await this.Call.PlayPromptAsync(new List<MediaPrompt> { this.Bot.MediaMap[Bot.NotificationPromptName] }).ConfigureAwait(false);
                }
                catch (Exception ex)
                {
                    throw;
                }
            });
        }

        /// <summary>
        /// add current responder to incident meeting as participant.
        /// </summary>
        private void TransferToIncidentMeeting()
        {
            Task.Run(async () =>
            {
                try
                {
                    var incidentMeetingCallId = this.statusData?.BotMeetingCallId;
                    var responderStatusData = this.statusData?.GetResponder(this.responderId);

                    if (incidentMeetingCallId != null && responderStatusData != null)
                    {
                        var addParticipantRequestData = new AddParticipantRequestData()
                        {
                            ObjectId = responderStatusData.ObjectId,
                            ReplacesCallId = responderStatusData.NotificationCallId,
                        };

                        await this.Bot.AddParticipantAsync(incidentMeetingCallId, addParticipantRequestData).ConfigureAwait(false);
                    }
                }
                catch (Exception ex)
                {
                    throw;
                }
            });
        }
    }
}
