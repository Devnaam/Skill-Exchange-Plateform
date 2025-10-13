import 'next-auth';

declare module 'next-auth' {
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
      exchangePreference?: string;
    };
  }

  interface User {
    accessToken?: string;
    user?: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: any;
  }
}
