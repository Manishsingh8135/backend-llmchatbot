// File: src/infrastructure/database/models/chatModel.ts

import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './userModel';
import { IMessage } from './messageModel';

export interface IChat extends Document {
  user: IUser['_id'];
  title: string;
  lastMessage?: IMessage['_id'];
  createdAt: Date;
  updatedAt: Date;
}

const ChatSchema: Schema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
}, { timestamps: true });

export const Chat = mongoose.model<IChat>('Chat', ChatSchema);