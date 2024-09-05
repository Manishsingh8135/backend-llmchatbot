// File: src/api/routes/authRoutes.ts

import express from 'express';
import { register, login } from '../controllers/authController';
import { validate } from '../middlewares/validationMiddleware';
import { registerSchema } from '../validators/authValidator';

const router = express.Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', login);  // We'll add login validation in the next step

export default router;