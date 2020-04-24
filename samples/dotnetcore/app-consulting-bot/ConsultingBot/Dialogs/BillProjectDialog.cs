using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using AdaptiveCards;
using ConsultingBot.Cards;
using ConsultingBot.Model;
using ConsultingData.Models;
using ConsultingData.Services;
using Microsoft.Bot.Builder;
using Microsoft.Bot.Builder.Dialogs;
using Microsoft.Bot.Builder.Dialogs.Choices;
using Microsoft.Recognizers.Text.DataTypes.TimexExpression;

namespace ConsultingBot.Dialogs
{
    public class BillProjectDialog : CancelAndHelpDialog
    {
        public BillProjectDialog(string dialogId) : base(dialogId)
        {
            AddDialog(new TextPrompt(nameof(TextPrompt) + "projectName", ProjectNameValidatorAsync));
            AddDialog(new ChoicePrompt(nameof(ChoicePrompt)));
            AddDialog(new NumberPrompt<double>(nameof(NumberPrompt<double>)));
            AddDialog(new ConfirmPrompt(nameof(ConfirmPrompt)));
            AddDialog(new DateResolverDialog());
            AddDialog(new WaterfallDialog(nameof(WaterfallDialog), new WaterfallStep[]
            {
                ProjectStepAsync,
                ProjectDisambiguationStepAsync,
                TimeWorkedAsync,
                DeliveryDateAsync,
                ConfirmStepAsync,
                FinalStepAsync,
            }));

            // The initial child Dialog to run.
            InitialDialogId = nameof(WaterfallDialog);
        }

        // Step 1: Ensure we have a project name
        // Result is a list of possible projects from the database
        private async Task<DialogTurnResult> ProjectStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            var requestDetails = stepContext.Options is ConsultingRequestDetails
                    ? stepContext.Options as ConsultingRequestDetails
                    : new ConsultingRequestDetails();

            List<ConsultingProject> result = await ResolveProject(requestDetails.projectName);

            if (result == null || result.Count < 1)
            {
                return await stepContext.PromptAsync(nameof(TextPrompt) + "projectName", new PromptOptions
                {
                    Prompt = MessageFactory.Text("Which project do you want to bill?"),
                    RetryPrompt = MessageFactory.Text("Sorry I didn't get that, which project was it?"),
                }, cancellationToken);
            }
            else
            {
                return await stepContext.NextAsync(result, cancellationToken);
            }
        }

        // Step 2: Project Disambiguation step
        // Result is one or more ConsultingProject objects
        private async Task<DialogTurnResult> ProjectDisambiguationStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            var requestDetails = stepContext.Options is ConsultingRequestDetails
                    ? stepContext.Options as ConsultingRequestDetails
                    : new ConsultingRequestDetails();

            List<ConsultingProject> result = stepContext.Result as List<ConsultingProject>;
            if (result == null)
            {
                var projectName = stepContext.Result as string;
                result = await ResolveProject(projectName);
            }
            requestDetails.possibleProjects = result;

