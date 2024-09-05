// File: src/services/authService.ts

import User, { IUser } from '../infrastructure/database/models/userModel';
import { generateToken } from '../utils/jwtUtils';
import { AppError } from '../api/middlewares/errorMiddleware';
import { Types } from 'mongoose';


export const registerUser = async (email: string, password: string, name: string): Promise<IUser> => {
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('User already exists', 400);
  }

  const user = new User({ email, password, name });
  await user.save();

  return user;
};

export const loginUser = async (email: string, password: string): Promise<{ user: IUser; token: string }> => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError('Invalid credentials', 401);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid credentials', 401);
  }

  const token = generateToken(user._id);

  return { user, token };
};