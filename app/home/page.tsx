import { prisma } from '@/lib/prisma'
import Navigation from '../components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from './HomeClient'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'
import { Prisma } from '@prisma/client'

const FEED_LIMIT = 10

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
    where: currentUserId
      ? {
        AND: [
          { id: { not: currentUserId } },
          { followers: { none: { followerId: currentUserId } } },
        ],
      }
      : undefined,
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
  const authorSelect: Prisma.UserSelect = {
    id: true,
    fullname: true,
    username: true,
    image: true,
  }
  if (currentUser) {
    authorSelect.followers = {
      select: { followerId: true },
      where: { followerId: currentUser.id },
    }
  }

  const blogSelect: Prisma.BlogSelect = {
    id: true,
    caption: true,
    imageUrls: true,
    createdAt: true,
    author: { select: authorSelect },
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
  }

  if (currentUserId) {
    blogSelect.likes = {
      where: { userId: currentUserId },
      select: { userId: true },
      take: 1,
    }
    blogSelect.savedBy = {
      where: { userId: currentUserId },
      select: { userId: true },
      take: 1,
    }
  }

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    take: FEED_LIMIT, // 🔥 RẤT QUAN TRỌNG
    select: blogSelect,
  })

  /* =====================
     SERIALIZE DATE
  ====================== */
  const blogsDto: BlogDTO[] = blogs.map((b) => ({
    ...b,
    createdAt: b.createdAt.toISOString(),
    isSaved: !!(currentUserId && (b.savedBy?.length ?? 0) > 0),
    sharedFrom: b.sharedFrom
      ? {
          ...b.sharedFrom,
          createdAt: b.sharedFrom.createdAt.toISOString(),
        }
      : null,
  }))

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Navigation />
      <HomeClient
        blogs={blogsDto}
        users={users as SuggestUserDTO[]}
        currentUser={currentUser as CurrentUserSafe}
      />
    </div>
  )
}
