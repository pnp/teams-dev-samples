using AdaptiveCards;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Connector.Authentication;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using MsgextGraphSrchCfg.Helpers;
using MsgextGraphSrchCfg.Models;
using Newtonsoft.Json.Linq;

namespace MsgextGraphSrchCfg.Bot;

public class TeamsMessageExtension : TeamsActivityHandler
{
    private string _connectionName = "GraphConnection"; // ToDo: _configuration
    private IConfiguration _configuration;
    public TeamsMessageExtension(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    protected override async Task<MessagingExtensionResponse> OnTeamsMessagingExtensionQueryAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
    {
        var state = query.State; // Check the state value
        var tokenResponse = await GetTokenResponse(turnContext, state, cancellationToken);
        if (tokenResponse == null || string.IsNullOrEmpty(tokenResponse.Token))
        {
            // There is no token, so the user has not signed in yet.
            // Retrieve the OAuth Sign in Link to use in the MessagingExtensionResult Suggested Actions
            var signInLink = await GetSignInLinkAsync(turnContext, cancellationToken).ConfigureAwait(false);            
            return new MessagingExtensionResponse
            {
                ComposeExtension = new MessagingExtensionResult
                {
                    Type = "auth",
                    SuggestedActions = new MessagingExtensionSuggestedAction
                    {
                        Actions = new List<CardAction>
                                {
                                    new CardAction
                                    {
                                        Type = ActionTypes.OpenUrl,
                                        Value = signInLink,
                                        Title = "Bot Service OAuth",
                                    },
                                },
                    },
                },
            };
        }
        GraphClient client = new GraphClient(tokenResponse.Token);
        Document[] docs = await client.GetDocuments(_configuration["MsgExtGraphActCfg:Settings:SiteID"], _configuration["MsgExtGraphActCfg:Settings:ListID"]);

        var invokeResponse = new MessagingExtensionResponse();
        var results = new MessagingExtensionResult
        {
            AttachmentLayout = "list",
            Type = "result",
            Attachments = new List<MessagingExtensionAttachment>(),
        };

        foreach (Document doc in docs)
        {
            results.Attachments.Add(new MessagingExtensionAttachment
            {
                ContentType = AdaptiveCard.ContentType,
                Content = GetDocumentCard(doc),
                Preview = new ThumbnailCard
                {
                    Title = doc.Name,
                    Text = doc.Author
                }.ToAttachment()
            }); ;
        }
        invokeResponse.ComposeExtension = results;
        return invokeResponse;          
    }
    protected override Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionSubmitActionAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
    {
        switch (action.CommandId)
        {
            case "createCard":
                return Task.FromResult(CreateCardCommand(turnContext, action));
            case "shareMessage":
                return Task.FromResult(ShareMessageCommand(turnContext, action));
        }
        return Task.FromResult(new MessagingExtensionActionResponse());
    }


    protected override Task<MessagingExtensionResponse> OnTeamsMessagingExtensionConfigurationQuerySettingUrlAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionQuery query, CancellationToken cancellationToken)
    {
        var response = new MessagingExtensionResponse();
        MessagingExtensionResult results = new MessagingExtensionResult
        {
            Type = "config",
            SuggestedActions = new MessagingExtensionSuggestedAction
            {
                Actions = new List<CardAction>
                {
                    new CardAction
                    {
                        Type = ActionTypes.OpenUrl,
                        Value = $"{_configuration["PUBLIC_HOSTNAME"]}/Config",
                    }
                }
            }
        };
        response.ComposeExtension = results;
        return Task.FromResult(response);
    }

