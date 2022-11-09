// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
// Generated with Bot Builder V4 SDK Template for Visual Studio v4.14.0

using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using Microsoft.Extensions.Configuration;
using TabWithAdpativeCardFlow.Helpers;
using Newtonsoft.Json;
using TabWithAdpativeCardFlow.Models;
using TabWithAdpativeCardFlow.Interfaces;
using TabWithAdpativeCardFlow.Models.Graph;
using AdaptiveCards;
using Newtonsoft.Json.Linq;
using TabWithAdpativeCardFlow.Constants.AdaptiveCards;
using TabWithAdpativeCardFlow.Models.Search;
using TabWithAdpativeCardFlow.Constants.Search;
using TabWithAdpativeCardFlow.Models.Tab;

namespace TabWithAdpativeCardFlow.Bots
{
    public class ActivityBot : TeamsActivityHandler
    {
        private readonly string _connectionName;
        private readonly string _applicationBaseUrl;
        protected readonly IAdaptiveCardService _adaptiveCardService;
        protected readonly IFileService _fileService;
        protected readonly IGraphService _graphService;

        public ActivityBot(IConfiguration configuration, IAdaptiveCardService adaptiveCardService, IFileService fileService, IGraphService graphService)
        {
            _connectionName = configuration["ConnectionName"] ?? throw new NullReferenceException("ConnectionName");
            _applicationBaseUrl = configuration["ApplicationBaseUrl"] ?? throw new NullReferenceException("ApplicationBaseUrl");
            _fileService = fileService;
            _adaptiveCardService = adaptiveCardService;
            _graphService = graphService;
        }
        protected override async Task<InvokeResponse> OnInvokeActivityAsync(ITurnContext<IInvokeActivity> turnContext, CancellationToken cancellationToken)
        {
            var userTokenClient = turnContext.TurnState.Get<UserTokenClient>();

            if (turnContext.Activity.Name == "tab/fetch")
            {
                // Check the state value
                var state = JsonConvert.DeserializeObject<AdaptiveCardAction>(turnContext.Activity.Value.ToString()); 
                var tokenResponse = await GetTokenResponse(turnContext, state.State, cancellationToken);
                
                if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.Token))
                {
                    // There is no token, so the user has not signed in yet.

                    var resource = await userTokenClient.GetSignInResourceAsync(_connectionName, turnContext.Activity as Activity, null, cancellationToken);
                    // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
                    var signInLink = resource.SignInLink;

                    return CreateInvokeResponse(new TabResponse
                    {
                        Tab = new TabResponsePayload
                        {
                            Type = "auth",
                            SuggestedActions = new TabSuggestedActions
                            {
                                Actions = new List<CardAction>
                                {
                                    new CardAction
                                    {
                                        Type = ActionTypes.OpenUrl,
                                        Value = signInLink,
                                        Title = "Sign in to this app",
                                    },
                                },
                            },
                        },
                    });
                }
                else
                {
                    _graphService.SetAccessToken(tokenResponse.Token);
                }
                return await RenderCards(new SearchCardValue { ResourceType = EntityTypes.Files, SearchInput = "*"});
            }
            else if (turnContext.Activity.Name == "tab/submit")
            {
                var asJobject = JObject.FromObject(turnContext.Activity.Value);
                // Replace object with your model
                var fetchValue = asJobject.ToObject<CardTaskFetchValue<object>>();
                var data = JsonConvert.DeserializeObject<SearchCardValue>(fetchValue.Data.ToString());
                var pagingData = JsonConvert.DeserializeObject<TabTaskSubmitValue<PagingData>>(fetchValue.Data.ToString());

                if (data.SearchInput != null)
                {
                    return await RenderCards(data);
                }
                else if(pagingData.Data != null)
                {
                    var results = await _graphService.Search(pagingData.Data.EntityType, pagingData.Data.QueryString, pagingData.Data.From);
                    var resultsCard = new AdaptiveCard(new AdaptiveSchemaVersion(1, 4));

                    if (results != null && results.Total > 0)
                    {
                        results.CurrentPage = pagingData.Data.PageNumber;
                        results.Action = pagingData.Data.action;
                        var cardElements = _adaptiveCardService.GetSearchResultsContainers(results);
                        resultsCard = AttachmentHelper.BuildAttachment(cardElements);
                    }
                    else
                    {
                        var card = _fileService.GetCard("NoResultsCard");
                        resultsCard = AttachmentHelper.GetCardObject(card);
                    }
                    var searchValue = new SearchCardValue { ResourceType = pagingData.Data.EntityType.ToString(), SearchInput = pagingData.Data.QueryString };
                    return await RenderCards(searchValue, resultsCard);
                }
                else
                {
                    await userTokenClient.SignOutUserAsync(turnContext.Activity.From.Id, _connectionName, turnContext.Activity.ChannelId, cancellationToken);
                    return CreateInvokeResponse(new TabResponse
                    {
                        Tab = new TabResponsePayload
                        {
                            Type = "continue",
                            Value = new TabResponseCards
                            {
                                Cards = new List<TabResponseCard>
                                {
                                    new TabResponseCard
                                    {
                                        Card = CardHelper.GetSignOutCard()
                                    },
                                },
                            },
                        }
                    });
                }
                
            }
            else if (turnContext.Activity.Name == "task/fetch")
            {
                var profileCard = _fileService.GetCard("filters");
                var card = AttachmentHelper.GetAttachment(profileCard);

                return CreateInvokeResponse(new TaskModuleResponse
                {
                    Task = new TaskModuleContinueResponse
                    {
                        Type = "continue",
                        Value = new TaskModuleTaskInfo()
                        {
                            Card = card,
                            Height = 300,
                            Width = 400,
                            Title = "Filters",
                        },
                    },
                });
            }
            else if (turnContext.Activity.Name == "task/submit")
            {
                var asJobject = JObject.FromObject(turnContext.Activity.Value);                
                var fetchValue = asJobject.ToObject<CardTaskFetchValue<object>>();
                var data = JsonConvert.DeserializeObject<FilterData>(fetchValue.Data.ToString());
                
                return CreateInvokeResponse(new TaskModuleResponse
                {
                    Task = new TaskModuleCardResponse
                    {
                        Type = "continue",
                        Value = new TabResponse
                        {
                            Tab = new TabResponsePayload
                            {
                                Type = "continue",
                                Value = await RenderFilterSubmitResponse(data)
                            }
                        }
                    }                    
                });
            }

