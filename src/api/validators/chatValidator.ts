// File: src/api/validators/chatValidator.ts

import { z } from 'zod';

// Helper function to validate MongoDB ObjectId
const objectIdRegex = /^[0-9a-fA-F]{24}$/;
const objectId = z.string().refine((val) => objectIdRegex.test(val), {
  message: "Invalid ObjectId format"
});

export const createChatSchema = z.object({
  body: z.object({
    title: z.string().min(1, 'Chat title is required'),
  }),
});

export const sendMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1, 'Message content is required'),
    provider: z.enum(['openai', 'claude', 'gemini'] as const),
  }),
  params: z.object({
    chatId: objectId,
  }),
});

export type CreateChatInput = z.infer<typeof createChatSchema>['body'];
export type SendMessageInput = z.infer<typeof sendMessageSchema>['body'];