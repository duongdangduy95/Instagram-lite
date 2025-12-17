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
        {blogs.map((blog) => {
          const isShared = !!blog.sharedFrom
          const displayBlog = blog.sharedFrom ?? blog
          const isCurrentUser = blog.author.id === currentUser?.id
          const isFollowing = (blog.author.followers?.length ?? 0) > 0
          const isLiked = (blog.likes?.length ?? 0) > 0

          return (
            <div key={blog.id} className="bg-black text-gray-100">
              {/* ===== NGƯỜI SHARE ===== */}
              {isShared && (
                <div className="px-4 pt-4 text-sm text-gray-300">
                  <span className="font-semibold">{blog.author.fullname}</span> đã chia sẻ
                </div>
              )}

              {/* ===== HEADER BÀI GỐC ===== */}
              <div className="px-4 py-3 flex justify-between items-center">
                <Link 
                  href={displayBlog.author.id === currentUser?.id ? '/profile' : `/profile/${displayBlog.author.id}`}
                  prefetch={true}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                      <span className="font-bold text-white">
                        {displayBlog.author.fullname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-100">
                        {displayBlog.author.fullname}
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(displayBlog.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                {!isCurrentUser && currentUser && (
                  <FollowButton
                    targetUserId={displayBlog.author.id}
                    initialIsFollowing={isFollowing}
                  />
                )}
              </div>

              {/* ===== CAPTION SHARE ===== */}
              {isShared && blog.caption && (
                <div className="px-4 pb-2 text-gray-200">
                  {blog.caption}
                </div>
              )}

              {/* ===== CAPTION BÀI GỐC (LÊN TRƯỚC ẢNH) ===== */}
              {displayBlog.caption && (
                <div className="px-4 pb-2 text-gray-200">
                  {displayBlog.caption}
                </div>
              )}

              {/* ===== ẢNH BÀI GỐC (MULTI IMAGE) ===== */}
              <div className="px-4 pb-4">
                <div className="rounded-lg overflow-hidden bg-gray-900">
                  <BlogImages imageUrls={displayBlog.imageUrls} blogId={displayBlog.id} />
                </div>
              </div>

              {/* ===== LIKE / COMMENT ===== */}
              <BlogActions
                blogId={blog.id}
                displayBlogId={displayBlog.id}
                initialLikeCount={blog._count.likes}
                initialCommentCount={blog._count.comments}
                initialLiked={isLiked}
                currentUser={
                  currentUser
                    ? { id: currentUser.id, fullname: currentUser.fullname, username: currentUser.username }
                    : null
                }
              />
            </div>
          )
        })}
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
