
'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogActions from './BlogActions'
import BlogImages from './BlogImages'
import FollowButton from './FollowButton'
import ExpandableCaption from './ExpandableCaption'
import type { BlogDTO, CurrentUserSafe } from '@/types/dto'

export default function BlogFeed({
  blogs,
  currentUser,
  followMap,
  onFollowChange,
}: {
  blogs: BlogDTO[]
  currentUser: CurrentUserSafe
  followMap?: Record<string, boolean>
  onFollowChange?: (targetUserId: string, isFollowing: boolean, followersCount?: number) => void
}) {
  // Debug: Log music data từ blogs
  useEffect(() => {
    blogs.forEach((blog) => {
      if (blog.music || blog.sharedFrom?.music) {
        console.log('[BlogFeed] Blog music data:', {
          blogId: blog.id,
          hasMusic: !!blog.music,
          hasSharedFromMusic: !!blog.sharedFrom?.music,
          music: blog.music,
          sharedFromMusic: blog.sharedFrom?.music,
          displayBlog: blog.sharedFrom ?? blog
        })
      }
    })
  }, [blogs])

  return (
    <>
      {blogs.map((blog) => {
        const isShared = !!blog.sharedFrom
        const displayBlog = blog.sharedFrom ?? blog
        const isOriginalMissing = !!blog.sharedFrom && blog.sharedFrom.isdeleted === true
        const actionDisplayBlogId = isOriginalMissing ? blog.id : displayBlog.id
        const isCurrentUser = blog.author.id === currentUser?.id
        // Trạng thái like của current user: ưu tiên field `liked` từ API
        const isLiked = (blog as any).liked ?? false

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
            : ((isShared ? blog.author : displayBlog.author).followers?.length ?? 0) > 0

        return (
          <div key={blog.id} className="bg-[#0B0E11] text-gray-100" suppressHydrationWarning>

            {/* ===== SHARE POST ===== */}
            {isShared ? (
              <>
                {/* HEADER (NGƯỜI CHIA SẺ) */}
                <div className="px-4 py-3 flex justify-between items-center">
                  <Link href={sharerProfileHref}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {blog.author.image ? (
                          <Image src={blog.author.image} alt={blog.author.username} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <span className="font-bold">{blog.author.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">
                          {blog.author.username}{' '}
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
                {blog.caption && (
                  <div className="px-4 pb-3 text-gray-200">
                    <ExpandableCaption text={blog.caption} initialLines={1} />
                  </div>
                )}

                {/* CARD BÀI GỐC */}
                <div className="px-4 pb-4">
                  <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/40">
                    {isOriginalMissing ? (
                      <div className="p-6 text-center text-gray-300">
                        <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-gray-800 flex items-center justify-center">
                          <span className="text-xl">⛔</span>
                        </div>
                        <p className="font-semibold text-gray-100">Bài viết này không còn tồn tại</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Bài gốc đã bị xoá bởi người dùng hoặc quản trị viên.
                        </p>
                      </div>
                    ) : (
                      <>
                        {/* MEDIA TRƯỚC */}
                        <Link href={`/blog/${displayBlog.id}`} className="block">
                          <div className="bg-gray-900">
                            <BlogImages imageUrls={displayBlog.imageUrls} music={displayBlog.music ?? null} musicKey={displayBlog.id} />
                          </div>
                        </Link>

                        {/* TÊN + CAPTION GỐC ĐỂ DƯỚI */}
                        <div className="px-4 py-3 border-t border-gray-800">
                          {displayBlog.author && (
                            <Link href={originalAuthorProfileHref} className="block">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                  {displayBlog.author.image ? (
                                    <Image src={displayBlog.author.image} alt={displayBlog.author.username} width={36} height={36} className="object-cover w-full h-full" />
                                  ) : (
                                    <span className="font-bold">{displayBlog.author.username.charAt(0).toUpperCase()}</span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold">{displayBlog.author.username}</p>
                                  <p className="text-xs text-gray-400">{formatTimeAgo(displayBlog.createdAt)}</p>
                                </div>
                              </div>
                            </Link>
                          )}

                          {displayBlog.caption && (
                            <div className="pt-2 text-gray-200">
                              <ExpandableCaption text={displayBlog.caption} initialLines={1} />
                            </div>
                          )}
                        </div>
                      </>
                    )}
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
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {displayBlog.author.image ? (
                          <Image src={displayBlog.author.image} alt={displayBlog.author.username} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <span className="font-bold">{displayBlog.author.username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold">{displayBlog.author.username}</p>
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

                {displayBlog.caption && (
                  <div className="px-4 pb-2 text-gray-200">
                    <ExpandableCaption text={displayBlog.caption} initialLines={1} />
                  </div>
                )}

                <div className="px-4 pb-4">
                  <div className="rounded-lg overflow-hidden bg-gray-900">
                    <BlogImages imageUrls={displayBlog.imageUrls} music={displayBlog.music ?? null} musicKey={displayBlog.id} />
                  </div>
                </div>
              </>
            )}

            {/* ACTIONS */}
            <BlogActions
              blogId={blog.id}
              displayBlogId={actionDisplayBlogId}
              initialLikeCount={blog._count.likes}
              initialCommentCount={blog._count.comments}
              initialLiked={isLiked}
              initialSaved={!!blog.isSaved}
              currentUser={currentUser}
            />
          </div>
        )
      })}
    </>
  )
}
