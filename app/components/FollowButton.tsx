'use client'

import { useState } from 'react'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void
}

export default function FollowButton({ 
  targetUserId, 
  initialIsFollowing,
  onFollowChange 
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/follow/${targetUserId}`, {
        method: isFollowing ? 'DELETE' : 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setIsFollowing(!isFollowing)
        onFollowChange?.(!isFollowing, data.followersCount)
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
      className={`px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 ${
        isFollowing
          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          : 'bg-blue-600 text-white hover:bg-blue-700'
      }`}
    >
      {isLoading ? '...' : isFollowing ? '✓ Đang theo dõi' : '+ Theo dõi'}
    </button>
  )
}