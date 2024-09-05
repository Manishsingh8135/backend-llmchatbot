// File: src/infrastructure/external-services/llm-providers/geminiProvider.ts

import { GoogleGenerativeAI, Part } from '@google/generative-ai';
import { llmConfig } from '../../../config/llmconfig';

export class GeminiProvider {
  private genAI: GoogleGenerativeAI;

  constructor() {
    this.genAI = new GoogleGenerativeAI(llmConfig.gemini.apiKey!);
  }

  async generateResponse(messages: Array<{ role: string; content: string }>): Promise<string> {
    try {
      console.log('Sending request to Gemini with messages:', messages);
      console.log('Using model:', llmConfig.gemini.model);

      const model = this.genAI.getGenerativeModel({ model: llmConfig.gemini.model });

      // Convert roles and prepare history
      const history = messages.slice(0, -1).map(msg => ({
        role: this.convertRole(msg.role),
        parts: [{ text: msg.content } as Part],
      }));

      const chat = model.startChat({
        history: history,
      });

      // Send the last message
      const lastMessage = messages[messages.length - 1];
      const result = await chat.sendMessage(lastMessage.content);
      const response = result.response;

      console.log('Received response from Gemini:', response);

      return response.text();
    } catch (error) {
      console.error('Detailed error from Gemini:', error);
      throw error;
    }
  }

  private convertRole(role: string): 'user' | 'model' {
    switch (role.toLowerCase()) {
      case 'user':
        return 'user';
      case 'assistant':
      case 'system':
        return 'model';
      default:
        console.warn(`Unknown role "${role}" defaulting to "user"`);
        return 'user';
    }
  }
}