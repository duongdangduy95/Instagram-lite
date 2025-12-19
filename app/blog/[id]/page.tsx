'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Navigation from '@/app/components/Navigation'
import BlogImages from '@/app/components/BlogImages'
import BlogActions from '@/app/components/BlogActions'
import FollowButton from '@/app/components/FollowButton'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { useSession } from 'next-auth/react'

interface Blog {
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
  sharedFrom?: {
    id: string
    caption?: string
    imageUrls: string[]
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
  const { data: session } = useSession()
  const blogId = params.id as string

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<{
    id: string
    fullname: string
    username: string
  } | null>(null)

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

    const fetchCurrentUser = async () => {
      if (session?.user?.id) {
        try {
          const res = await fetch('/api/me/basic', { credentials: 'include' })
          if (res.ok) {
            const userData = await res.json()
            setCurrentUser({
              id: session.user.id as string,
              fullname: userData.fullname,
              username: userData.username,
            })
          }
        } catch (error) {
          console.error('Error fetching user:', error)
        }
      }
    }

    if (blogId) {
      fetchBlog()
      fetchCurrentUser()
    }
  }, [blogId, session, router])

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
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="ml-64 min-h-screen">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Back button */}
          <div className="mb-4">
            <button
              onClick={() => router.back()}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </button>
          </div>

          <div className="bg-black border border-gray-800 rounded-lg overflow-hidden">
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

              {!isCurrentUser && currentUser && (
                <FollowButton
                  targetUserId={displayBlog.author.id}
                  initialIsFollowing={false}
                />
              )}
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
                {blog.caption}
              </div>
            )}

            {/* Original caption */}
            {displayBlog.caption && (
              <div className="px-4 pt-4 pb-2 text-gray-200">
                {displayBlog.caption}
              </div>
            )}

            {/* Hashtags */}
            {displayBlog.hashtags && displayBlog.hashtags.length > 0 && (
              <div className="px-4 pb-2 flex flex-wrap gap-2">
                {displayBlog.hashtags.map((tag, index) => (
                  <span key={index} className="text-blue-500 text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Images */}
            <div className="px-4 pb-4">
              <div className="rounded-lg overflow-hidden bg-gray-900">
                <BlogImages imageUrls={displayBlog.imageUrls} blogId={displayBlog.id} />
              </div>
            </div>

            {/* Actions */}
            <BlogActions
              blogId={blog.id}
              displayBlogId={displayBlog.id}
              initialLikeCount={blog._count.likes}
              initialCommentCount={blog._count.comments}
              initialLiked={isLiked}
              currentUser={currentUser}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