            return null;
        }

        private async Task<InvokeResponse> RenderCards(SearchCardValue data, AdaptiveCard resultsCard = null)
        {
            var profile = await _graphService.GetCurrentUserInfo();
            var userPhoto = await _graphService.GetPublicURLForProfilePhoto(profile.Id);

            // get profile card
            var user = new Models.Graph.User { Name = profile.DisplayName, Photo = userPhoto, Position = profile.JobTitle };
            var profileCard = _fileService.GetCard("UserProfile");
            var adaptiveCard = _adaptiveCardService.BindData(profileCard, user);
            var profileCardAttachment = AttachmentHelper.GetCardObject(adaptiveCard);

            // get search bar card
            var card = _fileService.GetCard("SearchBar");
            var searchBarCard = AttachmentHelper.GetCardObject(card);

            // get recent files card
            if(resultsCard == null)
            {
                var searchResult = await _graphService.Search(getEntityType(data.ResourceType), data.SearchInput);
                if (searchResult != null && searchResult.Total > 0)
                {
                    var cardElements = _adaptiveCardService.GetSearchResultsContainers(searchResult);
                    resultsCard = AttachmentHelper.BuildAttachment(cardElements);
                }
                else
                {
                    var noResultsCard = _fileService.GetCard("NoResultsCard");
                    resultsCard = AttachmentHelper.GetCardObject(noResultsCard);
                }
            }
            
            return CreateInvokeResponse(new TabResponse
            {
                Tab = new TabResponsePayload
                {
                    Type = "continue",
                    Value = new TabResponseCards
                    {
                        Cards = new List<TabResponseCard>
                            {
                                new TabResponseCard
                                {
                                    Card = profileCardAttachment
                                },
                                new TabResponseCard
                                {
                                    Card = searchBarCard
                                },
                                new TabResponseCard
                                {
                                    Card = resultsCard
                                }
                            },
                    },
                },
            });
        }

        private async Task<TabResponseCards> RenderFilterSubmitResponse(FilterData data)
        {
            var profile = await _graphService.GetCurrentUserInfo();
            var userPhoto = await _graphService.GetPublicURLForProfilePhoto(profile.Id);

            // get profile card
            var user = new Models.Graph.User { Name = profile.DisplayName, Photo = userPhoto, Position = profile.JobTitle };
            var profileCard = _fileService.GetCard("UserProfile");
            var adaptiveCard = _adaptiveCardService.BindData(profileCard, user);
            var profileCardAttachment = AttachmentHelper.GetCardObject(adaptiveCard);

            // get search bar card
            var card = _fileService.GetCard("SearchBar");
            var searchBarCard = AttachmentHelper.GetCardObject(card);
            var resultsCard = new AdaptiveCard("1.4");
            // get recent files card
            if (data != null)
            {
                var searchResult = await _graphService.AdvanceSearch(getEntityType(EntityTypes.Files), data);
                if (searchResult != null && searchResult.Total > 0)
                {
                    var cardElements = _adaptiveCardService.GetSearchResultsContainers(searchResult);
                    resultsCard = AttachmentHelper.BuildAttachment(cardElements);
                }
                else
                {
                    var noResultsCard = _fileService.GetCard("NoResultsCard");
                    resultsCard = AttachmentHelper.GetCardObject(noResultsCard);
                }
            }

            return new TabResponseCards
            {
                Cards = new List<TabResponseCard>
                            {
                                new TabResponseCard
                                {
                                    Card = profileCardAttachment
                                },
                                new TabResponseCard
                                {
                                    Card = searchBarCard
                                },
                                new TabResponseCard
                                {
                                    Card = resultsCard
                                }
                            }
            };
        }

        private Microsoft.Graph.EntityType getEntityType(string type)
        {
            switch (type)
            {
                case EntityTypes.Events:
                    return Microsoft.Graph.EntityType.Event;
                case EntityTypes.Files:
                    return Microsoft.Graph.EntityType.DriveItem;
                case EntityTypes.ListItems:
                    return Microsoft.Graph.EntityType.ListItem;
                case EntityTypes.Messages:
                    return Microsoft.Graph.EntityType.Message;
                default:
                    return Microsoft.Graph.EntityType.Unknownfuturevalue;
            }
        }
        protected override async Task<AdaptiveCardInvokeResponse> OnAdaptiveCardInvokeAsync(ITurnContext<IInvokeActivity> turnContext, AdaptiveCardInvokeValue invokeValue, CancellationToken cancellationToken)
        {
            if (invokeValue.Action.Verb == Actions.Next || invokeValue.Action.Verb == Actions.Previous)
            {
                JObject val = JObject.FromObject(invokeValue.Action.Data);
                PagingData data = val.ToObject<CardTaskFetchValue<PagingData>>()?.Data;
                var results = await _graphService.Search(data.EntityType, data.QueryString, data.From);
                var cardAttachment = new Attachment();

                if (results != null && results.Total > 0)
                {
                    results.CurrentPage = data.PageNumber;
                    results.Action = invokeValue.Action.Verb;
                    var cardElements = _adaptiveCardService.GetSearchResultsContainers(results);
                    cardAttachment = AttachmentHelper.BuildAttachment2(cardElements);
                }
                else
                {
                    var card = _fileService.GetCard("NoResultsCard");
                    cardAttachment = AttachmentHelper.GetAttachment(card);
                }

                Activity updateActivity = new Activity();
                updateActivity.Type = "message";
                updateActivity.Id = turnContext.Activity.ReplyToId;
                updateActivity.Attachments = new List<Attachment> { cardAttachment };
                await turnContext.UpdateActivityAsync(updateActivity);
            }
            var response = new AdaptiveCardInvokeResponse()
            {
                StatusCode = 200,
                Type = null,
                Value = null
            };
            return response;
        }

        private async Task<TokenResponse> GetTokenResponse(ITurnContext<IInvokeActivity> turnContext, string state, CancellationToken cancellationToken)
        {
            var magicCode = string.Empty;

            if (!string.IsNullOrEmpty(state))
            {
                if (int.TryParse(state, out var parsed))
                {
                    magicCode = parsed.ToString();
                }
            }

            var userTokenClient = turnContext.TurnState.Get<UserTokenClient>();
            var tokenResponse = await userTokenClient.GetUserTokenAsync(turnContext.Activity.From.Id, _connectionName, turnContext.Activity.ChannelId, magicCode, cancellationToken).ConfigureAwait(false);
            return tokenResponse;
        }
    }
}