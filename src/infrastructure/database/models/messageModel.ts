// File: src/infrastructure/database/models/messageModel.ts

import mongoose, { Document, Schema } from 'mongoose';
import { IChat } from './chatModel';
import { LLMProvider } from '../../externalServices/llmProviders/llmFactory';

export interface IMessage extends Document {
  chat: IChat['_id'];
  content: string;
  role: 'user' | 'assistant' | 'system';
  provider?: LLMProvider;
  createdAt: Date;
}

const MessageSchema: Schema = new Schema({
  chat: { type: Schema.Types.ObjectId, ref: 'Chat', required: true },
  content: { type: String, required: true },
  role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
  provider: { type: String, enum: ['openai', 'claude','gemini'], required: false },
  createdAt: { type: Date, default: Date.now },
});

export const Message = mongoose.model<IMessage>('Message', MessageSchema);