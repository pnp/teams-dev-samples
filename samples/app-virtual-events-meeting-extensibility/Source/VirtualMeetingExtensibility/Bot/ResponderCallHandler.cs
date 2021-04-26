// <copyright file="ResponderCallHandler.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Bot
{
    using System;
    using System.Collections.Generic;
    using System.Threading;
    using System.Threading.Tasks;
    using Data;
    using IncidentStatus;
    using Microsoft.Graph;
    using Microsoft.Graph.Communications.Calls;
    using Microsoft.Graph.Communications.Common.Telemetry;
    using Microsoft.Graph.Communications.Resources;

    /// <summary>
    /// The responder call handler class.
    /// </summary>
    public class ResponderCallHandler : CallHandler
    {
        private readonly string responderId;

        private readonly IncidentStatusData statusData;

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
            statusData?.UpdateResponderNotificationStatus(responderId, sender.Resource.State);

            if (sender.Resource.State == CallState.Established)
            {
                var currentPromptTimes = Interlocked.Increment(ref promptTimes);

                if (currentPromptTimes == 1)
                {
                    SubscribeToTone();
                    PlayNotificationPrompt();
                }

                if (sender.Resource.ToneInfo?.Tone != null)
                {
                    Tone tone = sender.Resource.ToneInfo.Tone.Value;

                    GraphLogger.Info($"Tone {tone} received.");

                    // handle different tones from responder
                    switch (tone)
                    {
                        case Tone.Tone1:
                            PlayTransferringPrompt();
                            TransferToIncidentMeeting();
                            break;
                        default:
                            PlayNotificationPrompt();
                            break;
                    }

                    sender.Resource.ToneInfo.Tone = null;
                }
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
                    await Call.SubscribeToToneAsync().ConfigureAwait(false);
                    GraphLogger.Info("Started subscribing to tone.");
                }
                catch (Exception ex)
                {
                    GraphLogger.Error(ex, "Failed to subscribe to tone. ");
                    throw;
                }
            });
        }

        /// <summary>
        /// Play the transferring prompt.
        /// </summary>
        private void PlayTransferringPrompt()
        {
            Task.Run(async () =>
            {
                try
                {
                    await Call.PlayPromptAsync(new List<MediaPrompt> { Bot.MediaMap[Bot.TransferringPromptName] }).ConfigureAwait(false);
                    GraphLogger.Info("Started playing transferring prompt");
                }
                catch (Exception ex)
                {
                    GraphLogger.Error(ex, "Failed to play transferring prompt.");
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
                    await Call.PlayPromptAsync(new List<MediaPrompt> { Bot.MediaMap[Bot.NotificationPromptName] }).ConfigureAwait(false);
                    GraphLogger.Info("Started playing notification prompt");
                }
                catch (Exception ex)
                {
                    GraphLogger.Error(ex, "Failed to play notification prompt.");
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
                    var incidentMeetingCallId = statusData?.BotMeetingCallId;
                    var responderStatusData = statusData?.GetResponder(responderId);

                    if (incidentMeetingCallId != null && responderStatusData != null)
                    {
                        var addParticipantRequestData = new AddParticipantRequestData()
                        {
                            ObjectId = responderStatusData.ObjectId,
                            ReplacesCallId = responderStatusData.NotificationCallId,
                        };

                        await Bot.AddParticipantAsync(incidentMeetingCallId, addParticipantRequestData).ConfigureAwait(false);

                        GraphLogger.Info("Finished to transfer to incident meeting. ");
                    }
                    else
                    {
                        GraphLogger.Warn(
                            $"Tried to transfer to incident meeting but needed info are not valid. Meeting call-id: {incidentMeetingCallId}; status data: {responderStatusData}");
                    }
                }
                catch (Exception ex)
                {
                    GraphLogger.Error(ex, "Failed to transfer to incident meeting.");
                    throw;
                }
            });
        }
    }
}
