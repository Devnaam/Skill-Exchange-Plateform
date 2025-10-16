import 'next-auth';

declare module 'next-auth' {
  /**
   * Extended Session interface with complete user profile
   */
  interface Session {
    accessToken?: string;
    user: {
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
      
      // System Fields
      isVerified?: boolean;
      createdAt?: string;
    };
  }

  /**
   * Extended User interface for authentication
   */
  interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
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
    experienceYears?: number;
    
    // Preferences
    availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
    preferredMeetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
    exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
    
    // System
    isVerified?: boolean;
    createdAt?: string;
    
    // Auth token
    accessToken?: string;
  }
}

declare module 'next-auth/jwt' {
  /**
   * Extended JWT interface with complete user data
   */
  interface JWT {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username?: string;
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
    experienceYears?: number;
    
    // Preferences
    availability?: 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE';
    preferredMeetingType?: 'IN_PERSON' | 'ONLINE' | 'BOTH';
    exchangePreference?: 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE';
    
    // System
    isVerified?: boolean;
    
    // Auth token
    accessToken?: string;
  }
}
