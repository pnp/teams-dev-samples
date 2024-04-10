using AdaptiveCards;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Teams;
using Microsoft.Bot.Schema;
using Microsoft.Bot.Schema.Teams;
using MsgextActionSrchData.Controllers;
using MsgextActionSrchData.Model;
using Newtonsoft.Json.Linq;

namespace MsgextActionSrchData.Action;

public class ActionApp : TeamsActivityHandler
{
    private readonly string _adaptiveBaseCardFilePath = Path.Combine(".", "Resources");
    private readonly string _orderJSonFilename = "ProposedOrder2.json";
    private readonly string _displayJSonFilename = "DisplayProductOrder.json";
    protected IConfiguration _config;
    public ActionApp(IConfiguration config)
    {
        _config = config;
    }

    protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionFetchTaskAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
    {      
        //if the bot is installed it will create adaptive card attachment and show card with input fields
        try
        {
            string taskModuleUrl = $"{_config["BotEndpoint"]}initialaction";
            //await TeamsInfo.GetPagedMembersAsync(turnContext, 100, null, cancellationToken);
            return new MessagingExtensionActionResponse
            {
                Task = new TaskModuleContinueResponse
                {
                    Type = "continue",
                    Value = new TaskModuleTaskInfo
                    {
                        Width = 720,
                        Height = 360,
                        Title = "Select a Product",
                        Url = taskModuleUrl
                    }
                }
            };
    }
        catch (Exception ex)
        {
            if (ex.Message.Contains("403"))
            {
                // else it will show installation card in Task module for the Bot so user can install the app
                //return new MessagingExtensionActionResponse
                //        {
                //            Task = new TaskModuleContinueResponse
                //            {
                //                Value = new TaskModuleTaskInfo
                //                {
                //                    Card = GetJustInTimeInstallationCard(),
                //                    Height = 200,
                //                    Width = 400,
                //                    Title = "Adaptive Card: Inputs",
                //                }
                //            },
                //        };

            }
            return null;
            }
    }

    protected override async Task<MessagingExtensionActionResponse> OnTeamsMessagingExtensionSubmitActionAsync(ITurnContext<IInvokeActivity> turnContext, MessagingExtensionAction action, CancellationToken cancellationToken)
    {
        if (action.CommandId == "selectItem")
        {                       
            var actionData = ((JObject)action.Data).ToObject<Product>();
            string prodId = actionData.Id ?? "";
            string prodName = actionData.Name ?? "";
            string prodOrders = actionData.Orders.ToString() ?? "";
            string prodOrderable = actionData.Orderable.ToString() ?? "false";
            string _adaptiveCardFilePath = String.Empty;
            if (prodOrderable != "false")  
            {
                _adaptiveCardFilePath = Path.Combine(_adaptiveBaseCardFilePath, _orderJSonFilename);
            }
            else
            {
                _adaptiveCardFilePath = Path.Combine(_adaptiveBaseCardFilePath, _displayJSonFilename);
            }
            var templateJson = await System.IO.File.ReadAllTextAsync(_adaptiveCardFilePath, cancellationToken);
            var template = new AdaptiveCards.Templating.AdaptiveCardTemplate(templateJson);
            var adaptiveCardJson = template.Expand(new { ID = prodId, Name = prodName, Orders = prodOrders });
            var adaptiveCard = AdaptiveCard.FromJson(adaptiveCardJson).Card;
            
            var attachments = new MessagingExtensionAttachment()
            {
                ContentType = AdaptiveCard.ContentType,
                Content = adaptiveCard
            };

            return new MessagingExtensionActionResponse
            {
                ComposeExtension = new MessagingExtensionResult
                {
                    Type = "result",
                    AttachmentLayout = "list",
                    Attachments = new[] { attachments }
                }
            };
        }
        return null;
    }

    protected override async Task<AdaptiveCardInvokeResponse> OnAdaptiveCardInvokeAsync(ITurnContext<IInvokeActivity> turnContext, AdaptiveCardInvokeValue invokeValue, CancellationToken cancellationToken)
    {
        string dataJson = invokeValue.Action.Data.ToString();
        string verb = invokeValue.Action.Verb;
        
        string _adaptiveCardFilePath = Path.Combine(_adaptiveBaseCardFilePath, _displayJSonFilename);
        var actionData = ((JObject)invokeValue.Action.Data).ToObject<ProductUpdate>();
        string prodId = actionData.Id ?? "";
        string prodName = actionData.Name ?? "";
        string prodOrders = actionData.Orders.ToString() ?? "";
        string prodOrderable = actionData.Orderable.ToString() ?? "false";

        // Update Orders
        ProductController productCtrl = new ProductController(_config);
        Product resultProduct = productCtrl.UpdateProductOrders(actionData);

        var templateJson = await System.IO.File.ReadAllTextAsync(_adaptiveCardFilePath, cancellationToken);
        var template = new AdaptiveCards.Templating.AdaptiveCardTemplate(templateJson);
        var adaptiveCardJson = template.Expand(new { ID = prodId, Name = prodName, Orders = resultProduct.Orders.ToString() });
        var adaptiveCard = AdaptiveCard.FromJson(adaptiveCardJson).Card;
        var attachment = new Attachment
        {
            ContentType = AdaptiveCard.ContentType,
            Content = adaptiveCard
        };
        var messageActivity = MessageFactory.Attachment(attachment);
        await turnContext.SendActivityAsync(messageActivity);

        return new AdaptiveCardInvokeResponse
        {            
            StatusCode = 200
        };
    }
}
