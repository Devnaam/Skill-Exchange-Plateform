import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
  };
}

export interface RegisterBody {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location?: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface UpdateProfileBody {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
}
