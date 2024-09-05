// File: src/api/routes/chatRoutes.ts

import express from 'express';
import { protect } from '../middlewares/authMiddleware';
import { validate } from '../middlewares/validationMiddleware';
import { createChatSchema, sendMessageSchema } from '../validators/chatValidator';
import { createChat, getUserChats, addMessage, getChatMessages } from '../controllers/chatController';

const router = express.Router();

router.use(protect);  // All chat routes require authentication

router.post('/', validate(createChatSchema), createChat);
router.get('/', getUserChats);
router.post('/:chatId/messages', validate(sendMessageSchema), addMessage);
router.get('/:chatId/messages', getChatMessages);

export default router;