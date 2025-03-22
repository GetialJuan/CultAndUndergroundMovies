import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import { verifyPassword } from "@/lib/auth"

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        // Se eliminó la verificación de emailVerified

        const isValid = await verifyPassword(credentials.password, user.passwordHash)

        if (!isValid) {
          return null
        }

        // Actualizar último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() },
        })

        return {
          id: user.id,
          name: user.username,
          email: user.email,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Para registro con Google
      if (account?.provider === "google") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (existingUser) {
          // Actualizar información de Google si el usuario ya existe
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              googleId: user.id,
              lastLogin: new Date(),
            },
          })
        } else {
          // Crear un nuevo usuario si no existe
          await prisma.user.create({
            data: {
              email: user.email!,
              username: `google_${
                user.name?.replace(/\s+/g, "_").toLowerCase() || Math.random().toString(36).substring(2, 10)
              }`,
              googleId: user.id,
              // Se eliminó emailVerified
              profilePicture: user.image,
            },
          })
        }
      }

      return true
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
    error: "/login",
    signOut: "/",
  },
  session: {
    strategy: "jwt",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

