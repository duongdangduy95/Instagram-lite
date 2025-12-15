'use client'

import { useState } from 'react'

interface FollowButtonInlineProps {
  targetUserId: string
  currentUserId: string | null
  initialIsFollowing: boolean
  isOwnProfile?: boolean
}

export default function FollowButtonInline({ 
  targetUserId, 
  currentUserId,
  initialIsFollowing,
  isOwnProfile = false
}: FollowButtonInlineProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  // Không hiển thị nút nếu chưa đăng nhập hoặc là profile của chính mình
  if (!currentUserId || isOwnProfile) {
    return null
  }

  const handleFollow = async (e: React.MouseEvent) => {
    e.preventDefault() // Ngăn link redirect
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      const response = await fetch(`/api/follow/${targetUserId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        setIsFollowing(!isFollowing)
      } else {
        alert('Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Có lỗi xảy ra')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <button
      onClick={handleFollow}
      disabled={isLoading}
      className={`ml-auto px-3 py-1 rounded-full text-sm font-medium transition-all disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isLoading ? (
        <span className="flex items-center space-x-1">
          <svg className="animate-spin h-3 w-3" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
          </svg>
        </span>
      ) : isFollowing ? (
        <span className="flex items-center space-x-1">
          <span>✓</span>
          <span>Đang theo dõi</span>
        </span>
      ) : (
        <span className="flex items-center space-x-1">
          <span>+</span>
          <span>Theo dõi</span>
        </span>
      )}
    </button>
  )
}