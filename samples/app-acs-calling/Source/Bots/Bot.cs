// <copyright file="Bot.cs" company="PlaceholderCompany">
// Copyright (c) PlaceholderCompany. All rights reserved.
// </copyright>

namespace Calling.Bots
{
    using System;
    using System.Collections.Concurrent;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Calling.Authentication;
    using Calling.Data;
    using Calling.Extensions;
    using Calling.IncidentBot;
    using Calling.IncidentBot.Bot;
    using Calling.IncidentBot.IncidentStatus;
    using Calling.Meetings;
    using Microsoft.Graph;
    using Microsoft.Graph.Communications.Calls;
    using Microsoft.Graph.Communications.Client;
    using Microsoft.Graph.Communications.Common;
    using Microsoft.Graph.Communications.Common.Telemetry;
    using Microsoft.Graph.Communications.Resources;

    /// <summary>
    /// The core bot logic.
    /// </summary>
    public class Bot
    {
        /// <summary>
        /// The prompt audio name for responder notification.
        /// </summary>
        /// <remarks>
        /// message: "There is an incident occured. Press '1' to join the incident meeting. Press '0' to listen to the instruction again. ".
        /// </remarks>
        public const string NotificationPromptName = "NotificationPrompt";

        /// <summary>
        /// The prompt audio name for responder transfering.
        /// </summary>
        /// <remarks>
        /// message: "Your call will be transferred to the incident meeting. Please don't hang off. ".
        /// </remarks>
        public const string TransferingPromptName = "TransferingPrompt";

        /// <summary>
        /// The prompt audio name for bot incoming calls.
        /// </summary>
        /// <remarks>
        /// message: "You are calling an incident application. It's a sample for incoming call with audio prompt.".
        /// </remarks>
        public const string BotIncomingPromptName = "BotIncomingPrompt";

        /// <summary>
        /// The prompt audio name for bot endpoint incoming calls.
        /// </summary>
        /// <remarks>
        /// message: "You are calling an incident application endpoint. It's a sample for incoming call with audio prompt.".
        /// </remarks>
        public const string BotEndpointIncomingPromptName = "BotEndpointIncomingPrompt";

        private readonly IGraphLogger graphLogger;

        private readonly LinkedList<string> callbackLogs = new LinkedList<string>();

        /// <summary>
        /// Initializes a new instance of the <see cref="Bot" /> class.
        /// </summary>
        /// <param name="options">The bot options.</param>
        /// <param name="graphLogger">The graph logger.</param>
        public Bot(BotOptions options, IGraphLogger graphLogger)
        {
            this.BotInstanceUri = CallAffinityMiddleware.GetWebInstanceCallbackUri(options.BotBaseUrl);

            var instanceNotificationUri = CallAffinityMiddleware.GetWebInstanceCallbackUri(
                new Uri(options.BotBaseUrl, HttpRouteConstants.OnIncomingRequestRoute));

            this.graphLogger = graphLogger;
            var name = this.GetType().Assembly.GetName().Name;
            var builder = new CommunicationsClientBuilder(
                name,
                options.AppId,
                this.graphLogger);

            var authProvider = new AuthenticationProvider(
                name,
                options.AppId,
                options.AppSecret,
                this.graphLogger);

            builder.SetAuthenticationProvider(authProvider);
            builder.SetNotificationUrl(instanceNotificationUri);
            builder.SetServiceBaseUrl(options.PlaceCallEndpointUrl);

            this.Client = builder.Build();
            this.Client.Calls().OnIncoming += this.CallsOnIncoming;
            this.Client.Calls().OnUpdated += this.CallsOnUpdated;

            this.IncidentStatusManager = new IncidentStatusManager();

            var audioBaseUri = options.BotBaseUrl;

            this.MediaMap[TransferingPromptName] = new MediaPrompt
            {
                MediaInfo = new MediaInfo
                {
                    Uri = new Uri(audioBaseUri, "audio/responder-transfering.wav").ToString(),
                    ResourceId = Guid.NewGuid().ToString(),
                },
            };

            this.MediaMap[NotificationPromptName] = new MediaPrompt
            {
                MediaInfo = new MediaInfo
                {
                    Uri = new Uri(audioBaseUri, "audio/responder-notification.wav").ToString(),
                    ResourceId = Guid.NewGuid().ToString(),
                },
            };

            this.MediaMap[BotIncomingPromptName] = new MediaPrompt
            {
                MediaInfo = new MediaInfo
                {
                    Uri = new Uri(audioBaseUri, "audio/bot-incoming.wav").ToString(),
                    ResourceId = Guid.NewGuid().ToString(),
                },
            };

            this.MediaMap[BotEndpointIncomingPromptName] = new MediaPrompt
            {
                MediaInfo = new MediaInfo
                {
                    Uri = new Uri(audioBaseUri, "audio/bot-endpoint-incoming.wav").ToString(),
                    ResourceId = Guid.NewGuid().ToString(),
                },
            };
        }

