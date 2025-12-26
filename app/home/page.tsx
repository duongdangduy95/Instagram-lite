import { prisma } from '@/lib/prisma'
import Navigation from '../components/Navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import HomeClient from './HomeClient'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'




type BlogWithRelations = {
  id: string
  caption?: string
  imageUrls: string[]
  createdAt: Date
  author: {
    id: string
    fullname: string
    username: string
    followers?: { followerId: string }[]
  }
  likes?: { userId: string }[]
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
  // Chỉ lấy field cần thiết để tránh lộ thông tin nhạy cảm (vd: password)
  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, fullname: true, username: true },
  })
}

export default async function HomePage() {
  const currentUser = await getCurrentUser()

  const users = await prisma.user.findMany({
    where: currentUser ? { id: { not: currentUser.id } } : undefined,
    select: {
      id: true,
      fullname: true,
      username: true,
      followers: currentUser
        ? { select: { followerId: true }, where: { followerId: currentUser.id } }
        : undefined,
      _count: {
        select: {
          followers: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 10, // Giới hạn số lượng user hiển thị
  })

  const blogs: BlogWithRelations[] = await prisma.blog.findMany({
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
          followers: currentUser
            ? { select: { followerId: true }, where: { followerId: currentUser.id } }
            : undefined,
        },
      },
      sharedFrom: {
        select: {
          id: true,
          caption: true,
          imageUrls: true,
          createdAt: true,
          author: { select: { id: true, fullname: true, username: true } },
          _count: { select: { likes: true, comments: true } },
        },
      },
      likes: currentUser
        ? { select: { userId: true }, where: { userId: currentUser.id } }
        : undefined,
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  // Serialize Date -> string để truyền vào Client Component
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
      {/* NAVIGATION */}
      <Navigation />

      <HomeClient
        blogs={blogsDto}
        users={users as SuggestUserDTO[]}
        currentUser={currentUser as CurrentUserSafe}
      />
    </div>
  )
}
