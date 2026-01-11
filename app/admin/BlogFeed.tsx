'use client'
import Link from 'next/link'
import Image from 'next/image'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogActions from '../components/BlogActions'
import BlogImages from '../components/BlogImages'
import ExpandableCaption from '../components/ExpandableCaption'
import type { BlogDTO, CurrentUserSafe } from '@/types/dto'

export default function BlogFeed({
  blogs,
  currentUser,
  isAdmin = false,
}: {
  blogs: BlogDTO[]
  currentUser: CurrentUserSafe
  isAdmin?: boolean
}) {
  return (
    <>
      {blogs.map((blog) => (
        <div key={blog.id} className="bg-[#0B0E11] text-gray-100 rounded-xl overflow-hidden">
          {/* HEADER */}
          <div className="px-4 py-3 flex justify-between items-center">
            <Link href={`/profile/${blog.author.id}`}>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gray-700 rounded-full overflow-hidden flex items-center justify-center">
                  {blog.author.image ? (
                    <Image src={blog.author.image} alt={blog.author.username} width={40} height={40} className="object-cover w-full h-full" />
                  ) : (
                    <span className="font-bold">{blog.author.username.charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div>
                  <p className="font-semibold">{blog.author.username}</p>
                  <p className="text-xs text-gray-400">{formatTimeAgo(blog.createdAt)}</p>
                </div>
              </div>
            </Link>

            {/* Nếu không phải admin, có thể thêm follow */}
          </div>

          {/* CAPTION */}
          {blog.caption && (
            <div className="px-4 py-2 text-gray-200">
              <ExpandableCaption text={blog.caption} initialLines={1} />
            </div>
          )}

          {/* IMAGE */}
          <div className="px-4 pb-4">
            <div className="rounded-lg overflow-hidden bg-gray-900">
              <BlogImages imageUrls={blog.imageUrls} />
            </div>
          </div>

          {/* ACTIONS */}
          <BlogActions
            blogId={blog.id}
            displayBlogId={blog.id}
            initialLikeCount={blog._count.likes}
            initialCommentCount={blog._count.comments}
            initialLiked={false}
            initialSaved={false}
            currentUser={currentUser}
            isAdmin={isAdmin} // cho phép admin xóa bài
          />
        </div>
      ))}
    </>
  )
}
