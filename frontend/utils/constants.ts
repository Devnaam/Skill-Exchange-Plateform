export const EXCHANGE_PREFERENCES = {
  TEACHING_ONLY: 'Teaching Only',
  LEARNING_ONLY: 'Learning Only',
  FLEXIBLE: 'Flexible (Both)',
} as const;

export const PROFICIENCY_LEVELS = {
  BEGINNER: 'Beginner',
  INTERMEDIATE: 'Intermediate',
  ADVANCED: 'Advanced',
  EXPERT: 'Expert',
} as const;

export const SKILL_CATEGORIES = [
  'Arts & Crafts',
  'Business & Finance',
  'Cooking & Culinary',
  'Design & Creativity',
  'Fitness & Wellness',
  'Gardening & Agriculture',
  'Languages',
  'Music & Dance',
  'Photography & Video',
  'Programming & Tech',
  'Writing & Communication',
  'Other',
] as const;

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
  },
  USERS: {
    PROFILE: '/users/profile',
    USER_BY_ID: (id: string) => `/users/${id}`,
  },
  SKILLS: {
    LIST: '/skills',
    USER_SKILLS: '/skills/user',
    ADD: '/skills/user',
    DELETE: (id: string) => `/skills/user/${id}`,
  },
} as const;
