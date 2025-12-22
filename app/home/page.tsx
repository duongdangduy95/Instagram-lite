import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import Navigation from '../components/Navigation'
import BlogActions from '../components/BlogActions'
import FollowButton from '../components/FollowButton'
import BlogImages from '../components/BlogImages'
import UserSuggestionItem from '../components/UserSuggestionItem'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import BlogFeed from '../components/BlogFeed'




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
  return prisma.user.findUnique({ where: { id: session.user.id } })
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

  return (
    <div className="min-h-screen bg-black">
      {/* NAVIGATION */}
      <Navigation />

      <div className="ml-64 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0">
        {/* Main Content - Cột giữa */}
        <main className="flex justify-center px-4 py-4">
          <div className="w-full max-w-xl space-y-4">
        <BlogFeed blogs={blogs} currentUser={currentUser} />
          </div>
        </main>

        {/* USER LIST SIDE BAR */}
        <aside className="hidden lg:block px-6 py-4 space-y-3 border-l border-gray-800 bg-black sticky top-0 h-screen overflow-y-auto">
          <p className="text-gray-300 font-semibold mb-4 text-lg">Gợi ý theo dõi</p>
          <div className="space-y-4">
            {users.map((user) => (
              <UserSuggestionItem
                key={user.id}
                user={user}
                currentUserId={currentUser?.id || null}
              />
            ))}
          </div>
        </aside>
      </div>
    </div>
  )
}
