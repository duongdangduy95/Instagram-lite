import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatTimeAgo } from '@/lib/formatTimeAgo';
import FollowButton from '../components/FollowButton';
import Navigation from '../components/Navigation';
import BlogActions from '../components/BlogActions';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

// Lấy người dùng hiện tại từ NextAuth session
async function getCurrentUser() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  return prisma.user.findUnique({
    where: { id: session.user.id },
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

      // Lấy danh sách likes để check user hiện tại đã like chưa
      likes: currentUser
        ? { where: { userId: currentUser.id } }
        : false,

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
      {/* HEADER */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              InstaClone
            </Link>
            <div className="hidden md:block">
              <input
                type="search"
                placeholder="Tìm kiếm..."
                className="px-4 py-2 bg-gray-100 rounded-full w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto p-4 space-y-4">
        {blogs.map((blog) => {
          const isShared = !!blog.sharedFrom
          const displayBlog = blog.sharedFrom ?? blog


          const isCurrentUser = blog.author.id === currentUser?.id
          const isFollowing = blog.author.followers?.length > 0
          const isLiked = blog.likes?.length > 0

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
