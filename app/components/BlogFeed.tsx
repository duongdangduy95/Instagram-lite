import Link from 'next/link'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogActions from './BlogActions'
import BlogImages from './BlogImages'
import FollowButton from './FollowButton'

export default function BlogFeed({
  blogs,
  currentUser,
}: {
  blogs: any[]
  currentUser: any
}) {
  return (
    <>
      {blogs.map((blog) => {
        const isShared = !!blog.sharedFrom
        const displayBlog = blog.sharedFrom ?? blog
        const isCurrentUser = blog.author.id === currentUser?.id
        const isFollowing = (blog.author.followers?.length ?? 0) > 0
        const isLiked = (blog.likes?.length ?? 0) > 0

        return (
          <div key={blog.id} className="bg-black text-gray-100">

            {/* NGƯỜI SHARE */}
            {isShared && (
              <div className="px-4 pt-4 text-sm text-gray-300">
                <span className="font-semibold">
                  {blog.author.fullname}
                </span>{' '}
                đã chia sẻ
              </div>
            )}

            {/* HEADER */}
            <div className="px-4 py-3 flex justify-between items-center">
              <Link
                href={
                  displayBlog.author.id === currentUser?.id
                    ? '/profile'
                    : `/profile/${displayBlog.author.id}`
                }
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                    <span className="font-bold">
                      {displayBlog.author.fullname.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold">
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

            {/* CAPTION SHARE */}
            {isShared && blog.caption && (
              <div className="px-4 pb-2 text-gray-200">
                {blog.caption}
              </div>
            )}

            {/* CAPTION GỐC */}
            {displayBlog.caption && (
              <div className="px-4 pb-2 text-gray-200">
                {displayBlog.caption}
              </div>
            )}

            {/* IMAGES */}
            <div className="px-4 pb-4">
              <div className="rounded-lg overflow-hidden bg-gray-900">
                <BlogImages
                  imageUrls={displayBlog.imageUrls}
                  blogId={displayBlog.id}
                />
              </div>
            </div>

            {/* ACTIONS */}
            <BlogActions
              blogId={blog.id}
              displayBlogId={displayBlog.id}
              initialLikeCount={blog._count.likes}
              initialCommentCount={blog._count.comments}
              initialLiked={isLiked}
              currentUser={currentUser}
            />
          </div>
        )
      })}
    </>
  )
}
