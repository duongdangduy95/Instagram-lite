'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface LikeButtonProps {
  blogId: string
  initialLiked?: boolean
  initialCount?: number
}

export default function LikeButton({ blogId, initialLiked = false, initialCount = 0 }: LikeButtonProps) {
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
          console.log('Không có session, chuyển hướng đến /login')
          setAuthenticated(false)
          return
        }

        const data = await res.json()
        console.log('User session found:', data)
        setAuthenticated(true)
      } catch (err) {
        console.error('Lỗi kiểm tra session:', err)
        setAuthenticated(false)
      }
    }

    checkSession()
  }, [])

  const handleLike = async () => {
    if (authenticated === null) {
      console.log('Đang kiểm tra session...')
      return
    }

    if (!authenticated) {
      console.log('Không có session, chuyển hướng đến /login')
      router.push('/login')
      return
    }

    setLoading(true)

    try {
      console.log('Sending like request for blog:', blogId)

      const response = await fetch(`/api/blog/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Server error:', errorData)
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      console.log('Like response:', data)

      setLiked(data.liked)
      setLikeCount(prev => data.liked ? prev + 1 : prev - 1)
    } catch (error) {
      console.error('Like error:', error)
      if (error instanceof Error && error.message.includes('401')) {
        console.log('Session invalid, redirecting to login')
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
