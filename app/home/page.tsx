// app/page.tsx
import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { cookies } from 'next/headers'
import LikeButton from '@/app/components/LikeButton'
import CommentToggle from '@/app/components/CommentToggle'
import FollowButton from '@/app/components/FollowButton'
import ShareButton from '@/app/components/ShareButton'

async function getCurrentUser() {
  const session = (await cookies()).get('session')?.value
  if (!session) return null
  const [userId] = session.split(':')
  if (!userId) return null

  return prisma.user.findUnique({
    where: { id: userId },
  })
}

export default async function HomePage() {
  const currentUser = await getCurrentUser()

  const blogs = await prisma.blog.findMany({
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
          followers: currentUser
            ? { where: { followerId: currentUser.id } }
            : false,
        },
      },

      // 👇 LẤY BÀI GỐC NẾU LÀ SHARE
      sharedFrom: {
        include: {
          author: {
            select: {
              id: true,
              fullname: true,
            },
          },
        },
      },

      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            InstaClone
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {blogs.map((blog) => {
          const isShared = !!blog.sharedFrom
          const displayBlog = blog.sharedFrom ?? blog


          const isCurrentUser = blog.author.id === currentUser?.id
          const isFollowing = blog.author.followers?.length > 0

          return (
            <div
              key={blog.id}
              className="bg-white rounded-lg border shadow"
            >
              {/* ===== NGƯỜI SHARE ===== */}
              {isShared && (
                <div className="px-4 pt-4 text-sm text-gray-600">
                  <span className="font-semibold">{blog.author.fullname}</span> đã chia sẻ
                </div>
              )}

              {/* ===== HEADER BÀI GỐC ===== */}
              <div className="p-4 flex justify-between items-center">
                <Link href={`/profile/${displayBlog.author.id}`}>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                      <span className="font-bold text-gray-700">
                        {displayBlog.author.fullname.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold">
                        {displayBlog.author.fullname}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(displayBlog.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                {!isCurrentUser && currentUser && (
                  <FollowButton
                    currentUserId={currentUser.id}
                    targetUserId={displayBlog.author.id}
                    initialIsFollowing={isFollowing}
                  />
                )}
              </div>

              {/* ===== CAPTION SHARE ===== */}
              {isShared && blog.caption && (
                <div className="px-4 pb-2 text-gray-800">
                  {blog.caption}
                </div>
              )}

              {/* ===== KHUNG BÀI GỐC ===== */}
              <div className="mx-4 mb-4 border rounded-lg overflow-hidden bg-gray-50">
                {displayBlog.caption && (
                  <div className="p-3 text-gray-800">
                    {displayBlog.caption}
                  </div>
                )}

                <Link href={`/blog/${displayBlog.id}`}>
                  <Image
                    src={displayBlog.imageUrl}
                    alt="blog image"
                    width={600}
                    height={400}
                    className="w-full object-cover"
                  />
                </Link>
              </div>

              {/* ===== LIKE / COMMENT ===== */}
              <div className="px-4 pb-4">
                <div className="flex justify-between text-sm text-gray-500 mb-2">
                  <span>{blog._count.likes} lượt thích</span>
                  <span>{blog._count.comments} bình luận</span>
                </div>

                <div className="flex space-x-4 border-t pt-2">
                  <LikeButton
                    blogId={blog.id}
                    userId={currentUser?.id || null}
                    initialLikes={blog._count.likes}
                  />

                  <CommentToggle
                    blogId={blog.id}
                    currentUser={
                      currentUser
                        ? { id: currentUser.id, fullname: currentUser.fullname }
                        : null
                    }
                  />

                  <ShareButton
                    blogId={displayBlog.id}
                    imageUrl={displayBlog.imageUrl}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </main>
    </div>
  )
}
