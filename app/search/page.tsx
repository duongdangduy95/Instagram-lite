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

      setRandomUsers(prev => currentCursor ? [...prev, ...data] : data)
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
      className="flex flex-col items-center p-6 bg-[#1A1D21] rounded-lg border border-gray-800 hover:border-gray-700 transition-all aspect-square justify-center"
    >
      {/* Avatar */}
      <Link href={`/profile/${user.id}`} className="flex flex-col items-center w-full">
        {user.image ? (
          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-700 mb-3">
            <Image
              src={user.image}
              alt={user.username}
              width={80}
              height={80}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-700 mb-3">
            {user.username?.charAt(0).toUpperCase()}
          </div>
        )}

        {/* User Info */}
        <div className="text-center w-full">
          <h3 className="text-white font-semibold truncate mb-1">{user.username}</h3>
          <p className="text-gray-400 text-sm truncate mb-2">{user.fullname}</p>
          <p className="text-gray-500 text-xs">
            {user._count.followers} người theo dõi
          </p>
        </div>
      </Link>

      {/* Follow Button */}
      {session?.user?.id && session.user.id !== user.id && (
        <div className="mt-4 w-full flex justify-center">
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
        <main className="flex flex-col items-center px-4 pt-8 pb-10">
          <div className="w-full max-w-5xl space-y-8">

            {/* SEARCH BOX */}
            <div className="relative group w-full max-w-2xl mx-auto">
              <div className="flex items-center w-full bg-[#1A1D21] border border-gray-700 rounded-full px-5 py-3 focus-within:border-[#7565E6] focus-within:ring-1 focus-within:ring-[#7565E6] transition-all shadow-lg hover:shadow-xl hover:border-gray-600">
                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>

                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
                  autoFocus
                />

                {query && (
                  <button
                    onClick={() => setQuery('')}
                    className="p-1 hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}

                {searchLoading && (
                  <div className="ml-2 w-5 h-5 border-2 border-gray-600 border-t-[#7565E6] rounded-full animate-spin" />
                )}
              </div>
            </div>

            {/* CONTENT AREA */}
            <div className="w-full">
              {query ? (
                // SEARCH RESULTS
                <>
                  <h2 className="text-lg font-semibold text-white px-2 mb-4">Kết quả tìm kiếm</h2>
                  {searchResults.length > 0 ? (
                    <div className="grid grid-cols-3 gap-4">
                      {searchResults.map(user => (
                        <UserCard key={user.id} user={user} />
                      ))}
                    </div>
                  ) : (
                    !searchLoading && (
                      <div className="text-center py-12">
                        <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <p className="text-gray-500">Không tìm thấy người dùng nào.</p>
                      </div>
                    )
                  )}
                </>
              ) : (
                // RANDOM USERS
                <>
                  <h2 className="text-lg font-semibold text-white px-2 mb-4">Gợi ý tài khoản</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {randomUsers.map((user, index) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        isLast={index === randomUsers.length - 1}
                      />
                    ))}
                  </div>

                  {isLoadingMore && (
                    <div className="flex justify-center py-6 mt-4">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7565E6]"></div>
                    </div>
                  )}

                  {!hasMore && randomUsers.length > 0 && (
                    <p className="text-center text-gray-500 py-4 mt-4">Đã hiển thị tất cả người dùng</p>
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