        /// <summary>
        /// Gets the collection of call handlers.
        /// </summary>
        public ConcurrentDictionary<string, CallHandler> CallHandlers { get; } = new ConcurrentDictionary<string, CallHandler>();

        /// <summary>
        /// Gets the prompts dictionary.
        /// </summary>
        public Dictionary<string, MediaPrompt> MediaMap { get; } = new Dictionary<string, MediaPrompt>();

        /// <summary>
        /// Gets the bots instance URI.
        /// </summary>
        public Uri BotInstanceUri { get; }

        /// <summary>
        /// Gets the client.
        /// </summary>
        /// <value>
        /// The client.
        /// </value>
        public ICommunicationsClient Client { get; }

        /// <summary>
        /// Gets the incident manager.
        /// </summary>
        public IncidentStatusManager IncidentStatusManager { get; }

        /// <summary>
        /// add callback log for diagnostics.
        /// </summary>
        /// <param name="message">the message.</param>
        public void AddCallbackLog(string message)
        {
            this.callbackLogs.AddFirst(message);
        }

        /// <summary>
        /// get callback logs for diagnostics.
        /// </summary>
        /// <param name="maxCount">The maximum count of log lines.</param>
        /// <returns>The log line.</returns>
        public IEnumerable<string> GetCallbackLogs(int maxCount)
        {
            return this.callbackLogs.Take(maxCount);
        }

        /// <summary>
        /// Raise an incident.
        /// </summary>
        /// <param name="incidentRequestData">The incident data.</param>
        /// <returns>The task for await.</returns>
        public async Task<ICall> RaiseIncidentAsync(IncidentRequestData incidentRequestData)
        {
            // A tracking id for logging purposes. Helps identify this call in logs.
            var scenarioId = string.IsNullOrEmpty(incidentRequestData.ScenarioId) ? Guid.NewGuid() : new Guid(incidentRequestData.ScenarioId);

            string incidentId = Guid.NewGuid().ToString();

            var incidentStatusData = new IncidentStatusData(incidentId, incidentRequestData);

            var incident = this.IncidentStatusManager.AddIncident(incidentId, incidentStatusData);

            var botMeetingCall = await this.JoinCallAsync(incidentRequestData, incidentId).ConfigureAwait(false);

            var objectId = incidentRequestData.ObjectIds.ToList()[incidentStatusData.Count];
            var makeCallRequestData =
                    new MakeCallRequestData(
                        incidentRequestData.TenantId,
                        objectId,
                        "Application".Equals(incidentRequestData.ResponderType, StringComparison.OrdinalIgnoreCase));
            var responderCall = await this.MakeCallAsync(makeCallRequestData, scenarioId).ConfigureAwait(false);
            this.AddCallToHandlers(responderCall, new IncidentCallContext(IncidentCallType.ResponderNotification, incidentId));

            return botMeetingCall;
        }

