import {ActivityTypes, AdaptiveCardInvokeValue, TurnContext} from 'botbuilder';
import {AdaptiveCard, Application} from '@microsoft/teams-ai';
import {ApplicationTurnState} from '..';
import {
  resetConversationHistory,
  getChatResponse,
  getCitations,
  getSupportingContent,
  sendAdaptiveCard,
  replaceCitations,
  createConversationHistory,
  addMessageToConversationHistory,
  convertCitations,
  createWelcomeCard,
  createResponseCard,
} from '../shared/helpers';

import {ActionData, ResponseCard} from '../shared/types';
import {constants} from '../shared/constants';

const setup = (app: Application) => {
  app.activity(
    ActivityTypes.InstallationUpdate,
    async (context: TurnContext) => {
      const card = createWelcomeCard(constants.questions);
      await sendAdaptiveCard(context, card);
    }
  );

  app.message(
    'New chat',
    async (context: TurnContext, state: ApplicationTurnState) => {
      resetConversationHistory(state);
      await context.sendActivity(
        "New chat session started - Previous messages won't be used as context for new queries"
      );
      const card = createWelcomeCard(constants.questions);
      await sendAdaptiveCard(context, card);
    }
  );

  app.adaptiveCards.actionExecute(
    'example',
    async (context: TurnContext, state: ApplicationTurnState) => {
      const {action} = context.activity.value as AdaptiveCardInvokeValue;
      const {text} = action.data as ActionData;

      resetConversationHistory(state);
      await processMessage(text, context, state);

      const card = createWelcomeCard(constants.questions);
      return card as AdaptiveCard;
    }
  );

  app.activity(
    ActivityTypes.Message,
    async (context: TurnContext, state: ApplicationTurnState) => {
      const {text} = context.activity;
      await processMessage(text, context, state);
    }
  );
};

const processMessage = async (
  text: string,
  context: TurnContext,
  state: ApplicationTurnState
) => {
  await context.sendActivity({type: 'typing'});

  createConversationHistory(state);

  addMessageToConversationHistory(state, {
    content: text,
    role: 'user',
  });

  const chatResponse = await getChatResponse(state.conversation.messages);
  const chatContext = chatResponse.choices[0].context;
  const {followup_questions} = chatContext;
  const {text: data_points} = chatContext.data_points;
  const {message: reply} = chatResponse.choices[0];

  addMessageToConversationHistory(state, reply);

  const citationFileReferences = getCitations(reply.content);
  const answer = replaceCitations(citationFileReferences, reply.content);
  const citations = convertCitations(citationFileReferences);
  const supportingContent = getSupportingContent(data_points);

  const data: ResponseCard = {
    answer,
    citations,
    supportingContent,
  };
  const card = createResponseCard(data);

  await sendAdaptiveCard(context, card, followup_questions);
};

export {setup};
