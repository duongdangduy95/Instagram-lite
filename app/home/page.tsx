import { prisma } from '@/lib/prisma'
import Navigation from '../components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from './HomeClient'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'

const FEED_LIMIT = 10



type BlogWithRelations = {
  id: string
  caption?: string
  imageUrls: string[]
  createdAt: Date
  author: {
    id: string
    fullname: string
    username: string
    image?: string | null
    followers?: { followerId: string }[]
  }
  likes?: { userId: string }[]
  savedBy?: { userId: string }[]
  _count: {
    likes: number
    comments: number
  }
  sharedFrom?: {
    id: string
    caption?: string
    imageUrls: string[]
    createdAt: Date
    author: {
      id: string
      fullname: string
      username: string
      image?: string | null
    }
    _count: {
      likes: number
      comments: number
    }
  }
}

// Lấy người dùng hiện tại từ NextAuth session
async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, fullname: true, username: true, image: true },
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
      image: true,
      followers: currentUser
        ? { select: { followerId: true }, where: { followerId: currentUser.id } }
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
          image: true,
          followers: currentUser
            ? { select: { followerId: true }, where: { followerId: currentUser.id } }
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

      savedBy: currentUserId
        ? {
          where: { userId: currentUserId },
          select: { userId: true },
          take: 1,
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
          author: { select: { id: true, fullname: true, username: true, image: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
    } as any,
  })

  /* =====================
     SERIALIZE DATE
  ====================== */
  const blogsDto: BlogDTO[] = (blogs as any[]).map((b: any) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    isSaved: !!(currentUserId && b.savedBy?.length),
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