    protected override async Task OnTeamsMessagingExtensionConfigurationSettingAsync(ITurnContext<IInvokeActivity> turnContext, JObject settings, CancellationToken cancellationToken)
    {
        string state = settings["state"].ToString();
        if (!String.IsNullOrEmpty(state))
        {
            JObject stateJson = JObject.Parse(state);
            string siteID = stateJson["siteID"].Value<string>();
            string listID = stateJson["listID"].Value<string>();

            AzureHelper azureAccess = new AzureHelper(_configuration);
            azureAccess.storeConfigValue("MsgExtGraphActCfg:Settings:SiteID", siteID);
            azureAccess.storeConfigValue("MsgExtGraphActCfg:Settings:ListID", listID);

            string sentinel = azureAccess.GetConfigurationValue("MsgExtGraphActCfg:Settings:Sentinel");
            long newSentinel = long.Parse(sentinel);
            newSentinel++;
            azureAccess.storeConfigValue("MsgExtGraphActCfg:Settings:Sentinel", newSentinel.ToString());
        }
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

    private async Task<string> GetSignInLinkAsync(ITurnContext turnContext, CancellationToken cancellationToken)
    {
        var userTokenClient = turnContext.TurnState.Get<UserTokenClient>();
        var resource = await userTokenClient.GetSignInResourceAsync(_connectionName, turnContext.Activity as Activity, null, cancellationToken).ConfigureAwait(false);
        return resource.SignInLink;
    }

    private AdaptiveCard GetDocumentCard(Document doc)
    {
        AdaptiveCard card = new AdaptiveCard(new AdaptiveSchemaVersion(1, 4));

        card.Body.Add(new AdaptiveTextBlock()
        {
            Text = doc.Name,
            Size = AdaptiveTextSize.Medium,
            Weight = AdaptiveTextWeight.Bolder
        });

        card.Body.Add(new AdaptiveTextBlock()
        {
            Text = $"Created by {doc.Author}",           
            Weight = AdaptiveTextWeight.Bolder
        });

        card.Body.Add(new AdaptiveTextBlock()
        {
            Text = $"Created on {doc.Modified.ToShortDateString()}"
        });

        card.Actions.Add(new AdaptiveOpenUrlAction()
        {
            Title = "View",
            Url = new Uri(doc.WebUrl)
        });

        return card;
    }
    private MessagingExtensionActionResponse CreateCardCommand(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action)
    {
        // The user has chosen to create a card by choosing the 'Create Card' context menu command.
        var createCardData = ((JObject)action.Data).ToObject<CardResponse>();

        var card = new HeroCard
        {
            Title = createCardData.Title,
            Subtitle = createCardData.Subtitle,
            Text = createCardData.Text,
        };

        var attachments = new List<MessagingExtensionAttachment>();
        attachments.Add(new MessagingExtensionAttachment
        {
            Content = card,
            ContentType = HeroCard.ContentType,
            Preview = card.ToAttachment(),
        });

        return new MessagingExtensionActionResponse
        {
            ComposeExtension = new MessagingExtensionResult
            {
                AttachmentLayout = "list",
                Type = "result",
                Attachments = attachments,
            },
        };
    }

    private MessagingExtensionActionResponse ShareMessageCommand(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action)
    {
        // The user has chosen to share a message by choosing the 'Share Message' context menu command.
        var heroCard = new HeroCard
        {
            Title = $"{action.MessagePayload.From?.User?.DisplayName} originally sent this message:",
            Text = action.MessagePayload.Body.Content,
        };

        if (action.MessagePayload.Attachments != null && action.MessagePayload.Attachments.Count > 0)
        {
            // This sample does not add the MessagePayload Attachments.
            heroCard.Subtitle = $"({action.MessagePayload.Attachments.Count} Attachments not included)";
        }

        // This Message Extension example allows the user to check a box to include an image with the
        // shared message.  This demonstrates sending custom parameters along with the message payload.
        var includeImage = ((JObject)action.Data)["includeImage"]?.ToString();
        if (string.Equals(includeImage, bool.TrueString, StringComparison.OrdinalIgnoreCase))
        {
            heroCard.Images = new List<CardImage>
                {
                    new CardImage { Url = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtB3AwMUeNoq4gUBGe6Ocj8kyh3bXa9ZbV7u1fVKQoyKFHdkqU" },
                };
        }

        return new MessagingExtensionActionResponse
        {
            ComposeExtension = new MessagingExtensionResult
            {
                Type = "result",
                AttachmentLayout = "list",
                Attachments = new List<MessagingExtensionAttachment>()
                    {
                        new MessagingExtensionAttachment
                        {
                            Content = heroCard,
                            ContentType = HeroCard.ContentType,
                            Preview = heroCard.ToAttachment(),
                        },
                    },
            },
        };
    }

    internal class CardResponse
    {
        public string Title { get; set; }
        public string Subtitle { get; set; }
        public string Text { get; set; }
    }
}

