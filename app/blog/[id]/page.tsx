'use client'

import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import BlogImages from '@/app/components/BlogImages'
import BlogActions from '@/app/components/BlogActions'
import FollowButton from '@/app/components/FollowButton'
import ExpandableCaption from '@/app/components/ExpandableCaption'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'

interface Blog {
  id: string
  caption?: string
  imageUrls: string[]
  hashtags: string[]
  createdAt: string
  isSaved?: boolean
  author: {
    id: string
    fullname: string
    username: string
  }
  sharedFrom?: {
    id: string
    caption?: string
    imageUrls: string[]
    hashtags: string[]
    createdAt: string
    author: {
      id: string
      fullname: string
      username: string
    }
    _count: {
      likes: number
      comments: number
    }
  }
  likes?: Array<{ userId: string }>
  _count: {
    likes: number
    comments: number
  }
}

export default function BlogDetailPage() {
  const params = useParams()
  const router = useRouter()
  const blogId = params.id as string

  const [showOptions, setShowOptions] = useState(false)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const { user: currentUser } = useCurrentUser()

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await fetch(`/api/blog/${blogId}`)
        if (res.status === 404) {
          router.push('/home')
          return
        }
        if (!res.ok) {
          throw new Error('Failed to fetch blog')
        }
        const data = await res.json()
        setBlog(data)
      } catch (error) {
        console.error('Error fetching blog:', error)
      } finally {
        setLoading(false)
      }
    }

    if (blogId) {
      fetchBlog()
    }
  }, [blogId, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black">
        <Navigation />
        <div className="ml-64 min-h-screen flex items-center justify-center">
          <div className="text-white text-xl">Bài viết không tồn tại</div>
        </div>
      </div>
    )
  }

  const isShared = !!blog.sharedFrom
  const displayBlog = blog.sharedFrom ?? blog
  const isCurrentUser = blog.author.id === currentUser?.id
  const isLiked = (blog.likes?.length ?? 0) > 0

  return (
    <div className="min-h-screen bg-[#0B0E11]">
      <Navigation />

      <div className="ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={() => router.push('/home')}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
          </div>

          <div className="bg-[#0B0E11] border border-gray-800 rounded-lg overflow-hidden">
            {/* Header */}
            <div className="px-4 py-3 flex justify-between items-center border-b border-gray-800">
              <Link
                href={displayBlog.author.id === currentUser?.id ? '/profile' : `/profile/${displayBlog.author.id}`}
                prefetch={true}
                className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
              >
                <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                  <span className="font-bold text-white">
                    {displayBlog.author.fullname.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-gray-100">
                    {displayBlog.author.fullname}
                  </p>
                  <p className="text-xs text-gray-400">
                    {formatTimeAgo(new Date(displayBlog.createdAt))}
                  </p>
                </div>
              </Link>

              {/* Right: Actions */}
              <div className="flex items-center gap-2">
                {!isCurrentUser && currentUser && (
                  <FollowButton
                    targetUserId={displayBlog.author.id}
                    initialIsFollowing={false}
                  />
                )}

                {isCurrentUser && (
                  <div className="relative" ref={optionsRef}>
                    <button
                      onClick={() => setShowOptions(!showOptions)}
                      className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                    >
                      {/* 3 dots horizontal */}
                      <svg
                        className="w-5 h-5 text-gray-300"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <circle cx="4" cy="10" r="1.5" />
                        <circle cx="10" cy="10" r="1.5" />
                        <circle cx="16" cy="10" r="1.5" />
                      </svg>
                    </button>

                    {showOptions && (
                      <div className="absolute right-0 mt-2 w-40 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-50">
                        <button
                          onClick={() => {
                            setShowOptions(false)
                            router.push(`/blog/${blog.id}/edit`)
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800"
                        >
                          Chỉnh sửa
                        </button>

                        <button
                          onClick={async () => {
                            setShowOptions(false)
                            const confirmDelete = confirm('Bạn có chắc muốn xóa bài viết này không?')
                            if (!confirmDelete) return

                            await fetch(`/api/blog/${blog.id}`, { method: 'DELETE' })
                            router.back()
                          }}
                          className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10"
                        >
                          Xóa bài viết
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Share notification */}
            {isShared && (
              <div className="px-4 pt-4 text-sm text-gray-300 border-b border-gray-800 pb-2">
                <span className="font-semibold">{blog.author.fullname}</span> đã chia sẻ
              </div>
            )}

            {/* Share caption */}
            {isShared && blog.caption && (
              <div className="px-4 pt-3 pb-2 text-gray-200 border-b border-gray-800">
                <ExpandableCaption text={blog.caption} initialLines={3} />
              </div>
            )}

            {/* Original caption */}
            {displayBlog.caption && (
              <div className="px-4 pt-4 pb-2 text-gray-200">
                <ExpandableCaption text={displayBlog.caption} initialLines={10} />
              </div>
            )}

            {/* Hashtags */}
            {displayBlog.hashtags && displayBlog.hashtags.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {displayBlog.hashtags.map((tag, index) => (
                  <span key={index} className="text-[#7565E6] text-sm font-medium">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Images */}
            <div className="px-4 pb-4">
              <div className="rounded-lg overflow-hidden bg-gray-900">
                <BlogImages imageUrls={displayBlog.imageUrls} />
              </div>
            </div>

            {/* Actions */}
            <BlogActions
              blogId={blog.id}
              displayBlogId={displayBlog.id}
              initialLikeCount={blog._count.likes}
              initialCommentCount={blog._count.comments}
              initialLiked={isLiked}
              initialSaved={!!blog.isSaved}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

