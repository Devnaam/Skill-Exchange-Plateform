export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
  createdAt?: string;
  isVerified?: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  location?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export interface UserSkill {
  id: string;
  userId: string;
  skillId: string;
  type: 'OFFERED' | 'WANTED';
  proficiencyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
  skill: Skill;
  createdAt?: string;
}

export interface ProfileWithSkills extends User {
  skillsOffered?: UserSkill[];
  skillsWanted?: UserSkill[];
}
