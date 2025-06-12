export interface UserProfile {
  name: string;
  email?: string;
  image?: string;
  password?: string;
  // Add other profile fields as needed
}

export const setProfile = (profile: UserProfile) => {
  localStorage.setItem('profile', JSON.stringify(profile));
};

export const getProfile = (): UserProfile | null => {
  const profile = localStorage.getItem('profile');
  return profile ? JSON.parse(profile) : null;
};

export const clearProfile = () => {
  localStorage.removeItem('profile');
};

import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
};
