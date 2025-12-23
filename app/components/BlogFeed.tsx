
'use client'

import Link from 'next/link'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogActions from './BlogActions'
import BlogImages from './BlogImages'
import FollowButton from './FollowButton'

export default function BlogFeed({
  blogs,
  currentUser,
  followMap,
  onFollowChange,
}: {
  blogs: any[]
  currentUser: any
  followMap?: Record<string, boolean>
  onFollowChange?: (targetUserId: string, isFollowing: boolean, followersCount?: number) => void
}) {
  return (
    <>
      {blogs.map((blog) => {
        const isShared = !!blog.sharedFrom
        const displayBlog = blog.sharedFrom ?? blog
        const isCurrentUser = blog.author.id === currentUser?.id
        const isLiked = (blog.likes?.length ?? 0) > 0

        const sharerProfileHref =
          blog.author.id === currentUser?.id ? '/profile' : `/profile/${blog.author.id}`

        const originalAuthorProfileHref =
          displayBlog.author?.id === currentUser?.id
            ? '/profile'
            : `/profile/${displayBlog.author?.id}`

        // Follow target:
        // - Share: blog.author (người chia sẻ)
        // - Normal: displayBlog.author (tác giả bài)
        const followTargetUserId = isShared ? blog.author.id : displayBlog.author.id
        const initialIsFollowing =
          typeof followMap?.[followTargetUserId] === 'boolean'
            ? followMap![followTargetUserId]
            : (blog.author.followers?.length ?? 0) > 0

        return (
          <div key={blog.id} className="bg-black text-gray-100">

            {/* ===== SHARE POST ===== */}
            {isShared ? (
              <>
                {/* HEADER (NGƯỜI CHIA SẺ) */}
                <div className="px-4 py-3 flex justify-between items-center">
                  <Link href={sharerProfileHref}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="font-bold">{blog.author.fullname.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {blog.author.fullname}{' '}
                          <span className="font-normal text-gray-400">đã chia sẻ</span>
                        </p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(blog.createdAt)}</p>
                      </div>
                    </div>
                  </Link>

                  {!isCurrentUser && currentUser && (
                    <FollowButton
                      targetUserId={blog.author.id}
                      initialIsFollowing={initialIsFollowing}
                      size="sm"
                      onFollowChange={(isFollowing, followersCount) =>
                        onFollowChange?.(blog.author.id, isFollowing, followersCount)
                      }
                    />
                  )}
                </div>

                {/* CAPTION NGƯỜI CHIA SẺ */}
                {blog.caption && <div className="px-4 pb-3 text-gray-200">{blog.caption}</div>}

                {/* CARD BÀI GỐC */}
                <div className="px-4 pb-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/40">
                    {/* MEDIA TRƯỚC */}
                    <Link href={`/blog/${displayBlog.id}`} className="block">
                      <div className="bg-gray-900">
                        <BlogImages imageUrls={displayBlog.imageUrls} blogId={displayBlog.id} />
                      </div>
                    </Link>

                    {/* TÊN + CAPTION GỐC ĐỂ DƯỚI */}
                    <div className="px-4 py-3 border-t border-gray-800">
                      {displayBlog.author && (
                        <Link href={originalAuthorProfileHref} className="block">
                          <div className="flex items-center space-x-3">
                            <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center">
                              <span className="font-bold">{displayBlog.author.fullname.charAt(0)}</span>
                            </div>
                            <div>
                              <p className="font-semibold">{displayBlog.author.fullname}</p>
                              <p className="text-xs text-gray-400">{formatTimeAgo(displayBlog.createdAt)}</p>
                            </div>
                          </div>
                        </Link>
                      )}

                      {displayBlog.caption && (
                        <div className="pt-2 text-gray-200">{displayBlog.caption}</div>
                      )}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* ===== NORMAL POST ===== */}
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
                        <span className="font-bold">{displayBlog.author.fullname.charAt(0)}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{displayBlog.author.fullname}</p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(displayBlog.createdAt)}</p>
                      </div>
                    </div>
                  </Link>

                  {!isCurrentUser && currentUser && (
                    <FollowButton
                      targetUserId={displayBlog.author.id}
                      initialIsFollowing={initialIsFollowing}
                      size="sm"
                      onFollowChange={(isFollowing, followersCount) =>
                        onFollowChange?.(displayBlog.author.id, isFollowing, followersCount)
                      }
                    />
                  )}
                </div>

                {displayBlog.caption && <div className="px-4 pb-2 text-gray-200">{displayBlog.caption}</div>}

                <div className="px-4 pb-4">
                  <div className="rounded-lg overflow-hidden bg-gray-900">
                    <BlogImages imageUrls={displayBlog.imageUrls} blogId={displayBlog.id} />
                  </div>
                </div>
              </>
            )}

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
