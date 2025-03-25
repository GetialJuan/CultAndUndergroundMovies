/**
 * @fileoverview Configuration for NextAuth.js authentication.
 * This module sets up authentication options for NextAuth, including providers,
 * session management, and callbacks for JWT and session handling.
 * It uses Prisma for database interaction and bcrypt for password comparison.
 */

import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';
import { compare } from 'bcrypt';

/**
 * Configuration options for NextAuth.js.
 *
 * @type {NextAuthOptions}
 */
export const authOptions: NextAuthOptions = {
  // Removed adapter configuration as it's not used in this setup
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
    signOut: '/',
    error: '/login',
    newUser: '/register',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      /**
       * Authenticates a user based on provided credentials.
       *
       * @async
       * @param {Record<string, { name: string; label: string; type: string; value?: string }>} credentials - User credentials.
       * @returns {Promise<{ id: string; email: string; name: string } | null>} User object or null if authentication fails.
       */
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const existingUser = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!existingUser) {
          return null;
        }

        const passwordMatch = await compare(
          credentials.password,
          existingUser.passwordHash || ''
        );

        if (!passwordMatch) {
          return null;
        }

        return {
          id: existingUser.id,
          email: existingUser.email,
          name: existingUser.username,
        };
      },
    }),
  ],
  callbacks: {
    /**
     * Modifies the JWT token with user information.
     *
     * @async
     * @param {Object} params - Callback parameters.
     * @param {import('next-auth/jwt').JWT} params.token - JWT token.
     * @param {import('next-auth').User | undefined} params.user - User object.
     * @returns {Promise<import('next-auth/jwt').JWT>} Modified JWT token.
     */
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    /**
     * Modifies the session object with user information from the JWT token.
     *
     * @async
     * @param {Object} params - Callback parameters.
     * @param {import('next-auth').Session} params.session - Session object.
     * @param {import('next-auth/jwt').JWT} params.token - JWT token.
     * @returns {Promise<import('next-auth').Session>} Modified session object.
     */
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
      }
      return session;
    },
  },
};