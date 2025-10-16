import NextAuth, { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            throw new Error('Email and password are required');
          }

          // Call your backend login API
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              email: credentials.email,
              password: credentials.password,
            }
          );

          const { token, user } = response.data;

          if (token && user) {
            // Return user object with all fields
            return {
              id: user.id,
              email: user.email,
              firstName: user.firstName,
              lastName: user.lastName,
              username: user.username,
              bio: user.bio,
              location: user.location,
              profileImage: user.profileImage,
              
              // Contact
              phone: user.phone,
              website: user.website,
              
              // Social Media
              linkedin: user.linkedin,
              twitter: user.twitter,
              github: user.github,
              
              // Personal Details
              languages: user.languages,
              interests: user.interests,
              experienceYears: user.experienceYears,
              
              // Preferences
              availability: user.availability,
              preferredMeetingType: user.preferredMeetingType,
              exchangePreference: user.exchangePreference,
              
              // System
              isVerified: user.isVerified,
              createdAt: user.createdAt,
              
              // Access token for API calls
              accessToken: token,
            };
          }

          return null;
        } catch (error: any) {
          console.error('Authentication error:', error.response?.data || error.message);
          
          // Throw error to show message on login page
          const errorMessage = error.response?.data?.error || 'Authentication failed';
          throw new Error(errorMessage);
        }
      },
    }),
  ],
  
  callbacks: {
    /**
     * JWT callback - runs when token is created or updated
     */
    async jwt({ token, user, trigger, session }) {
      // Initial sign in - populate token with user data
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.username = user.username;
        token.bio = user.bio;
        token.location = user.location;
        token.profileImage = user.profileImage;
        
        // Contact
        token.phone = user.phone;
        token.website = user.website;
        
        // Social Media
        token.linkedin = user.linkedin;
        token.twitter = user.twitter;
        token.github = user.github;
        
        // Personal Details
        token.languages = user.languages;
        token.interests = user.interests;
        token.experienceYears = user.experienceYears;
        
        // Preferences
        token.availability = user.availability;
        token.preferredMeetingType = user.preferredMeetingType;
        token.exchangePreference = user.exchangePreference;
        
        // System
        token.isVerified = user.isVerified;
        token.accessToken = user.accessToken;
      }

      // Update session trigger - update token with new data
      if (trigger === 'update' && session) {
        token = { ...token, ...session.user };
      }

      return token;
    },

    /**
     * Session callback - runs when session is checked
     */
    async session({ session, token }) {
      if (token && session.user) {
        // Populate session with token data
        session.user = {
          id: token.id as string,
          email: token.email as string,
          firstName: token.firstName as string,
          lastName: token.lastName as string,
          username: token.username as string | undefined,
          bio: token.bio as string | undefined,
          location: token.location as string | undefined,
          profileImage: token.profileImage as string | undefined,
          
          // Contact
          phone: token.phone as string | undefined,
          website: token.website as string | undefined,
          
          // Social Media
          linkedin: token.linkedin as string | undefined,
          twitter: token.twitter as string | undefined,
          github: token.github as string | undefined,
          
          // Personal Details
          languages: token.languages as string | undefined,
          interests: token.interests as string | undefined,
          experienceYears: token.experienceYears as number | undefined,
          
          // Preferences
          availability: token.availability as 'AVAILABLE' | 'BUSY' | 'UNAVAILABLE' | undefined,
          preferredMeetingType: token.preferredMeetingType as 'IN_PERSON' | 'ONLINE' | 'BOTH' | undefined,
          exchangePreference: token.exchangePreference as 'TEACHING_ONLY' | 'LEARNING_ONLY' | 'FLEXIBLE' | undefined,
          
          // System
          isVerified: token.isVerified as boolean | undefined,
          createdAt: token.createdAt as string | undefined,
        };
        
        // Add access token to session for API calls
        session.accessToken = token.accessToken as string;
      }
      
      return session;
    },
  },
  
  pages: {
    signIn: '/login',
    error: '/login',
  },
  
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  
  secret: process.env.NEXTAUTH_SECRET,
  
  debug: process.env.NODE_ENV === 'development',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
