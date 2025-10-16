import { Request } from 'express';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
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
  // Basic Information
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  
  // Contact Information
  phone?: string;
  website?: string;
  
  // Social Media Links
  linkedin?: string;
  twitter?: string;
  github?: string;
  
  // Personal Details
  languages?: string;
  interests?: string;
  experienceYears?: string | number;
  
  // Preferences
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  preferredMeetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
  
  // Location Coordinates (for future)
  latitude?: number;
  longitude?: number;
}
