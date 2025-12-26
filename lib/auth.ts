import type { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import GoogleProvider from 'next-auth/providers/google'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcrypt'

export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
      profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          username: profile.email?.split('@')[0] || '',
          fullname: profile.name || '',
          image: profile.picture,
          password: null,
        }
      },
    }),
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

        // Kiểm tra user có password không (OAuth users không có password)
        if (!user.password) {
          throw new Error('Please sign in with OAuth provider')
        }

        const isValid = await compare(passwordInput, user.password)
        if (!isValid) throw new Error('Invalid password')

        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! },
        })

        if (!existingUser) {
          // Tạo user mới từ Google OAuth
          await prisma.user.create({
            data: {
              email: user.email!,
              username: user.email?.split('@')[0] || '',
              fullname: user.name || '',
              image: user.image,
              password: null, // OAuth users không cần password
            },
          })
        }
      }
      return true
    },
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
