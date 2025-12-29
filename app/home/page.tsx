import { prisma } from '@/lib/prisma'
import Navigation from '../components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from './HomeClient'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'

const FEED_LIMIT = 10

async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      fullname: true,
      username: true,
    },
  })
}

export default async function HomePage() {
  const currentUser = await getCurrentUser()
  const currentUserId = currentUser?.id

  /* =====================
     USER SUGGESTION
  ====================== */
  const users = await prisma.user.findMany({
    where: currentUserId ? { id: { not: currentUserId } } : undefined,
    select: {
      id: true,
      fullname: true,
      username: true,
      _count: { select: { followers: true } },
      followers: currentUserId
        ? {
            where: { followerId: currentUserId },
            select: { followerId: true },
            take: 1, // 🔥 CHỈ CẦN BIẾT CÓ FOLLOW HAY KHÔNG
          }
        : undefined,
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  /* =====================
     BLOG FEED (TỐI ƯU)
  ====================== */
  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: FEED_LIMIT, // 🔥 RẤT QUAN TRỌNG
    select: {
      id: true,
      caption: true,
      imageUrls: true,
      createdAt: true,

      author: {
        select: {
          id: true,
          fullname: true,
          username: true,
          followers: currentUserId
            ? {
                where: { followerId: currentUserId },
                select: { followerId: true },
                take: 1, // 🔥 KHÔNG COUNT
              }
            : undefined,
        },
      },

      likes: currentUserId
        ? {
            where: { userId: currentUserId },
            select: { userId: true },
            take: 1, // 🔥 LIKE HAY KHÔNG
          }
        : undefined,

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },

      sharedFrom: {
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          createdAt: true,
          author: {
            select: {
              id: true,
              fullname: true,
              username: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
      },
    },
  })

  /* =====================
     SERIALIZE DATE
  ====================== */
  const blogsDto: BlogDTO[] = blogs.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    sharedFrom: b.sharedFrom
      ? {
          ...b.sharedFrom,
          createdAt: b.sharedFrom.createdAt.toISOString(),
        }
      : null,
  }))

  return (
    <div className="min-h-screen bg-black">
      <Navigation />
      <HomeClient
        blogs={blogsDto}
        users={users as SuggestUserDTO[]}
        currentUser={currentUser as CurrentUserSafe}
      />
    </div>
  )
}
