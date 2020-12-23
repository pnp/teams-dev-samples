// <copyright file="MeetingCallHandler.cs" company="Microsoft Corporation">
// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.
// </copyright>

namespace VirtualMeetingExtensibility.Bot
{
    using System.Threading.Tasks;
    using IncidentStatus;
    using Microsoft.Graph;
    using Microsoft.Graph.Communications.Calls;
    using Microsoft.Graph.Communications.Common.Telemetry;
    using Microsoft.Graph.Communications.Resources;

    /// <summary>
    /// The meeting call handler.
    /// </summary>
    public class MeetingCallHandler : CallHandler
    {
        private readonly IncidentStatusData statusData;

        /// <summary>
        /// Initializes a new instance of the <see cref="MeetingCallHandler"/> class.
        /// </summary>
        /// <param name="bot">The bot.</param>
        /// <param name="call">The call.</param>
        /// <param name="statusData">The incident status data.</param>
        public MeetingCallHandler(Bot bot, ICall call, IncidentStatusData statusData)
            : base(bot, call)
        {
            this.statusData = statusData;

            this.statusData?.UpdateBotMeetingCallId(call.Id, call.ScenarioId);
        }

        /// <inheritdoc/>
        protected override void CallOnUpdated(ICall sender, ResourceEventArgs<Call> args)
        {
            statusData?.UpdateBotMeetingStatus(sender.Resource.State);
        }

        /// <inheritdoc/>
        protected override void ParticipantsOnUpdated(IParticipantCollection sender, CollectionEventArgs<IParticipant> args)
        {
            foreach (var participant in args.AddedResources)
            {
                var responderId = participant.Resource?.Info?.Identity?.User?.Id;

                if (responderId == null)
                {
                    // the participant have no user ID (ex. it is a bot).
                    continue;
                }

                statusData?.UpdateResponderMeetingCallId(responderId, Call.Id, Call.ScenarioId);

                statusData?.UpdateResponderMeetingStatus(responderId, IncidentResponderMeetingStatus.Added);

                var responderCallId = statusData?.GetResponder(responderId)?.NotificationCallId;

                if (responderCallId != null)
                {
                    TryDeleteCall(responderCallId);
                }
            }

            foreach (var participant in args.RemovedResources)
            {
                var responderId = participant.Resource?.Info?.Identity?.User?.Id;

                if (responderId == null)
                {
                    // the participant have no user ID (ex. it is a bot).
                    continue;
                }

                statusData?.UpdateResponderMeetingStatus(responderId, IncidentResponderMeetingStatus.Removed);
            }
        }

        /// <inheritdoc/>
        protected override void ParticipantOnUpdated(IParticipant sender, ResourceEventArgs<Participant> args)
        {
            // do nothing.
        }

        /// <summary>
        /// Try to delete a call.
        /// </summary>
        /// <param name="callId">The call which will be deleted.</param>
        private void TryDeleteCall(string callId)
        {
            Task.Run(async () =>
            {
                await Bot.TryDeleteCallAsync(callId).ConfigureAwait(false);
                GraphLogger.Info($"Try to delete call {callId}.");
            });
        }
    }
}
