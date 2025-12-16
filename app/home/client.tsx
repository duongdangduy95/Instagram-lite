'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import LikeButton from '@/app/components/LikeButton'
import CommentToggle from '../components/CommentToggle'
import Navigation from '../components/Navigation'

interface Blog {
  id: string
  caption: string
  imageUrl: string
  createdAt: string
  author: {
    id: string
    fullname: string
  }
  _count: {
    likes: number
    comments: number
  }
}

export default function HomePageClient() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [currentUser, setCurrentUser] = useState<{ id: string; fullname: string; username: string } | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [userRes, blogsRes] = await Promise.all([
        fetch('/api/me', { credentials: 'include' }),
        fetch('/api/blog', { credentials: 'include' })
      ])

      if (userRes.ok) {
        const userData = await userRes.json()
        setCurrentUser(userData)
      }

      if (blogsRes.ok) {
        const blogsData = await blogsRes.json()
        setBlogs(blogsData)
      }
    } catch (_error) {
      // Error fetching data finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Refetch data when page regains focus
  useEffect(() => {
    const handleFocus = () => {
      fetchData()
    }

    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  // Polling mỗi 10 giây
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData()
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Navigation />
        <main className="max-w-2xl mx-auto p-4 pt-6">
          <div className="text-center">Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />

      <main className="max-w-2xl mx-auto p-4 pt-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">News Feed</h1>

        <div className="space-y-4">
          {blogs.map((blog) => {
            if (!blog?.id || !blog?.author) return null

            const isCurrentUser = blog.author.id === currentUser?.id
            const profileLink = isCurrentUser
              ? '/profile'
              : `/profile/${blog.author.id}`

            return (
              <div
                key={blog.id}
                className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow overflow-hidden"
              >
                {/* Header */}
                <div className="px-4 py-3 border-b border-gray-100">
                  <Link href={profileLink}>
                    <div className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold text-lg">
                          {blog.author.fullname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm hover:underline">
                          {blog.author.fullname}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatTimeAgo(new Date(blog.createdAt))}
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Image */}
                {blog.imageUrl && (
                  <Link href={`/blog/${blog.id}`}>
                    <div className="relative w-full bg-gray-200 cursor-pointer group overflow-hidden max-h-96">
                      <img
                        src={blog.imageUrl}
                        alt={blog.caption}
                        className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </Link>
                )}

                {/* Caption */}
                <div className="px-4 py-3">
                  <p className="text-gray-900 text-sm leading-relaxed line-clamp-3">{blog.caption}</p>
                </div>

                {/* Likes & Comments Count */}
                <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-600 flex justify-between">
                  <span>👍 <span className="font-medium">{blog._count.likes}</span> lượt thích</span>
                  <span>💬 <span className="font-medium">{blog._count.comments}</span> bình luận</span>
                </div>

                {/* Actions */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between gap-2">
                  <div className="flex-1">
                    <LikeButton
                      blogId={blog.id}
                      initialCount={blog._count.likes}
                      onLikeChange={(newCount) => {
                        setBlogs(blogs.map(b =>
                          b.id === blog.id
                            ? { ...b, _count: { ...b._count, likes: newCount } }
                            : b
                        ))
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <CommentToggle 
                      blogId={blog.id} 
                      currentUser={currentUser ? {
                        id: currentUser.id,
                        fullname: currentUser.fullname,
                        username: currentUser.username
                      } : null}
                    />
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
