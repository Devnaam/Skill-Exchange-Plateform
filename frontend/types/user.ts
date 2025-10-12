export type ExchangePreference = 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';

export type ProficiencyLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  exchangePreference: ExchangePreference;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
