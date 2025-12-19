'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'

interface LikeButtonProps {
  blogId: string
  initialLiked?: boolean
  initialCount?: number
  onLikeChange?: (newCount: number) => void
}

export default function LikeButton({ 
  blogId, 
  initialLiked = false, 
  initialCount = 0,
  onLikeChange
}: LikeButtonProps) {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [loading, setLoading] = useState(false)
  
  // Sử dụng session từ next-auth thay vì gọi API
  const authenticated = status === 'authenticated'

  const handleLike = async () => {
    if (status === 'loading') {
      return // Đang kiểm tra session
    }

    if (!authenticated) {
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
      const newCount = data.liked ? likeCount + 1 : likeCount - 1
      setLikeCount(newCount)
      
      // Gọi callback để update parent component
      if (onLikeChange) {
        onLikeChange(newCount)
      }
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
      disabled={loading || status === 'loading'}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors flex-1 justify-center ${
        loading || status === 'loading'
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
    </button>
  )
}