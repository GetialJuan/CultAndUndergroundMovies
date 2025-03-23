// Ruta: lib/auth.ts
import { hash, compare } from 'bcrypt';
import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/prisma';

export async function hashPassword(password: string): Promise<string> {
  return await hash(password, 12);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return await compare(password, hashedPassword);
}

export function generateVerificationToken(): string {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

// Exporta las opciones de autenticación
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        // Se eliminó la verificación de emailVerified

        const isValid = await verifyPassword(
          credentials.password,
          user.passwordHash
        );

        if (!isValid) {
          return null;
        }

        // Actualizar último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        });

        return {
          id: user.id,
          name: user.username,
          email: user.email,
          image: user.profilePicture,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Para registro con Google
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        });

        if (existingUser) {
          // Actualizar información de Google si el usuario ya existe
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: user.id,
              lastLogin: new Date(),
            },
          });
        } else {
          // Crear un nuevo usuario si no existe
          await prisma.user.create({
            data: {
              email: user.email!,
              username: `google_${
                user.name?.replace(/\s+/g, '_').toLowerCase() ||
                Math.random().toString(36).substring(2, 10)
              }`,
              googleId: user.id,
              // Se eliminó emailVerified
              profilePicture: user.image,
            },
          });
        }
      }

      return true;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
    error: '/login',
    signOut: '/',
  },
  session: {
    strategy: 'jwt',
  },
};
