// File: src/config/llmConfig.ts

import dotenv from 'dotenv';

dotenv.config();

export const llmConfig = {
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4o-mini', // or whichever model you prefer
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: 'claude-2.1', // You can change this to the Claude model you prefer
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-pro',
  },
  llama: {
    // Add LLaMA specific configuration if needed
  },
};

// Validate that required environment variables are set
if (!llmConfig.openai.apiKey) {
  throw new Error('OPENAI_API_KEY is not set in the environment variables');
}

if (!llmConfig.anthropic.apiKey) {
  throw new Error('ANTHROPIC_API_KEY is not set in the environment variables');
}

if (!llmConfig.gemini.apiKey) {
  throw new Error('GEMINI_API_KEY is not set in the environment variables');
}