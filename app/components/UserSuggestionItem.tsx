'use client'

import Link from 'next/link'
import FollowButton from './FollowButton'

interface UserSuggestionItemProps {
  user: {
    id: string
    fullname: string
    username: string
    followers?: { followerId: string }[]
    _count?: {
      followers: number
    }
  }
  currentUserId: string | null
}

export default function UserSuggestionItem({ user, currentUserId }: UserSuggestionItemProps) {
  const isFollowing = (user.followers?.length ?? 0) > 0

  const followersCount = user._count?.followers ?? 0

  return (
    <div className="flex items-center justify-between px-3 py-3 rounded-lg hover:bg-gray-900 transition-colors">
      <Link
        href={`/profile/${user.id}`}
        prefetch={true}
        className="flex items-center space-x-3 flex-1 min-w-0"
      >
        <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold flex-shrink-0">
          {user.fullname.charAt(0).toUpperCase()}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-gray-100 font-semibold break-words">{user.fullname}</p>
          <p className="text-gray-400 text-sm">
            {followersCount} {followersCount === 1 ? 'người theo dõi' : 'người theo dõi'}
          </p>
        </div>
      </Link>
      {currentUserId && (
        <div className="ml-3 flex-shrink-0">
          <FollowButton
            targetUserId={user.id}
            initialIsFollowing={isFollowing}
            size="sm"
          />
        </div>
      )}
    </div>
  )
}

