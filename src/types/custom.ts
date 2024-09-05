// File: src/types/custom.ts

import { Request } from 'express';
import { Types } from 'mongoose';

export interface AuthUser {
  _id: Types.ObjectId;
  // Add other user properties as needed
}

export interface AuthenticatedRequest<P = {}, ResBody = {}, ReqBody = {}> extends Request<P, ResBody, ReqBody> {
  user?: AuthUser;
}