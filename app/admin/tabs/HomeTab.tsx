'use client'

import { useEffect, useState } from "react"
import AdminBlogFeed from "../AdminBlogFeed"

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

export default function HomeTab() {
  const [blogs, setBlogs] = useState<BlogDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)

  const loadBlogs = async (nextCursor: string | null = null) => {
    try {
      const url = nextCursor 
        ? `/api/home?cursor=${nextCursor}`
        : '/api/home'
      const res = await fetch(url)
      if (!res.ok) return
      
      const data = await res.json()
      if (Array.isArray(data)) {
        if (nextCursor) {
          setBlogs(prev => [...prev, ...data])
        } else {
          setBlogs(data)
        }
        // Nếu lấy được ít hơn PAGE_SIZE thì không còn page tiếp theo
        setHasMore(data.length >= 3)
        if (data.length > 0) {
          setCursor(data[data.length - 1].id)
        }
      }
    } catch (e) {
      console.error("Home feed fetch failed", e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadBlogs()
  }, [])

  const loadMore = () => {
    if (!loading && hasMore && cursor) {
      setLoading(true)
      loadBlogs(cursor)
    }
  }

  if (loading && blogs.length === 0) {
    return <div className="text-gray-400">Đang tải...</div>
  }

  if (blogs.length === 0) {
    return <div className="text-gray-400">Chưa có bài viết nào</div>
  }

  const handleBlogDeleted = (deletedBlogId: string) => {
    // Optimistic update: Xóa bài khỏi local state ngay lập tức
    // Xóa cả bài share (nếu sharedFrom.id = deletedBlogId) và bài thường (nếu id = deletedBlogId)
    setBlogs(prev => prev.filter(b => {
      // Xóa nếu chính nó bị xóa hoặc bài gốc của nó (sharedFrom) bị xóa
      return b.id !== deletedBlogId && b.sharedFrom?.id !== deletedBlogId
    }))
    setCursor(null)
    // Reload lại từ server sau một chút để đảm bảo cache đã được invalidate
    setTimeout(() => {
      setLoading(true)
      loadBlogs()
    }, 200)
  }

  return (
    <div className="space-y-4">
      <AdminBlogFeed blogs={blogs} onBlogDeleted={handleBlogDeleted} />
      
      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center py-4">
          <button
            onClick={loadMore}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 disabled:opacity-50 transition-colors"
          >
            {loading ? 'Đang tải...' : 'Tải thêm'}
          </button>
        </div>
      )}
      
      {!hasMore && blogs.length > 0 && (
        <div className="text-center py-4 text-gray-400 text-sm">
          Đã hết bài viết
        </div>
      )}
    </div>
  )
}
