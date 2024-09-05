// File: src/api/controllers/chatController.ts

import { Response } from 'express';
import { ChatService } from '../../services/chatService';
import { asyncHandler } from '../../utils/errorHandler';
import { CreateChatInput, SendMessageInput } from '../validators/chatValidator';
import { AuthenticatedRequest } from '../../types/custom';
import { LLMProvider } from '../../infrastructure/externalServices/llmProviders/llmFactory';


const chatService = new ChatService();

export const createChat = asyncHandler(async (req: AuthenticatedRequest<{}, {}, CreateChatInput>, res: Response) => {
  const { title } = req.body;
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  const userId = req.user._id.toString();

  const chat = await chatService.createChat(userId, title);
  res.status(201).json(chat);
});

export const getUserChats = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
  if (!req.user) {
    throw new Error('User not authenticated');
  }
  const userId = req.user._id.toString();

  const chats = await chatService.getChatsByUser(userId);
  res.status(200).json(chats);
});

export const addMessage = asyncHandler(async (req: AuthenticatedRequest<{chatId: string}, {}, SendMessageInput & {provider: LLMProvider}>, res: Response) => {
  const { chatId } = req.params;
  const { content, provider } = req.body;

  console.log(`Received request to add message with provider: ${provider}`);


  const messages = await chatService.addMessage(chatId, content, 'user', provider);
  res.status(201).json(messages);
});



export const getChatMessages = asyncHandler(async (req: AuthenticatedRequest<{chatId: string}>, res: Response) => {
  const { chatId } = req.params;

  const messages = await chatService.getChatMessages(chatId);
  res.status(200).json(messages);
});