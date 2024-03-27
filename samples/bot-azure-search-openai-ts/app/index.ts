import {Application, TurnState} from '@microsoft/teams-ai';
import {BlobsStorage} from 'botbuilder-azure-blobs';
import adapter from './shared/adapter';
import * as bot from './bot';
import config from './shared/config';
import {ChatMessage} from './shared/types';

type ConversationState = {
  messages: ChatMessage[];
};

export type ApplicationTurnState = TurnState<ConversationState>;

const storage = new BlobsStorage(
  config.blobConnectionString,
  config.blobContainerName
);

const app = new Application<ApplicationTurnState>({
  adapter,
  storage,
});

bot.setup(app);

export default app;
