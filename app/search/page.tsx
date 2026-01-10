'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import FollowButton from '../components/FollowButton'

type UserSearchResult = {
  id: string
  username: string
  fullname: string
  image: string | null
  isFollowing: boolean
  _count: {
    followers: number
    following: number
  }
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [searchResults, setSearchResults] = useState<UserSearchResult[]>([])
  const [randomUsers, setRandomUsers] = useState<UserSearchResult[]>([])
  const [searchLoading, setSearchLoading] = useState(false)

  // Pagination for random users
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  const observer = useRef<IntersectionObserver | null>(null)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  const { data: session } = useSession()

  // Search users with debounce
  const searchUsers = useCallback(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      return
    }

    setSearchLoading(true)
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&limit=20`)
      const { data } = await res.json()
      setSearchResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setSearchLoading(false)
    }
  }, [])

  // Debounced search on query change
  useEffect(() => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }

    debounceTimer.current = setTimeout(() => {
      searchUsers(query)
    }, 300)

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [query, searchUsers])

  // Fetch random users
  const fetchRandomUsers = useCallback(async (currentCursor: string | null = null) => {
    if (isLoadingMore) return
    setIsLoadingMore(true)

    try {
      const url = `/api/search?limit=6${currentCursor ? `&cursor=${currentCursor}` : ''}`
      const res = await fetch(url)
      const { data, nextCursor } = await res.json()

      setRandomUsers(prev => {
        if (!currentCursor) return data
        // Deduplicate: filter out users that already exist in prev array
        const existingIds = new Set(prev.map(u => u.id))
        const newUsers = data.filter((u: UserSearchResult) => !existingIds.has(u.id))
        return [...prev, ...newUsers]
      })
      setCursor(nextCursor)
      setHasMore(!!nextCursor)
    } catch (error) {
      console.error('Fetch users error:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [isLoadingMore])

  // Initial load
  useEffect(() => {
    fetchRandomUsers(null)
  }, [])

  // Infinite scroll observer
  const lastUserElementRef = useCallback((node: HTMLDivElement) => {
    if (isLoadingMore) return
    if (observer.current) observer.current.disconnect()

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        fetchRandomUsers(cursor)
      }
    })

    if (node) observer.current.observe(node)
  }, [isLoadingMore, hasMore, cursor, fetchRandomUsers])

  const handleFollowChange = (userId: string, isFollowing: boolean) => {
    // Update in search results
    setSearchResults(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing, _count: { ...user._count, followers: user._count.followers + (isFollowing ? 1 : -1) } }
          : user
      )
    )

    // Update in random users
    setRandomUsers(prev =>
      prev.map(user =>
        user.id === userId
          ? { ...user, isFollowing, _count: { ...user._count, followers: user._count.followers + (isFollowing ? 1 : -1) } }
          : user
      )
    )
  }

  const UserCard = ({ user, isLast = false }: { user: UserSearchResult; isLast?: boolean }) => (
    <div
      ref={isLast ? lastUserElementRef : null}
      className="flex flex-row sm:flex-col items-center sm:items-center p-3 sm:p-6 bg-[#1A1D21] rounded-lg border border-gray-800 hover:border-gray-700 transition-all sm:aspect-square sm:justify-center gap-3 sm:gap-0"
    >
      {/* Avatar */}
      <Link href={`/profile/${user.id}`} className="flex flex-row sm:flex-col items-center sm:items-center w-auto sm:w-full flex-shrink-0">
        {user.image ? (
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-2 border-gray-700 sm:mb-3 flex-shrink-0 aspect-square">
            <Image
              src={user.image}
              alt={user.username}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg sm:text-2xl font-bold border-2 border-gray-700 sm:mb-3 flex-shrink-0 aspect-square">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Info - Mobile: bên phải avatar, Desktop: dưới avatar */}
        <div className="text-left sm:text-center w-full sm:px-1 ml-3 sm:ml-0">
          <h3 className="text-white font-semibold truncate mb-0.5 sm:mb-1 text-sm sm:text-base">{user.username}</h3>
          <p className="text-gray-400 text-xs sm:text-sm truncate mb-1 sm:mb-2">{user.fullname}</p>
          <p className="text-gray-500 text-[10px] sm:text-xs">
            {user._count.followers} người theo dõi
          </p>
        </div>
      </Link>

      {/* Follow Button - Mobile: bên phải, Desktop: dưới */}
      {session?.user?.id && session.user.id !== user.id && (
        <div className="ml-auto sm:ml-0 mt-0 sm:mt-3 sm:mt-4 w-auto sm:w-full flex justify-end sm:justify-center px-0 sm:px-2 flex-shrink-0">
          <FollowButton
            targetUserId={user.id}
            initialIsFollowing={user.isFollowing}
            onFollowChange={(isFollowing) => handleFollowChange(user.id, isFollowing)}
            size="sm"
          />
        </div>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-[#0B0E11] text-gray-100 pt-14 md:pt-0 pb-20 md:pb-0">
      <Navigation />

      <div className="ml-0 md:ml-20 lg:ml-64 min-h-screen">
        <main className="flex flex-col items-center px-3 sm:px-4 pt-6 sm:pt-8 pb-10">
          <div className="w-full max-w-5xl space-y-6 sm:space-y-8">

            {/* SEARCH BOX */}
            <div className="relative group w-full max-w-2xl mx-auto">
              <div className="flex items-center w-full bg-[#1A1D21] border border-gray-700 rounded-full px-3 sm:px-5 py-2.5 sm:py-3 focus-within:border-[#7565E6] focus-within:ring-1 focus-within:ring-[#7565E6] transition-all shadow-lg hover:shadow-xl hover:border-gray-600">
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mr-2 sm:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500 text-sm sm:text-base"
                  autoFocus
                />

                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {searchLoading && (
                  <div className="ml-2 w-4 h-4 sm:w-5 sm:h-5 border-2 border-gray-600 border-t-[#7565E6] rounded-full animate-spin flex-shrink-0" />
                )}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="w-full">
              {query ? (
                // SEARCH RESULTS
                <>
                  <h2 className="text-base sm:text-lg font-semibold text-white px-2 mb-3 sm:mb-4">Kết quả tìm kiếm</h2>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {searchResults.map(user => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  ) : (
                    !searchLoading && (
                      <div className="text-center py-8 sm:py-12">
                        <svg className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500 text-sm sm:text-base">Không tìm thấy người dùng nào.</p>
                      </div>
                    )
                  )}
                </>
              ) : (
                // RANDOM USERS
                <>
                  <h2 className="text-base sm:text-lg font-semibold text-white px-2 mb-3 sm:mb-4">Gợi ý tài khoản</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {randomUsers.map((user, index) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        isLast={index === randomUsers.length - 1}
                      />
                    ))}
                  </div>

                  {isLoadingMore && (
                    <div className="flex justify-center py-4 sm:py-6 mt-3 sm:mt-4">
                      <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-[#7565E6]"></div>
                    </div>
                  )}

                  {!hasMore && randomUsers.length > 0 && (
                    <p className="text-center text-gray-500 text-sm sm:text-base py-3 sm:py-4 mt-3 sm:mt-4">Đã hiển thị tất cả người dùng</p>
                  )}
                </>
              )}
            </div>

          </div>
        </main>
      </div>
    </div>
  )
}
