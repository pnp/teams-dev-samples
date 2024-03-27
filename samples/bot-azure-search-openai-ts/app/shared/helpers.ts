import {AdaptiveCards} from '@microsoft/adaptivecards-tools';
import {TurnContext} from 'botbuilder';
import {ApplicationTurnState} from '..';
import config from './config';
import {
  ChatMessage,
  ChatRequest,
  ChatResponse,
  Citation,
  ResponseCard,
  SupportingContent,
  WelcomeCard,
} from './types';
import axios, {AxiosRequestConfig} from 'axios';
import welcomeCard from '../shared/cards/welcome.json';
import responseCard from '../shared/cards/response.json';
import {AdaptiveCard} from '@microsoft/teams-ai';

// render an adaptive card from a template and data
export const renderCard = <T extends object>(template: unknown, data: T) => {
  return AdaptiveCards.declare<T>(template).render(data);
};

export const createWelcomeCard = (questions: string[]): AdaptiveCard => {
  return renderCard<WelcomeCard>(welcomeCard, {questions});
};

export const createResponseCard = (data: ResponseCard): AdaptiveCard => {
  return renderCard<ResponseCard>(responseCard, data);
};

// send an adaptive card to the user with suggested actions (if any)
export const sendAdaptiveCard = async (
  context: TurnContext,
  card: unknown,
  suggestions?: string[]
) => {
  await context.sendActivity({
    type: 'message',
    attachments: [
      {
        contentType: 'application/vnd.microsoft.card.adaptive',
        content: card,
      },
    ],
    suggestedActions: {
      to: [context.activity.from.id],
      actions: suggestions?.map(suggestion => {
        return {
          type: 'imBack',
          title: suggestion,
          value: suggestion,
        };
      }),
    },
  });
};

// reset conversation history
export const resetConversationHistory = (state: ApplicationTurnState): void =>
  state.deleteConversationState();

// create conversation history if not exists
export const createConversationHistory = (
  state: ApplicationTurnState
): ChatMessage[] =>
  (state.conversation.messages = state.conversation.messages || []);

export const addMessageToConversationHistory = (
  state: ApplicationTurnState,
  message: ChatMessage
): number =>
  state.conversation.messages.push({
    content: message.content,
    role: message.role,
  });

// call backend to get chat response
export const getChatResponse = async (
  messages: ChatMessage[]
): Promise<ChatResponse> => {
  const chatPayload: ChatRequest = {
    context: {
      overrides: {
        gpt4v_input: 'textAndImages',
        retrieval_mode: 'hybrid',
        semantic_captions: false,
        semantic_ranker: true,
        suggest_followup_questions: true,
        top: 3,
        use_gpt4v: false,
        use_groups_security_filter: false,
        use_oid_security_filter: false,
        vector_fields: ['embedding'],
      },
    },
    messages,
    session_state: null,
    stream: false,
  };

  try {
    const request: AxiosRequestConfig = {
      url: `${config.appBackendEndpoint}/chat`,
      method: 'POST',
      data: chatPayload,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const response = await axios(request);
    return response.data as ChatResponse;
  } catch (error) {
    throw new Error(error);
  }
};

// extract citation filenames into array - text [file.pdf][file.pdf] -> ["file.pdf", "file.pdf"]
export const getCitations = (content: string): string[] => {
  const matches = content.match(/\[(.*?)\]/g);
  if (matches) {
    const uniqueMatches = Array.from(
      new Set(matches.map(match => match.slice(1, -1)))
    );
    return uniqueMatches;
  }
  return [];
};

// transform data_points array items from strings to objects - "file.pdf: content" -> [{file: file.pdf, content: content}]
export const getSupportingContent = (
  data_points: string[]
): SupportingContent[] => {
  return data_points.map((value: string) => {
    return {
      filename: value.split(':')[0],
      content: value.split(':').splice(1).join(':').trim(),
    };
  });
};

// replace citations with numbers in reply text - [file.pdf][file.pdf] -> **1** **2**
export const replaceCitations = (
  citations: string[],
  content: string
): string => {
  citations.forEach((citation, index) => {
    const regex = new RegExp(`\\[${citation}\\]`, 'g');
    content = content.replace(regex, `**${index + 1}**`);
  });
  // add space between citations - **1****2** -> **1** **2**
  return content.replace(/\*\*\*\*/g, '** **');
};

// convert citation filenames to objects - ["file.pdf", "file.pdf"] -> [{filename: "file.pdf", url: "https://..."}, {filename: "file.pdf", url: "https://..."}]
export const convertCitations = (citations: string[]): Citation[] => {
  return citations.map(citation => {
    return {
      filename: citation,
      url: `${config.appBackendEndpoint}/content/${citation}`,
    };
  });
};
