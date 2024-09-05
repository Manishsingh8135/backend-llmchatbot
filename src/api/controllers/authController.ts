// File: src/api/controllers/authController.ts

import { Request, Response } from 'express';
import { registerUser, loginUser } from '../../services/authService';
import { asyncHandler } from '../../utils/errorHandler';
import { RegisterInput, LoginInput } from '../validators/authValidator';

export const register = asyncHandler(async (req: Request<{}, {}, RegisterInput>, res: Response) => {
  const { email, password, name } = req.body;
  const user = await registerUser(email, password, name);
  res.status(201).json({ success: true, data: user });
});

export const login = asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response) => {
  const { email, password } = req.body;
  const { user, token } = await loginUser(email, password);
  res.status(200).json({ success: true, data: { user, token } });
});