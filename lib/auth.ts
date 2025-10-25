// lib/auth.ts
import { AuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from '@auth/prisma-adapter'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from './prisma'
export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
   
  ],
  callbacks: {
    // Thêm user.id vào JWT token
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    // Thêm user.id vào session
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
}
