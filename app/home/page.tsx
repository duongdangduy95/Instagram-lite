import Link from 'next/link';
import Image from 'next/image';
import { prisma } from '@/lib/prisma';
import { formatTimeAgo } from '@/lib/formatTimeAgo';
import { cookies } from 'next/headers';
import LikeButton from '@/app/components/LikeButton';
import CommentToggle from '../components/CommentToggle';

// Lấy người dùng hiện tại từ session cookie
async function getCurrentUser() {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  const [userId] = session.split(':');
  if (!userId) return null;

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  return user;
}

export default async function HomePage() {
  const currentUser = await getCurrentUser();

  const blogs = await prisma.blog.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      author: {
        select: {
          id: true,
          fullname: true,
        },
      },
      _count: {
        select: {
          likes: true,
          comments: true,
        },
      },
    },
  });

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

      {/* MAIN CONTENT */}
      <main className="max-w-2xl mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">News Feed</h1>

        <div className="space-y-4">
          {blogs.map((blog) => {
            if (!blog?.id || !blog?.author) return null;

            const isCurrentUser = blog.author.id === currentUser?.id;
            const profileLink = isCurrentUser
              ? '/profile'
              : `/profile/${blog.author.id}`;

            return (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow"
              >
                {/* Header */}
                <div className="p-4 border-b">
                  <Link href={profileLink}>
                    <div className="flex items-center space-x-3 hover:bg-gray-50 -m-2 p-2 rounded-lg transition-colors">
                      <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-semibold text-sm">
                          {blog.author.fullname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800 hover:underline">
                          {blog.author.fullname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Caption */}
                {blog.caption && (
                  <div className="px-4 py-3">
                    <p className="text-gray-800 leading-relaxed">
                      {blog.caption}
                    </p>
                  </div>
                )}

                {/* Image */}
                <Link href={`/blog/${blog.id}`}>
                  <div className="cursor-pointer">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.caption || 'Blog image'}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover hover:opacity-95 transition-opacity"
                    />
                  </div>
                </Link>

                {/* Likes & Comment count */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">👍</span>
                      <span>{blog._count.likes} lượt thích</span>
                    </div>
                    <div>
                      <span>{blog._count.comments} bình luận</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col border-t border-gray-200 pt-2 -mx-2">
                    <div className="flex items-center">
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

                      <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 rounded-lg flex-1 justify-center transition-colors">
                        <span className="text-gray-600">📤</span>
                        <span className="text-gray-600 font-medium">Chia sẻ</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
