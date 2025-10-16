// ==================== USER TYPES ====================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  
  // Contact Information
  phone?: string;
  website?: string;
  
  // Social Media
  linkedin?: string;
  twitter?: string;
  github?: string;
  
  // Personal Details
  languages?: string;
  interests?: string;
  experienceYears?: number;
  
  // Preferences
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  preferredMeetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
  
  // Location Coordinates (for future features)
  latitude?: number;
  longitude?: number;
  
  // System Fields
  createdAt?: string;
  updatedAt?: string;
  isVerified?: boolean;
}

// ==================== AUTH TYPES ====================

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

// ==================== PROFILE UPDATE TYPES ====================

export interface UpdateProfileData {
  firstName?: string;
  lastName?: string;
  username?: string;
  email?: string;
  bio?: string;
  location?: string;
  profileImage?: string;
  
  // Contact
  phone?: string;
  website?: string;
  
  // Social Media
  linkedin?: string;
  twitter?: string;
  github?: string;
  
  // Personal
  languages?: string;
  interests?: string;
  experienceYears?: string | number;
  
  // Preferences
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  preferredMeetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
}

// ==================== SKILL TYPES ====================

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt?: string;
}

export interface Skill {
  id: string;
  name: string;
  categoryId?: string;
  category?: Category;
  description?: string;
  createdAt?: string;
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
  updatedAt?: string;
}

export interface AddSkillData {
  skillId: string;
  skillType: 'OFFERED' | 'WANTED';
  proficiencyLevel?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  description?: string;
}

// ==================== PROFILE TYPES ====================

export interface ProfileWithSkills extends User {
  skillsOffered?: UserSkill[];
  skillsWanted?: UserSkill[];
  vouchesReceived?: Vouch[];
}

// ==================== CONNECTION TYPES ====================

export interface Connection {
  id: string;
  senderId: string;
  receiverId: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  message?: string;
  createdAt: string;
  updatedAt?: string;
  sender?: User;
  receiver?: User;
}

export interface ConnectionRequest {
  receiverId: string;
  message?: string;
}

// ==================== MATCH TYPES ====================

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchType: 'PERFECT_SWAP' | 'TEACHER' | 'LEARNER';
  score?: number;
  matchingSkills: Array<{
    skill: Skill;
  }>;
  matchedUser?: User;
  createdAt?: string;
}

// ==================== POST TYPES ====================

export interface Post {
  id: string;
  userId: string;
  content: string;
  postType: 'TEXT' | 'SKILL_SHOWCASE' | 'TIP' | 'EVENT';
  skillId?: string;
  createdAt: string;
  updatedAt?: string;
  user: User;
  skill?: Skill;
  likes: Like[];
  comments: Comment[];
}

export interface CreatePostData {
  content: string;
  postType: 'TEXT' | 'SKILL_SHOWCASE' | 'TIP' | 'EVENT';
  skillId?: string;
}

export interface Like {
  id: string;
  userId: string;
  postId: string;
  createdAt: string;
  user?: User;
}

export interface Comment {
  id: string;
  userId: string;
  postId: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  user: User;
}

export interface AddCommentData {
  postId: string;
  content: string;
}

// ==================== MESSAGE TYPES ====================

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  read: boolean;
  createdAt: string;
  sender?: User;
  receiver?: User;
}

export interface SendMessageData {
  receiverId: string;
  content: string;
}

export interface Conversation {
  userId: string;
  user: User;
  lastMessage: Message;
  unreadCount: number;
}

// ==================== VOUCH TYPES ====================

export interface Vouch {
  id: string;
  voucherId: string;
  vouchedUserId: string;
  skillId: string;
  comment?: string;
  rating?: number;
  createdAt: string;
  voucher: User;
  vouchedUser?: User;
  skill: Skill;
}

export interface CreateVouchData {
  vouchedUserId: string;
  skillId: string;
  comment?: string;
  rating?: number;
}

// ==================== NOTIFICATION TYPES ====================

export interface Notification {
  id: string;
  userId: string;
  type: 'CONNECTION_REQUEST' | 'CONNECTION_ACCEPTED' | 'NEW_MESSAGE' | 'NEW_MATCH' | 'VOUCH_RECEIVED';
  title: string;
  message: string;
  read: boolean;
  linkUrl?: string;
  createdAt: string;
}

// ==================== SEARCH TYPES ====================

export interface SearchFilters {
  search?: string;
  location?: string;
  availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
  meetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
  skillId?: string;
  categoryId?: string;
  limit?: number;
}

export interface LocationSearchParams {
  latitude: number;
  longitude: number;
  radius: number; // in kilometers
  skillId?: string;
}

// ==================== API RESPONSE TYPES ====================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// ==================== STATS TYPES ====================

export interface UserStats {
  connections: number;
  matches: number;
  vouches: number;
  skillsShared: number;
  postsCount: number;
  messagesCount: number;
}

// ==================== FORM VALIDATION TYPES ====================

export interface ValidationError {
  field: string;
  message: string;
}

export interface FormState {
  loading: boolean;
  error: string | null;
  success: boolean;
  validationErrors?: ValidationError[];
}

// ==================== CONSTANTS ====================

export const AVAILABILITY_OPTIONS = [
  { value: 'AVAILABLE', label: 'Available', description: 'Ready to connect' },
  { value: 'BUSY', label: 'Busy', description: 'Limited time' },
  { value: 'UNAVAILABLE', label: 'Not Available', description: 'Taking a break' },
] as const;

export const MEETING_TYPE_OPTIONS = [
  { value: 'IN_PERSON', label: 'In-Person', description: 'Meet face to face' },
  { value: 'ONLINE', label: 'Online', description: 'Virtual meetings' },
  { value: 'BOTH', label: 'Both', description: 'Flexible' },
] as const;

export const PROFICIENCY_LEVELS = [
  { value: 'BEGINNER', label: 'Beginner' },
  { value: 'INTERMEDIATE', label: 'Intermediate' },
  { value: 'ADVANCED', label: 'Advanced' },
  { value: 'EXPERT', label: 'Expert' },
] as const;

export const POST_TYPES = [
  { value: 'TEXT', label: 'Text Post', icon: '📝' },
  { value: 'SKILL_SHOWCASE', label: 'Skill Showcase', icon: '🎯' },
  { value: 'TIP', label: 'Tip', icon: '💡' },
  { value: 'EVENT', label: 'Event', icon: '📅' },
] as const;
