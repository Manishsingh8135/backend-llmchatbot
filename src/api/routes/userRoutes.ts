// File: src/api/routes/userRoutes.ts

import express from 'express';
import { getUserProfile } from '../controllers/userController';
import { protect } from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/profile', protect, getUserProfile);

export default router;