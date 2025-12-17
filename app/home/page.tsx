import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import Navigation from '../components/Navigation'
import BlogActions from '../components/BlogActions'
import FollowButton from '../components/FollowButton'
import BlogImages from '../components/BlogImages'
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
  sharedFrom?: BlogWithRelations
}

// Lấy người dùng hiện tại từ session
async function getCurrentUser() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return null
  return prisma.user.findUnique({ where: { id: session.user.id } })
}

export default async function HomePage() {
  const currentUser = await getCurrentUser()

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
            ? { where: { followerId: currentUser.id } }
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
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {blogs.map((blog) => {
          const isShared = !!blog.sharedFrom
          const displayBlog = blog.sharedFrom ?? blog
          const isCurrentUser = blog.author.id === currentUser?.id
          const isFollowing = (blog.author.followers?.length ?? 0) > 0
          const isLiked = (blog.likes?.length ?? 0) > 0

          return (
            <div key={blog.id} className="bg-white rounded-lg border shadow">
              {/* NGƯỜI SHARE */}
              {isShared && (
                <div className="px-4 pt-4 text-sm text-gray-600">
                  <span className="font-semibold">{blog.author.fullname}</span> đã chia sẻ
                </div>
              )}

              {/* HEADER */}
              <div className="p-4 flex justify-between items-center">
                <Link href={`/profile/${displayBlog.author.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="font-bold text-gray-700">
                        {displayBlog.author.fullname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">{displayBlog.author.fullname}</p>
                      <p className="text-xs text-gray-500">
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

              {/* CAPTION */}
              {displayBlog.caption && (
                <div className="px-4 pb-2 text-gray-800 border-b">{displayBlog.caption}</div>
              )}

              {/* KHUNG ẢNH MULTI */}
              <div className="mx-4 mb-4 border rounded-lg overflow-hidden bg-gray-50">
                <BlogImages imageUrls={displayBlog.imageUrls} blogId={displayBlog.id} />
              </div>


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
      </main>
    </div>
  )
}