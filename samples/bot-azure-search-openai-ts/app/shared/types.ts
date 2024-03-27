export type WelcomeCard = {
  questions: string[];
};

export type ResponseCard = {
  answer: string;
  citations: Citation[];
  supportingContent: SupportingContent[];
};

export type Citation = {
  filename: string;
  url: string;
};

export type SupportingContent = {
  filename: string;
  content: string;
};

export type ChatOverrides = {
  gpt4v_input: string;
  retrieval_mode: string;
  semantic_captions: boolean;
  semantic_ranker: boolean;
  suggest_followup_questions: boolean;
  top: number;
  use_gpt4v: boolean;
  use_groups_security_filter: boolean;
  use_oid_security_filter: boolean;
  vector_fields: string[];
};

export type ChatMessage = {
  content: string;
  role: string;
};

export type ChatRequest = {
  context: ChatRequestContext;
  messages: ChatMessage[];
  session_state: string | null;
  stream: boolean;
};

export type ChatResponse = {
  choices: ChatChoice[];
  created: number;
  id: string;
  model: string;
  object: string;
  prompt_filter_results: ChatPromptFilterResult[];
  usage: ChatUsage;
};

export type ChatChoice = {
  content_filter_results: ContentFilterResults;
  context: ChatResponseContext;
  finish_reason: string;
  index: number;
  message: ChatMessage;
  session_state: string | null;
};

export type ContentFilterResults = {
  hate: ContentFilterResult;
  self_harm: ContentFilterResult;
  sexual: ContentFilterResult;
  violence: ContentFilterResult;
};

export type ContentFilterResult = {
  filtered: boolean;
  severity: string;
};

export type ChatResponseContext = {
  data_points: DataPoints;
  followup_questions: string[];
  thoughts: string;
};

export type DataPoints = {
  text: string[];
};

export type ChatRequestContext = {
  overrides: ChatOverrides;
};

export type ChatPromptFilterResult = {
  content_filter_results: ContentFilterResults;
  prompt_index: number;
};

export type ChatUsage = {
  completion_tokens: number;
  prompt_tokens: number;
  total_tokens: number;
};

export type ActionData = {
  displayText: string;
  text: string;
};
