// File: src/infrastructure/external-services/llm-providers/openAIProvider.ts

import OpenAI from 'openai';
import { llmConfig } from '../../../config/llmconfig';

export class OpenAIProvider {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: llmConfig.openai.apiKey,
    });
  }

  async generateResponse(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      console.log('Sending request to OpenAI with messages:', messages);
      console.log('Using model:', llmConfig.openai.model);
      
      const completion = await this.openai.chat.completions.create({
        model: llmConfig.openai.model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          ...messages.map(msg => ({
            role: msg.role as 'user' | 'assistant' | 'system',
            content: msg.content
          }))
        ],
      });

      console.log('Received response from OpenAI:', completion);

      if (completion.choices && completion.choices.length > 0) {
        return completion.choices[0].message.content || '';
      } else {
        throw new Error('No response generated from OpenAI');
      }
    } catch (error) {
      console.error('Detailed error from OpenAI:', error);
      throw error;
    }
  }
}