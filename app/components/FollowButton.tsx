'use client'

import { useState } from 'react'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean, followersCount: number) => void
  size?: 'sm' | 'md' // sm cho sidebar, md cho post
}

export default function FollowButton({ 
  targetUserId, 
  initialIsFollowing,
  onFollowChange,
  size = 'md'
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  const handleFollow = async () => {
    // Optimistic update - cập nhật UI ngay lập tức
    const previousIsFollowing = isFollowing
    const newIsFollowing = !isFollowing
    
    setIsFollowing(newIsFollowing)
    setIsLoading(true)
    
    try {
      const response = await fetch(`/api/follow/${targetUserId}`, {
        method: previousIsFollowing ? 'DELETE' : 'POST',
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Cập nhật followers count nếu có callback
        onFollowChange?.(newIsFollowing, data.followersCount)
      } else {
        // Rollback nếu có lỗi
        setIsFollowing(previousIsFollowing)
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(errorData.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      // Rollback nếu có lỗi
      setIsFollowing(previousIsFollowing)
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
      className="text-sm font-semibold transition-colors disabled:opacity-50 text-[#877EFF] hover:text-[#7565E6]"
    >
      {isLoading ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </button>
  )
}