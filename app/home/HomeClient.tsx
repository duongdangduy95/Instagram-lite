'use client'

import { useMemo, useState } from 'react'
import BlogFeed from '@/app/components/BlogFeed'
import UserSuggestionItem from '@/app/components/UserSuggestionItem'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'

export default function HomeClient(props: {
  blogs: BlogDTO[]
  users: SuggestUserDTO[]
  currentUser: CurrentUserSafe
}) {
  const { blogs, users, currentUser } = props

  const initialFollowMap = useMemo(() => {
    const map: Record<string, boolean> = {}

    // từ sidebar
    for (const u of users) {
      map[u.id] = (u.followers?.length ?? 0) > 0
    }

    // từ feed (đảm bảo cả sharer & author bài gốc)
    for (const b of blogs) {
      // NOTE: BlogFeed follow target:
      // - share: b.author (người share)
      // - normal: b.author (tác giả bài)
      map[b.author.id] = (b.author.followers?.length ?? 0) > 0
    }

    return map
  }, [blogs, users])

  const initialFollowersCount = useMemo(() => {
    const map: Record<string, number> = {}
    for (const u of users) {
      map[u.id] = u._count?.followers ?? 0
    }
    return map
  }, [users])

  const [followMap, setFollowMap] = useState<Record<string, boolean>>(initialFollowMap)
  const [followersCountMap, setFollowersCountMap] = useState<Record<string, number>>(initialFollowersCount)

  const handleFollowChange = (targetUserId: string, isFollowing: boolean, followersCount?: number) => {
    setFollowMap((prev) => ({ ...prev, [targetUserId]: isFollowing }))
    if (typeof followersCount === 'number') {
      setFollowersCountMap((prev) => ({ ...prev, [targetUserId]: followersCount }))
    }
  }

  return (
    <div className="ml-64 grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-0">
      {/* Main Content - Cột giữa */}
      <main className="flex justify-center px-4 py-4">
        <div className="w-full max-w-xl space-y-4">
          <BlogFeed
            blogs={blogs}
            currentUser={currentUser}
            followMap={followMap}
            onFollowChange={handleFollowChange}
          />
        </div>
      </main>

      {/* USER LIST SIDE BAR */}
      <aside className="hidden lg:block px-6 py-4 space-y-3 border-l border-gray-800 bg-black sticky top-0 h-screen overflow-y-auto no-scrollbar">
        <p className="text-gray-300 font-semibold mb-4 text-lg">Gợi ý theo dõi</p>
        <div className="space-y-4">
          {users.map((u) => (
            <UserSuggestionItem
              key={u.id}
              user={u}
              currentUserId={currentUser?.id || null}
              isFollowingOverride={followMap[u.id]}
              followersCountOverride={followersCountMap[u.id]}
              onFollowChange={(isFollowing, followersCount) => handleFollowChange(u.id, isFollowing, followersCount)}
            />
          ))}
        </div>
      </aside>
    </div>
  )
}