        /// <summary>
        /// Joins the call asynchronously.
        /// </summary>
        /// <param name="joinCallBody">The join call body.</param>
        /// <param name="incidentId">Incident Id.</param>
        /// <returns>The <see cref="ICall"/> that was requested to join.</returns>
        public async Task<ICall> JoinCallAsync(JoinCallRequestData joinCallBody, string incidentId = "")
        {
            // A tracking id for logging purposes. Helps identify this call in logs.
            var scenarioId = string.IsNullOrEmpty(joinCallBody.ScenarioId) ? Guid.NewGuid() : new Guid(joinCallBody.ScenarioId);

            Microsoft.Graph.MeetingInfo meetingInfo;
            ChatInfo chatInfo;
            (chatInfo, meetingInfo) = JoinInfo.ParseJoinURL(joinCallBody.JoinUrl);

            var tenantId =
                joinCallBody.TenantId ??
                (meetingInfo as OrganizerMeetingInfo)?.Organizer.GetPrimaryIdentity()?.GetTenantId();
            var mediaToPrefetch = new List<MediaInfo>();
            foreach (var m in this.MediaMap)
            {
                mediaToPrefetch.Add(m.Value.MediaInfo);
            }

            var joinParams = new JoinMeetingParameters(chatInfo, meetingInfo, new[] { Modality.Audio }, mediaToPrefetch)
            {
                TenantId = tenantId,
            };

            var statefulCall = await this.Client.Calls().AddAsync(joinParams, scenarioId).ConfigureAwait(false);

            this.AddCallToHandlers(statefulCall, new IncidentCallContext(IncidentCallType.BotMeeting, incidentId));

            this.graphLogger.Info($"Join Call complete: {statefulCall.Id}");

            return statefulCall;
        }

        /// <summary>
        /// Makes outgoing call asynchronously.
        /// </summary>
        /// <param name="makeCallBody">The outgoing call request body.</param>
        /// <param name="scenarioId">The scenario identifier.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        public async Task<ICall> MakeCallAsync(MakeCallRequestData makeCallBody, Guid scenarioId)
        {
            if (makeCallBody == null)
            {
                throw new ArgumentNullException(nameof(makeCallBody));
            }

            if (makeCallBody.TenantId == null)
            {
                throw new ArgumentNullException(nameof(makeCallBody.TenantId));
            }

            if (makeCallBody.ObjectId == null)
            {
                throw new ArgumentNullException(nameof(makeCallBody.ObjectId));
            }

            var target =
                makeCallBody.IsApplication ?
                new InvitationParticipantInfo
                {
                    Identity = new IdentitySet
                    {
                        Application = new Identity
                        {
                            Id = makeCallBody.ObjectId,
                            DisplayName = $"Responder {makeCallBody.ObjectId}",
                        },
                    },
                }
                :
                new InvitationParticipantInfo
                {
                    Identity = new IdentitySet
                    {
                        User = new Identity
                        {
                            Id = makeCallBody.ObjectId,
                        },
                    },
                };

            var mediaToPrefetch = new List<MediaInfo>();
            foreach (var m in this.MediaMap)
            {
                mediaToPrefetch.Add(m.Value.MediaInfo);
            }

            var call = new Call
            {
                Targets = new[] { target },
                MediaConfig = new ServiceHostedMediaConfig { PreFetchMedia = mediaToPrefetch },
                RequestedModalities = new List<Modality> { Modality.Audio },
                TenantId = makeCallBody.TenantId,
            };

            var statefulCall = await this.Client.Calls().AddAsync(call, scenarioId: scenarioId).ConfigureAwait(false);

            this.graphLogger.Info($"Call creation complete: {statefulCall.Id}");

            return statefulCall;
        }

        /// <summary>
        /// Adds participants asynchronously.
        /// </summary>
        /// <param name="callLegId">which call to add participants.</param>
        /// <param name="addParticipantBody">The add participant body.</param>
        /// <returns>The <see cref="Task"/>.</returns>
        public async Task AddParticipantAsync(string callLegId, AddParticipantRequestData addParticipantBody)
        {
            if (string.IsNullOrEmpty(callLegId))
            {
                throw new ArgumentNullException(nameof(callLegId));
            }

            if (string.IsNullOrEmpty(addParticipantBody.ObjectId))
            {
                throw new ArgumentNullException(nameof(addParticipantBody.ObjectId));
            }

            var target = new IdentitySet
            {
                User = new Identity
                {
                    Id = addParticipantBody.ObjectId,
                },
            };

            await this.Client.Calls()[callLegId].Participants
                .InviteAsync(target, addParticipantBody.ReplacesCallId)
                .ConfigureAwait(false);
        }

