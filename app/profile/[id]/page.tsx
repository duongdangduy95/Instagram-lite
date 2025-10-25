// app/profile/[id]/page.tsx
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { notFound } from "next/navigation"
import Link from "next/link"
import LikeButton from "../../components/LikeButton"; // nếu dùng từ file nằm trong app/


export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const user = await prisma.user.findUnique({
    where: { id },
    include: { 
      blogs: true
    },
  })

  if (!user) return notFound()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
                {user.fullname.charAt(0).toUpperCase()}
              </div>
            </div>
            
            {/* User Info */}
            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {user.fullname}
              </h1>
              <p className="text-xl text-gray-600 mb-4">@{user.username}</p>
              
              <div className="flex flex-col sm:flex-row gap-4 text-sm text-gray-500">
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Tham gia: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{user.blogs.length} bài viết</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Bài viết đã đăng</h2>
          <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
        </div>

        {/* Blog Posts */}
        {user.blogs.length > 0 ? (
          <div className="space-y-6">
            {user.blogs.map((blog) => (
              <div key={blog.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Post Header */}
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-sm font-semibold">
                      {user.fullname.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{user.fullname}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('vi-VN')} • 
                        <time className="ml-1" dateTime={blog.createdAt.toISOString()}>
                          {new Date(blog.createdAt).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </time>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="p-4">
                  <p className="text-gray-900 text-base leading-relaxed mb-4">
                    {blog.caption}
                  </p>
                  
                  {/* Post Image */}
                  {blog.imageUrl && (
                    <div className="relative w-full rounded-lg overflow-hidden bg-gray-100">
                      <Image
                        src={blog.imageUrl}
                        alt="Post image"
                        width={600}
                        height={400}
                        className="w-full h-auto object-cover"
                        priority={false}
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">👍</span>
                      <span>0</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>0 bình luận</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-around border-t pt-2">
                    <LikeButton 
                      blogId={blog.id}
                      initialLiked={false}
                      initialCount={0}
                    />
                    <Link
                      href={`/blog/${blog.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center"
                    >
                      <span className="text-gray-600">💬</span>
                      <span className="text-gray-600 font-medium">Bình luận</span>
                    </Link>
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center">
                      <span className="text-gray-600">📤</span>
                      <span className="text-gray-600 font-medium">Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Chưa có bài viết nào</h3>
            <p className="text-gray-600">Người dùng này chưa đăng bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  )
}