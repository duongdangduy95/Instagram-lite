'use client'

import { useEffect, useState } from 'react'

interface FollowButtonProps {
  targetUserId: string
  initialIsFollowing: boolean
  onFollowChange?: (isFollowing: boolean, followersCount?: number) => void
  size?: 'sm' | 'md' // sm cho sidebar, md cho post
  className?: string
}

export default function FollowButton({
  targetUserId,
  initialIsFollowing,
  onFollowChange,
  size = 'md',
  className = ''
}: FollowButtonProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isLoading, setIsLoading] = useState(false)

  // Đồng bộ khi parent cập nhật trạng thái follow (để các nút ở nơi khác đổi theo ngay)
  useEffect(() => {
    setIsFollowing(initialIsFollowing)
  }, [initialIsFollowing])

  const handleFollow = async () => {
    // Optimistic update - cập nhật UI ngay lập tức
    const previousIsFollowing = isFollowing
    const newIsFollowing = !isFollowing

    setIsFollowing(newIsFollowing)
    // Báo cho parent update ngay (đồng bộ sidebar/feed) — chưa có followersCount thì để undefined
    onFollowChange?.(newIsFollowing)
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
        onFollowChange?.(previousIsFollowing)
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }))
        alert(errorData.error || 'Có lỗi xảy ra')
      }
    } catch (error) {
      // Rollback nếu có lỗi
      setIsFollowing(previousIsFollowing)
      onFollowChange?.(previousIsFollowing)
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
      className={`font-semibold transition-all disabled:opacity-50 rounded-lg ${size === 'sm'
          ? 'text-sm px-2.5 py-1 text-[#877EFF] hover:text-white hover:bg-white/10 border border-transparent hover:border-white/20'
          : 'text-sm px-4 py-2 text-white rounded-lg bg-[#877EFF] hover:bg-[#7565E6]'
        } ${className}`}
    >
      {isLoading ? '...' : isFollowing ? 'Đang theo dõi' : 'Theo dõi'}
    </button>
  )
}