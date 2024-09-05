// File: src/api/middlewares/authMiddleware.ts

import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../../utils/jwtUtils';
import User from '../../infrastructure/database/models/userModel';
import { AppError } from './errorMiddleware';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    next(new AppError('Not authorized to access this route', 401));
    return;
  }

  try {
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      next(new AppError('No user found with this id', 404));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    next(new AppError('Not authorized to access this route', 401));
  }
};