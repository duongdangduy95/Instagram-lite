'use client'

import { useEffect, useMemo, useState, useRef, useCallback } from 'react'
import BlogFeed from '@/app/components/BlogFeed'
import UserSuggestionItem from '@/app/components/UserSuggestionItem'
import type { BlogDTO, CurrentUserSafe, SuggestUserDTO } from '@/types/dto'

export default function HomeClient(props: {
  blogs: BlogDTO[]
  users: SuggestUserDTO[]
  currentUser: CurrentUserSafe
  children?: React.ReactNode
  mode?: 'home' | 'hashtag'
  hashtagName?: string
}) {
  const { currentUser, children } = props

  // Local state để có thể update realtime khi user đổi avatar/fullname/username
  const [blogs, setBlogs] = useState<BlogDTO[]>(props.blogs)
  const [users, setUsers] = useState<SuggestUserDTO[]>(props.users)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadMoreRef = useRef<HTMLDivElement | null>(null)

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

  useEffect(() => {
    const onProfileChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { userId: string; fullname?: string | null; username?: string | null; image?: string | null }
        | undefined
      if (!detail?.userId) return

      // Update sidebar suggestions
      setUsers((prev) =>
        prev.map((u) =>
          u.id === detail.userId
            ? {
              ...u,
              fullname: (detail.fullname ?? u.fullname) as string,
              username: (detail.username ?? u.username) as string,
              image: typeof detail.image !== 'undefined' ? detail.image : u.image,
            }
            : u
        )
      )

      // Update feed authors (sharer + original author)
      setBlogs((prev) =>
        prev.map((b) => {
          const next = { ...b }
          if (next.author?.id === detail.userId) {
            next.author = {
              ...next.author,
              fullname: (detail.fullname ?? next.author.fullname) as string,
              username: (detail.username ?? next.author.username) as string,
              image: typeof detail.image !== 'undefined' ? detail.image : next.author.image,
            }
          }
          if (next.sharedFrom?.author?.id === detail.userId) {
            next.sharedFrom = {
              ...next.sharedFrom,
              author: {
                ...next.sharedFrom.author,
                fullname: (detail.fullname ?? next.sharedFrom.author.fullname) as string,
                username: (detail.username ?? next.sharedFrom.author.username) as string,
                image: typeof detail.image !== 'undefined' ? detail.image : next.sharedFrom.author.image,
              },
            }
          }
          return next
        })
      )
    }

    window.addEventListener('user:profile-change', onProfileChange as EventListener)
    return () => window.removeEventListener('user:profile-change', onProfileChange as EventListener)
  }, [])

  // Listen for save/unsave events from modal to sync with home feed
  useEffect(() => {
    const handleSaveChange = (e: Event) => {
      const ce = e as CustomEvent<{ blogId: string; saved: boolean }>
      const detail = ce.detail
      if (!detail?.blogId) return

      // Update saved state for matching blog
      setBlogs((prev) =>
        prev.map((b) => {
          // Match by blogId (for normal posts) or displayBlogId (for shared posts)
          if (b.id === detail.blogId || (b.sharedFrom && b.sharedFrom.id === detail.blogId)) {
            return { ...b, isSaved: detail.saved }
          }
          return b
        })
      )
    }

    window.addEventListener('blog:save-change', handleSaveChange as EventListener)
    return () => window.removeEventListener('blog:save-change', handleSaveChange as EventListener)
  }, [])

  const loadMoreBlogs = useCallback(async () => {
    if (isLoading || !hasMore) return

    if (props.mode === 'hashtag') return

    setIsLoading(true)
    try {
      const lastBlogId = blogs[blogs.length - 1]?.id
      const response = await fetch(`/api/home?cursor=${lastBlogId}`, {
        credentials: 'include',
      })

      if (!response.ok) {
        console.error('Failed to load more blogs')
        return
      }

      const newBlogs = await response.json()

      if (!Array.isArray(newBlogs) || newBlogs.length === 0) {
        setHasMore(false)
        return
      }

      // Deduplicate: chỉ thêm blogs chưa có trong danh sách hiện tại
      setBlogs((prev) => {
        const existingIds = new Set(prev.map(b => b.id))
        const uniqueNewBlogs = newBlogs.filter((b: BlogDTO) => !existingIds.has(b.id))
        return [...prev, ...uniqueNewBlogs]
      })

      // If we got less than expected (PAGE_SIZE = 3), we might be at the end
      if (newBlogs.length < 3) {
        setHasMore(false)
      }
    } catch (error) {
      console.error('Error loading more blogs:', error)
    } finally {
      setIsLoading(false)
    }
  }, [blogs, isLoading, hasMore])

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !isLoading && hasMore) {
          loadMoreBlogs()
        }
      },
      { threshold: 0.1 }
    )

    observerRef.current.observe(loadMoreRef.current)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadMoreBlogs, isLoading, hasMore])

  const handleFollowChange = (targetUserId: string, isFollowing: boolean, followersCount?: number) => {
    setFollowMap((prev) => ({ ...prev, [targetUserId]: isFollowing }))
    if (typeof followersCount === 'number') {
      setFollowersCountMap((prev) => ({ ...prev, [targetUserId]: followersCount }))
    }
  }

  return (
    <div className="ml-0 md:ml-20 lg:ml-64 pt-14 md:pt-0 pb-20 md:pb-0 grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-0">
      {/* Main Content - Cột giữa */}
      <main className="flex justify-center px-4 py-4">
        <div className="w-full max-w-xl space-y-4">
          {children}
          <BlogFeed
            blogs={blogs}
            currentUser={currentUser}
            followMap={followMap}
            onFollowChange={handleFollowChange}
          />

          {/* Infinite Scroll Trigger */}
          {props.mode !== 'hashtag' && (
            <div ref={loadMoreRef} className="flex justify-center py-8">
              {isLoading && (
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              )}
              {!hasMore && blogs.length > 0 && (
                <p className="text-gray-400 text-sm">Đã hết bài viết</p>
              )}
            </div>
          )}
        </div>
      </main>

      {/* USER LIST SIDE BAR - Hidden on hashtag page */}
      {props.mode !== 'hashtag' && (
        <aside className="hidden xl:block px-6 py-4 space-y-3 border-l border-gray-800 bg-[#0B0E11] sticky top-0 h-screen overflow-y-auto no-scrollbar">
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
      )}
    </div>
  )
}


