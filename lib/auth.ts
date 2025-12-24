import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const emailOrUsername = (credentials?.email || '').toString().trim()
        const passwordInput = (credentials?.password || '').toString()

        if (!emailOrUsername || !passwordInput) {
          throw new Error('Email/username and password are required')
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: emailOrUsername }, { username: emailOrUsername }],
          },
        })

        if (!user) throw new Error('No user found')

        const isValid = await compare(passwordInput, user.password)
        if (!isValid) throw new Error('Invalid password')

        return user
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // NOTE: user lấy từ DB (authorize), có thể chứa fullname/username
        const u = user as { id: string; fullname?: string | null; username?: string | null }
        token.id = u.id
        token.fullname = u.fullname ?? null
        token.username = u.username ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        const t = token as { fullname?: string | null; username?: string | null }
        session.user.fullname = t.fullname ?? null
        session.user.username = t.username ?? null
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: 'jwt',
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  pages: {
    signIn: '/login',
  },
}
