'use client'

import Link from 'next/link'
import Image from 'next/image'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogImages from '../components/BlogImages'
import AdminBlogActions from './AdminBlogActions'
import ExpandableCaption from '../components/ExpandableCaption'

type BlogDTO = {
  id: string
  caption: string
  imageUrls: string[]
  music?: any
  createdAt: string
  author: {
    id: string
    fullname: string | null
    username: string | null
    image: string | null
  }
  sharedFrom?: {
    id: string
    caption: string
    imageUrls: string[]
    music?: any
    createdAt: string
    author: {
      id: string
      fullname: string | null
      username: string | null
      image: string | null
    }
    isdeleted?: boolean
  } | null
  _count: {
    likes: number
    comments: number
  }
}

export default function AdminBlogFeed({ blogs, onBlogDeleted }: { blogs: BlogDTO[], onBlogDeleted?: (blogId: string) => void }) {
  return (
    <>
      {blogs.map((blog) => {
        const isShared = !!blog.sharedFrom
        const displayBlog = blog.sharedFrom ?? blog
        const isOriginalMissing = !!blog.sharedFrom && blog.sharedFrom.isdeleted === true

        return (
          <div key={blog.id} className="bg-[#11151B] border border-gray-800 rounded-xl overflow-hidden mb-4" suppressHydrationWarning>
            {/* ===== SHARE POST ===== */}
            {isShared ? (
              <>
                {/* HEADER (NGƯỜI CHIA SẺ) */}
                <div className="px-4 py-3 flex items-center">
                  <Link href={`/profile/${blog.author.id}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {blog.author.image ? (
                          <Image src={blog.author.image} alt={blog.author.username || ''} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <span className="font-bold text-white">
                            {(blog.author.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          {blog.author.username}{' '}
                          <span className="font-normal text-gray-400">đã chia sẻ</span>
                        </p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(new Date(blog.createdAt))}</p>
                      </div>
                    </div>
                  </Link>
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
                        <Link href={`/admin/blog/${displayBlog.id}`} className="block">
                          <div className="bg-gray-900">
                            <BlogImages imageUrls={displayBlog.imageUrls} music={displayBlog.music ?? null} musicKey={displayBlog.id} />
                          </div>
                        </Link>

                        {/* TÊN + CAPTION GỐC ĐỂ DƯỚI */}
                        <div className="px-4 py-3 border-t border-gray-800">
                          {displayBlog.author && (
                            <Link href={`/profile/${displayBlog.author.id}`} className="block">
                              <div className="flex items-center space-x-3">
                                <div className="w-9 h-9 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                                  {displayBlog.author.image ? (
                                    <Image src={displayBlog.author.image} alt={displayBlog.author.username || ''} width={36} height={36} className="object-cover w-full h-full" />
                                  ) : (
                                    <span className="font-bold text-white">
                                      {(displayBlog.author.username || 'U').charAt(0).toUpperCase()}
                                    </span>
                                  )}
                                </div>
                                <div>
                                  <p className="font-semibold text-white">{displayBlog.author.username}</p>
                                  <p className="text-xs text-gray-400">{formatTimeAgo(new Date(displayBlog.createdAt))}</p>
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
                <div className="px-4 py-3 flex items-center">
                  <Link href={`/profile/${displayBlog.author.id}`}>
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                        {displayBlog.author.image ? (
                          <Image src={displayBlog.author.image} alt={displayBlog.author.username || ''} width={40} height={40} className="object-cover w-full h-full" />
                        ) : (
                          <span className="font-bold text-white">
                            {(displayBlog.author.username || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-white">{displayBlog.author.username}</p>
                        <p className="text-xs text-gray-400">{formatTimeAgo(new Date(displayBlog.createdAt))}</p>
                      </div>
                    </div>
                  </Link>
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

            {/* ACTIONS - Chỉ có comment và delete */}
            <AdminBlogActions
              blogId={blog.id}
              displayBlogId={displayBlog.id}
              initialCommentCount={blog._count.comments}
              onBlogDeleted={onBlogDeleted}
            />
          </div>
        )
      })}
    </>
  )
}
