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
    async jwt({ token, user, account, trigger, session }) {
      // Nếu là Google OAuth và chưa có id trong token, fetch user từ DB
      if (account?.provider === 'google') {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email! },
        })
        if (dbUser) {
          token.id = dbUser.id
          token.fullname = dbUser.fullname
          token.username = dbUser.username
          token.image = dbUser.image ?? null
          return token
        }
      }

      // Cho phép client gọi useSession().update(...) để refresh session sau khi update profile.
      // Lưu ý: NextAuth gửi "session" = payload client truyền lên, KHÔNG nhất thiết bọc trong session.user.
      if (trigger === 'update' && session) {
        type SessionUpdatePayload = {
          user?: {
            fullname?: string | null
            username?: string | null
            image?: string | null
          }
          fullname?: string | null
          username?: string | null
          image?: string | null
        }

        const raw = session as SessionUpdatePayload
        const s = raw.user ?? raw
        if (typeof s.fullname !== 'undefined') token.fullname = s.fullname ?? null
        if (typeof s.username !== 'undefined') token.username = s.username ?? null
        if (typeof s.image !== 'undefined') token.image = s.image ?? null
        return token
      }
      
      if (user) {
        // NOTE: user lấy từ DB (authorize), có thể chứa fullname/username
        const u = user as { id: string; fullname?: string | null; username?: string | null; image?: string | null }
        token.id = u.id
        token.fullname = u.fullname ?? null
        token.username = u.username ?? null
        token.image = u.image ?? null
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = (token.id as string) || (token.sub as string)
        const t = token as { fullname?: string | null; username?: string | null; image?: string | null }
        session.user.fullname = t.fullname ?? null
        session.user.username = t.username ?? null
        session.user.image = t.image ?? null
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