        /// <summary>
        /// Try to end a particular call.
        /// </summary>
        /// <param name="callLegId">
        /// The call leg id.
        /// </param>
        /// <returns>
        /// The <see cref="Task"/>.
        /// </returns>
        public async Task TryDeleteCallAsync(string callLegId)
        {
            this.CallHandlers.TryGetValue(callLegId, out CallHandler handler);

            if (handler == null)
            {
                return;
            }

            try
            {
                await handler.Call.DeleteAsync().ConfigureAwait(false);
                this.graphLogger.Info("Delete call finished.");
            }
            catch (Exception ex)
            {
                this.graphLogger.Error(ex, $"Exception happened when delete the call {callLegId}");

                // in case the call deletion is failed, force remove the call in memory.
                this.Client.Calls().TryForceRemove(callLegId, out ICall call);

                throw;
            }
        }

        /// <summary>
        /// Incoming call handler.
        /// </summary>
        /// <param name="sender">The sender.</param>
        /// <param name="args">The <see cref="CollectionEventArgs{TEntity}"/> instance containing the event data.</param>
        private void CallsOnIncoming(ICallCollection sender, CollectionEventArgs<ICall> args)
        {
            Task answerTask;

            var call = args.AddedResources.First();

            var callee = call.Resource.Targets.First();
            var callType = callee?.Identity?.GetApplicationInstance() == null ? IncidentCallType.BotIncoming : IncidentCallType.BotEndpointIncoming;

            var incidentCallContext = new IncidentCallContext(callType, Guid.Empty.ToString());
            this.AddCallToHandlers(call, incidentCallContext);

            var mediaToPrefetch = new List<MediaInfo>();
            foreach (var m in this.MediaMap)
            {
                mediaToPrefetch.Add(m.Value.MediaInfo);
            }

            answerTask = call.AnswerAsync(
                mediaToPrefetch,
                new[] { Modality.Audio });

            Task.Run(async () =>
            {
                try
                {
                    await answerTask.ConfigureAwait(false);
                    this.graphLogger.Info("Started answering incoming call");
                }
                catch (Exception ex)
                {
                    this.graphLogger.Error(ex, $"Exception happened when answering the call.");
                }
            });
        }

        /// <summary>
        /// Updated call handler.
        /// </summary>
        /// <param name="sender">The <see cref="ICallCollection"/> sender.</param>
        /// <param name="args">The <see cref="CollectionEventArgs{ICall}"/> instance containing the event data.</param>
        private void CallsOnUpdated(ICallCollection sender, CollectionEventArgs<ICall> args)
        {
            foreach (var call in args.RemovedResources)
            {
                if (this.CallHandlers.TryRemove(call.Id, out CallHandler handler))
                {
                    handler.Dispose();
                }
            }
        }

        /// <summary>
        /// Add call to call handlers.
        /// </summary>
        /// <param name="call">The call to be added.</param>
        /// <param name="incidentCallContext">The incident call context.</param>
        private void AddCallToHandlers(ICall call, IncidentCallContext incidentCallContext)
        {
            Validator.NotNull(incidentCallContext, nameof(incidentCallContext));

            var statusData = this.IncidentStatusManager.GetIncident(incidentCallContext.IncidentId);

            CallHandler callHandler;
            InvitationParticipantInfo callee;
            switch (incidentCallContext.CallType)
            {
                case IncidentCallType.BotMeeting:
                    // Call to meeting.
                    callHandler = new MeetingCallHandler(this, call, statusData);
                    break;
                case IncidentCallType.ResponderNotification:
                    // call to an user.
                    callee = call.Resource.Targets.First();
                    callHandler = new ResponderCallHandler(this, call, callee.Identity.User.Id, statusData);
                    break;
                default:
                    throw new NotSupportedException($"Invalid call type in incident call context: {incidentCallContext.CallType}");
            }

            this.CallHandlers[call.Id] = callHandler;
        }

        /// <summary>
        /// The get handler or throw.
        /// </summary>
        /// <param name="callLegId">
        /// The call leg id.
        /// </param>
        /// <returns>
        /// The <see cref="ResponderCallHandler"/>.
        /// </returns>
        /// <exception cref="KeyNotFoundException">
        /// Throws an exception if handler is not found.
        /// </exception>
        private CallHandler GetHandlerOrThrow(string callLegId)
        {
            if (!this.CallHandlers.TryGetValue(callLegId, out CallHandler handler))
            {
                throw new KeyNotFoundException($"call ({callLegId}) not found");
            }

            return handler;
        }
    }
}
