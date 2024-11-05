import type {
  ChatCompletionCreateParamsBase as OpenAIChatCompletionCreateParamsBase,
  ChatCompletion as OpenAIChatCompletionType,
} from 'openai/resources/chat/completions';

export type OpenAIChatCompletion = OpenAIChatCompletionType;
export type OpenAIChatCompletionCreateParams =
  OpenAIChatCompletionCreateParamsBase;

export type ChatCompletion = OpenAIChatCompletion;
