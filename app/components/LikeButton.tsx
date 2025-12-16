'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  blogId: string
  initialLiked?: boolean
  initialCount?: number
  userId?: string | null
  onLikeChange?: (newCount: number) => void
  onRefetch?: () => void
}

export default function LikeButton({ 
  blogId, 
  initialLiked = false, 
  initialCount = 0,
  userId,
  onLikeChange,
  onRefetch
}: LikeButtonProps) {
  const router = useRouter()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  // ✅ Kiểm tra session bằng cách gọi API /api/me
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include',
        })

        if (!res.ok) {
          setAuthenticated(false)
          return
        }

        const data = await res.json()
        setAuthenticated(true)
      } catch (err) {
        setAuthenticated(false)
      }
    }

    checkSession()
  }, [])

  const handleLike = async () => {
    if (authenticated === null) {
      return
    }

    if (!authenticated) {
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/blog/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      setLiked(data.liked)
      const newCount = data.liked ? likeCount + 1 : likeCount - 1
      setLikeCount(newCount)
      
      // Gọi callback để update parent component
      if (onLikeChange) {
        onLikeChange(newCount)
      }

      // Refetch data để sync với server
      if (onRefetch) {
        setTimeout(onRefetch, 100)
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes('401')) {
        router.push('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading || authenticated === null}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
        loading || authenticated === null
          ? 'opacity-50 cursor-not-allowed'
          : 'hover:bg-gray-100'
      }`}
    >
      <span className={liked ? 'text-blue-500' : 'text-gray-600'}>
        👍
      </span>
      <span className={`font-medium ${liked ? 'text-blue-600' : 'text-gray-600'}`}>
        {loading ? 'Đang xử lý...' : liked ? 'Đã thích' : 'Thích'}
      </span>
      {likeCount > 0 && (
        <span className="text-sm text-gray-500">({likeCount})</span>
      )}
    </button>
  )
}
