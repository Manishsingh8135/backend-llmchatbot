// File: src/infrastructure/external-services/llm-providers/llmFactory.ts

import { OpenAIProvider } from './openAIProvider';
import { ClaudeProvider } from './anthropicProvider';
import { GeminiProvider } from './geminiProvider';

export type LLMProvider = 'openai' | 'claude' | 'gemini';

export class LLMFactory {
  static getProvider(provider: LLMProvider) {
    switch (provider) {
      case 'openai':
        return new OpenAIProvider();
      case 'claude':
        return new ClaudeProvider();
      case 'gemini':
        return new GeminiProvider();
      default:
        throw new Error(`Unsupported LLM provider: ${provider}`);
    }
  }
}