// File: src/infrastructure/external-services/llm-providers/claudeProvider.ts

import Anthropic from '@anthropic-ai/sdk';
import { llmConfig } from '../../../config/llmconfig';

export class ClaudeProvider {
  private anthropic: Anthropic;

  constructor() {
    this.anthropic = new Anthropic({
      apiKey: llmConfig.anthropic.apiKey,
    });
  }

  async generateResponse(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      console.log('Sending request to Claude with messages:', messages);
      console.log('Using model:', llmConfig.anthropic.model);

      const prompt = messages.map(msg => `${msg.role === 'user' ? 'Human' : 'Assistant'}: ${msg.content}`).join('\n\n');

      const completion = await this.anthropic.completions.create({
        model: llmConfig.anthropic.model,
        prompt: `${prompt}\n\nAssistant:`,
        max_tokens_to_sample: 300,
      });

      console.log('Received response from Claude:', completion);

      return completion.completion;
    } catch (error) {
      console.error('Detailed error from Claude:', error);
      throw error;
    }
  }
}