            if (result.Count > 1)
            {
                return await stepContext.PromptAsync(nameof(ChoicePrompt), new PromptOptions
                {
                    Prompt = MessageFactory.Text("Which of these projects did you mean?"),
                    Choices = result.Select(project => new Choice()
                    {
                        Value = $"{project.Client.Name} - {project.Name}"
                    }).ToList()
                }, cancellationToken);
            }
            else
            {
                var project = result.First();
                var foundChoice = new FoundChoice()
                {
                    Value = $"{project.Client.Name} - {project.Name}",
                    Index = 0,
                };
                return await stepContext.NextAsync(foundChoice);
            }

        }

        // Step 2: Save the project name and ensure we have a duration
        // Result is the duration from LUIS or from a user prompt
        private async Task<DialogTurnResult> TimeWorkedAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            var requestDetails = stepContext.Options is ConsultingRequestDetails
                    ? stepContext.Options as ConsultingRequestDetails
                    : new ConsultingRequestDetails();

            var choice = (FoundChoice)stepContext.Result;
            var project = requestDetails.possibleProjects.ToArray()[choice.Index];
            requestDetails.projectName = project.Name;
            requestDetails.project = project;

            if (requestDetails.workHours == 0.0)
            {
                return await stepContext.PromptAsync(nameof(NumberPrompt<double>), new PromptOptions { Prompt = MessageFactory.Text("How many hours did you work?") }, cancellationToken);
            }
            else
            {
                return await stepContext.NextAsync(requestDetails.workHours, cancellationToken);
            }
        }

        // Step 3: Save the work duration and ensure we have work date
        // Result is the work date from LUIS or from a user prompt

        private async Task<DialogTurnResult> DeliveryDateAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            var requestDetails = stepContext.Options is ConsultingRequestDetails
                    ? stepContext.Options as ConsultingRequestDetails
                    : new ConsultingRequestDetails();

            requestDetails.workHours = (double)stepContext.Result;

            if (requestDetails.workDate == null || IsAmbiguous(requestDetails.workDate))
            {
                return await stepContext.BeginDialogAsync(nameof(DateResolverDialog), requestDetails.workDate, cancellationToken);
            }
            else
            {
                return await stepContext.NextAsync(requestDetails.workDate, cancellationToken);
            }
        }

        // Step 4: Save the work date and confirm
        private async Task<DialogTurnResult> ConfirmStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            var requestDetails = stepContext.Options is ConsultingRequestDetails
                    ? stepContext.Options as ConsultingRequestDetails
                    : new ConsultingRequestDetails();

            requestDetails.workDate = (string)stepContext.Result;

            var msg = $"Please confirm that on {requestDetails.workDate} you worked {requestDetails.workHours} hours for {requestDetails.project.Client.Name} on the {requestDetails.project.Name} project";

            return await stepContext.PromptAsync(nameof(ConfirmPrompt), new PromptOptions { Prompt = MessageFactory.Text(msg) }, cancellationToken);
        }

        // Step 5: End the dialog
        private async Task<DialogTurnResult> FinalStepAsync(WaterfallStepContext stepContext, CancellationToken cancellationToken)
        {
            if ((bool)stepContext.Result)
            {
                var requestDetails = stepContext.Options is ConsultingRequestDetails
                        ? stepContext.Options as ConsultingRequestDetails
                        : new ConsultingRequestDetails();

                var timeProperty = new TimexProperty(requestDetails.workDate);
                var deliveryDateText = timeProperty.ToNaturalLanguage(DateTime.Now);

                // TODO: Update billing system here and report any errors to user
                // Here is the success message
                var confirmationMessage = $"OK, I've charged {requestDetails.project.Name} for {requestDetails.workHours} hours worked {deliveryDateText}. Thank you for using ConsultingBot.";

                await stepContext.Context.SendActivityAsync(MessageFactory.Text(confirmationMessage), cancellationToken);

                AdaptiveCard card = BillingConfirmationCard.GetCard(requestDetails);
                var reply = stepContext.Context.Activity.CreateReply();
                reply.Attachments.Add(card.ToAttachment());
                await stepContext.Context.SendActivityAsync(reply).ConfigureAwait(false);

                return await stepContext.EndDialogAsync(requestDetails, cancellationToken);
            }
            else
            {
                return await stepContext.EndDialogAsync(null, cancellationToken);
            }
        }

        private static bool IsAmbiguous(string timex)
        {
            var timexProperty = new TimexProperty(timex);
            return !timexProperty.Types.Contains(Constants.TimexTypes.Definite);
        }

        #region Project name resolution
        private async Task<List<ConsultingProject>> ResolveProject(string keyword)
        {
            if (!string.IsNullOrEmpty(keyword))
            {
                ConsultingDataService dataService = new ConsultingDataService();
                var possibleResults = await dataService.GetProjects(keyword);
                if (possibleResults.Count > 0)
                {
                    // We have a single result, return it
                    return possibleResults;
                }
            }
            return null;
        }

        private async Task<bool> ProjectNameValidatorAsync(PromptValidatorContext<string> promptContext, CancellationToken cancellationToken)
        {
            ConsultingDataService dataService = new ConsultingDataService();
            var keyword = promptContext.Recognized.Value;
            var projects = await ResolveProject(keyword);
            return projects != null && projects.Count > 0;
        }
        #endregion

    }
}
