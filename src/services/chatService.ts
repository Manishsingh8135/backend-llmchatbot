// File: src/services/chatService.ts

import { Chat, IChat } from '../infrastructure/database/models/chatModel';
import { Message, IMessage } from '../infrastructure/database/models/messageModel';
import { AppError } from '../utils/errorHandler';
import { LLMFactory, LLMProvider } from '../infrastructure/externalServices/llmProviders/llmFactory';

export class ChatService {
  async createChat(userId: string, title: string): Promise<IChat> {
    const chat = new Chat({ user: userId, title });
    await chat.save();
    return chat;
  }

  async getChatsByUser(userId: string): Promise<IChat[]> {
    return Chat.find({ user: userId }).sort({ updatedAt: -1 });
  }

  async addMessage(chatId: string, content: string, role: 'user' | 'assistant', provider: LLMProvider): Promise<IMessage[]> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    const userMessage = new Message({ chat: chatId, content, role, provider });
    await userMessage.save();

    let aiMessage: IMessage | null = null;

    if (role === 'user') {
      try {
        console.log(`Generating AI response using ${provider} for message:`, content);
        const llmProvider = LLMFactory.getProvider(provider);

        // Get all messages for this chat
        const allMessages = await Message.find({ chat: chatId })
          .sort({ createdAt: 1 })
          .lean();

        // Prepare context for the AI
        const context = allMessages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Generate AI response
        const aiResponse = await llmProvider.generateResponse(context);
        console.log('AI response generated:', aiResponse);

        // Save AI response
        aiMessage = new Message({
          chat: chatId,
          content: aiResponse,
          role: 'assistant',
          provider
        });
        await aiMessage.save();

        // Update chat's lastMessage and updatedAt
        chat.lastMessage = aiMessage._id;
        chat.updatedAt = new Date();
        await chat.save();
      } catch (error) {
        console.error('Detailed error in ChatService:', error);
        if (error instanceof Error) {
          throw new AppError(`Failed to generate AI response: ${error.message}`, 500);
        } else {
          throw new AppError('Failed to generate AI response: Unknown error', 500);
        }
      }
    }

    return [userMessage, ...(aiMessage ? [aiMessage] : [])];
  }

  async getChatMessages(chatId: string): Promise<IMessage[]> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }

    return Message.find({ chat: chatId }).sort({ createdAt: 1 });
  }

  async getChatById(chatId: string): Promise<IChat> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    return chat;
  }

  async deleteChat(chatId: string): Promise<void> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    await Chat.deleteOne({ _id: chatId });
    await Message.deleteMany({ chat: chatId });
  }

  async updateChatTitle(chatId: string, newTitle: string): Promise<IChat> {
    const chat = await Chat.findById(chatId);
    if (!chat) {
      throw new AppError('Chat not found', 404);
    }
    chat.title = newTitle;
    await chat.save();
    return chat;
  }
}