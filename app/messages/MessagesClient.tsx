'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import ChatWindow from '@/app/components/ChatWindow'
import { supabase } from '@/lib/supabaseClientClient'
import { useRouter, useSearchParams } from 'next/navigation'

type ConversationUser = {
  id: string
  username: string
  fullname: string
  image: string | null
  conversationId?: string
  isFollowing?: boolean
  lastMessage?: {
    content: string
    createdAt: string
    senderId: string
  }
  unreadCount?: number
  hasReplied?: boolean
}

type ConversationsApiItem = {
  id: string
  otherUser: {
    id: string
    username: string
    fullname: string
    image: string | null
  }
  lastMessage: { content: string; createdAt: string; senderId: string } | null
  isFollowing?: boolean
  hasReplied?: boolean
}

type RealtimeMessageRow = {
  conversationId: string
  content: string
  createdAt: string
  senderId: string
}

type FollowingUser = {
  id: string
  username: string
  fullname: string
  image: string | null
}

export default function MessagesClient() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlUserId = searchParams.get('userId')

  const [conversations, setConversations] = useState<ConversationUser[]>([])
  const [filteredConversations, setFilteredConversations] = useState<ConversationUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ConversationUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'primary' | 'pending'>('primary')
  const realtimeChannelRef = useRef<ReturnType<typeof supabase.channel> | null>(null)

  // New message modal (choose from following)
  const [isNewMessageOpen, setIsNewMessageOpen] = useState(false)
  const [followingUsers, setFollowingUsers] = useState<FollowingUser[]>([])
  const [followingLoading, setFollowingLoading] = useState(false)
  const [followingQuery, setFollowingQuery] = useState('')

  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const openChatWithUser = useCallback((u: ConversationUser) => {
    setSelectedUser(u)
    // Đồng bộ URL để mobile/back/F5 hoạt động đúng
    router.push(`/messages?userId=${u.id}`)
  }, [router])

  const closeChat = useCallback(() => {
    setSelectedUser(null)
    router.push('/messages')
  }, [router])

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return

    setLoading(true)
    try {
      const res = await fetch('/api/conversations', {
        headers: { Accept: 'application/json' },
        cache: 'no-store'
      })

      if (!res.ok) {
        // Tránh crash khi API trả HTML/empty body (ví dụ 401/500)
        const errText = await res.text().catch(() => '')
        console.error('Error fetching conversations:', res.status, errText)
        setConversations([])
        return
      }

      // res.json() có thể throw nếu body rỗng => parse an toàn
      const rawText = await res.text()
      const data = (rawText ? (JSON.parse(rawText) as ConversationsApiItem[]) : []) ?? []

      // Transform to ConversationUser format
      const convUsers: ConversationUser[] = (data ?? []).map((conv) => ({
        id: conv.otherUser.id,
        username: conv.otherUser.username,
        fullname: conv.otherUser.fullname,
        image: conv.otherUser.image,
        lastMessage: conv.lastMessage,
        conversationId: conv.id,
        isFollowing: conv.isFollowing,
        hasReplied: conv.hasReplied
      }))

      // Deduplicate bằng conversationId để tránh duplicate
      const uniqueConversations = convUsers.reduce((acc, conv) => {
        // Kiểm tra xem đã có conversation với cùng conversationId chưa
        if (!acc.find(c => c.conversationId === conv.conversationId)) {
          acc.push(conv)
        }
        return acc
      }, [] as ConversationUser[])

      setConversations(uniqueConversations)
      // Không set filteredConversations ở đây, để filter effect xử lý
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [currentUserId])

  // Initial fetch
  useEffect(() => {
    if (currentUserId) {
      fetchConversations()
    }
  }, [currentUserId, fetchConversations])

  // Setup realtime listener for new messages
  useEffect(() => {
    if (!currentUserId) return

    let isRefetching = false // Flag để tránh gọi fetchConversations nhiều lần liên tiếp

    // ⚠️ Tránh attach listener nhiều lần (đặc biệt khi dev/StrictMode hoặc remount nhẹ)
    if (realtimeChannelRef.current) {
      supabase.removeChannel(realtimeChannelRef.current)
      realtimeChannelRef.current = null
    }

    const channel = supabase
      .channel(`messages-page:${currentUserId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message'
        },
        (payload) => {
          const message = payload.new as unknown as RealtimeMessageRow

          // Update conversations without full refetch for smoother UX
          setConversations(prev => {
            const updated = [...prev]
            const convIndex = updated.findIndex(c => {
              return c.conversationId === message.conversationId
            })

            if (convIndex >= 0) {
              // Update existing conversation
              const conv = updated[convIndex]
              const isFromCurrentUser = message.senderId === currentUserId
              updated[convIndex] = {
                ...conv,
                lastMessage: {
                  content: message.content,
                  createdAt: message.createdAt,
                  senderId: message.senderId
                },
                unreadCount: isFromCurrentUser ? 0 : (conv.unreadCount || 0) + 1,
                hasReplied: isFromCurrentUser ? true : (conv.hasReplied || false)
              }

              // Move to top
              const [movedConv] = updated.splice(convIndex, 1)
              updated.unshift(movedConv)
            } else {
              // New conversation - refetch to get full data
              if (!isRefetching) {
                isRefetching = true
                fetchConversations().finally(() => {
                  setTimeout(() => {
                    isRefetching = false
                  }, 1000)
                })
              }
            }

            // Dedupe cứng theo conversationId/userId để tránh state phình nếu listener bị gọi lặp
            const map = new Map<string, ConversationUser>()
            for (const conv of updated) {
              const key = conv.conversationId || conv.id
              const existing = map.get(key)
              if (
                !existing ||
                (conv.lastMessage &&
                  (!existing.lastMessage ||
                    new Date(conv.lastMessage.createdAt) >
                      new Date(existing.lastMessage.createdAt)))
              ) {
                map.set(key, conv)
              }
            }
            return Array.from(map.values())
          })
        }
      )
      .subscribe()

    realtimeChannelRef.current = channel

    return () => {
      if (realtimeChannelRef.current) {
        supabase.removeChannel(realtimeChannelRef.current)
        realtimeChannelRef.current = null
      } else {
        supabase.removeChannel(channel)
      }
    }
  }, [currentUserId, fetchConversations])

  // Filter conversations based on activeTab and search
  useEffect(() => {
    const conversationMap = new Map<string, ConversationUser>()

    conversations.forEach(conv => {
      const key = conv.conversationId || conv.id
      const existing = conversationMap.get(key)
      if (!existing ||
        (conv.lastMessage && (!existing.lastMessage ||
          new Date(conv.lastMessage.createdAt) > new Date(existing.lastMessage.createdAt)))) {
        conversationMap.set(key, conv)
      }
    })

    const uniqueConversations = Array.from(conversationMap.values())
    let filtered = uniqueConversations

    if (activeTab === 'primary') {
      filtered = filtered.filter(conv => conv.isFollowing !== false || conv.hasReplied)
    } else {
      filtered = filtered.filter(conv => conv.isFollowing === false && !conv.hasReplied && conv.lastMessage)
    }

    if (activeTab === 'primary' && searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredConversations(filtered)
  }, [searchQuery, conversations, activeTab])

  const fetchFollowingUsers = useCallback(async () => {
    if (!currentUserId) return
    setFollowingLoading(true)
    try {
      const res = await fetch('/api/follow/following', {
        headers: { Accept: 'application/json' },
        cache: 'no-store',
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        console.error('Error fetching following users:', res.status, txt)
        setFollowingUsers([])
        return
      }
      const users = (await res.json()) as FollowingUser[]
      setFollowingUsers(Array.isArray(users) ? users : [])
    } catch (e) {
      console.error('Error fetching following users:', e)
      setFollowingUsers([])
    } finally {
      setFollowingLoading(false)
    }
  }, [currentUserId])

  useEffect(() => {
    if (!isNewMessageOpen) return
    void fetchFollowingUsers()
  }, [isNewMessageOpen, fetchFollowingUsers])

  useEffect(() => {
    if (!isNewMessageOpen) return
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsNewMessageOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [isNewMessageOpen])

  // Mobile deep-link: /messages?userId=...
  useEffect(() => {
    if (!urlUserId) {
      setSelectedUser(null)
      return
    }
    if (selectedUser?.id === urlUserId) return

    const fromList = conversations.find(c => c.id === urlUserId)
    if (fromList) {
      setSelectedUser(fromList)
      return
    }

    let cancelled = false
    ;(async () => {
      try {
        const res = await fetch(`/api/user/${urlUserId}`, {
          headers: { Accept: 'application/json' },
          cache: 'no-store',
        })
        if (!res.ok) return
        const u = (await res.json()) as FollowingUser
        if (cancelled) return
        setSelectedUser({
          id: u.id,
          username: u.username,
          fullname: u.fullname,
          image: u.image,
          isFollowing: true,
          hasReplied: false,
        })
      } catch {
        // ignore
      }
    })()

    return () => {
      cancelled = true
    }
  }, [urlUserId, conversations, selectedUser?.id])

  // Handle sending message - move conversation to top and update lastMessage
  const handleMessageSent = useCallback((userId: string) => {
    setConversations(prev => {
      const updated = [...prev]
      const index = updated.findIndex(c => c.id === userId)
      if (index >= 0) {
        const conv = updated[index]
        updated[index] = {
          ...conv,
          lastMessage: {
            content: '...',
            createdAt: new Date().toISOString(),
            senderId: currentUserId || ''
          },
          unreadCount: 0,
          hasReplied: true
        }

        if (index > 0) {
          const [movedConv] = updated.splice(index, 1)
          updated.unshift(movedConv)
        }
      }
      return updated
    })
  }, [currentUserId])

  const conversationListPanel = (
    <>
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h1 className="text-2xl font-bold text-white">Tin nhắn</h1>

          <button
            type="button"
            onClick={() => {
              setFollowingQuery('')
              setIsNewMessageOpen(true)
            }}
            className="p-2 rounded-lg hover:bg-[#1A1D21] transition-colors"
            title="Tin nhắn mới"
            aria-label="Tin nhắn mới"
          >
            <Image src="/icons/edit.svg" alt="" width={22} height={22} />
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <div className="flex items-center bg-[#1A1D21] border border-gray-700 rounded-lg px-4 py-2 focus-within:border-[#7565E6] transition-all">
            <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={activeTab === 'pending' ? 'Tìm kiếm' : 'Tìm kiếm...'}
              disabled={activeTab === 'pending'}
              className={`flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 ${activeTab === 'pending' ? 'opacity-60 cursor-not-allowed' : ''}`}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="p-1 hover:bg-gray-700 rounded-full transition-colors"
              >
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Tabs - Underline Style */}
        <div className="flex gap-0 mt-4 border-b border-gray-800">
          <button
            onClick={() => setActiveTab('primary')}
            className={`flex-1 py-3 font-medium transition-colors relative ${activeTab === 'primary'
              ? 'text-[#7565E6]'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Đoạn chat
            {activeTab === 'primary' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7565E6]"></div>
            )}
          </button>
          <button
            onClick={() => {
              setActiveTab('pending')
              setSearchQuery('')
            }}
            className={`flex-1 py-3 font-medium transition-colors relative ${activeTab === 'pending'
              ? 'text-[#7565E6]'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            Tin nhắn chờ
            {activeTab === 'pending' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7565E6]"></div>
            )}
          </button>
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-win">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7565E6]"></div>
          </div>
        ) : filteredConversations.length > 0 ? (
          filteredConversations.map(conv => {
            const isUnread = conv.lastMessage?.senderId !== currentUserId && conv.unreadCount && conv.unreadCount > 0
            const isSelected = selectedUser?.id === conv.id

            return (
              <button
                key={conv.conversationId || conv.id}
                onClick={() => openChatWithUser(conv)}
                className={`w-full flex items-center gap-3 px-6 py-4 transition-colors relative ${isSelected
                  ? 'bg-[#1A1D21] border-l-4 border-[#7565E6]'
                  : isUnread
                    ? 'bg-[#1A1D21]/30 hover:bg-[#1A1D21]/50'
                    : 'hover:bg-[#1A1D21]/30'
                  }`}
              >
                {/* Avatar */}
                <div className="relative">
                  {conv.image ? (
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-gray-700 flex-shrink-0">
                      <Image
                        src={conv.image}
                        alt={conv.username}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-lg font-bold border-2 border-gray-700 flex-shrink-0">
                      {conv.username?.charAt(0).toUpperCase()}
                    </div>
                  )}

                  {/* Unread badge */}
                  {isUnread && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#7565E6] rounded-full border-2 border-[#0B0E11] flex items-center justify-center">
                      <span className="text-white text-[10px] font-bold">{conv.unreadCount}</span>
                    </div>
                  )}
                </div>

                {/* User Info */}
                <div className="flex-1 text-left min-w-0">
                  <h3 className={`truncate ${isUnread ? 'text-white font-bold' : 'text-white font-semibold'}`}>
                    {conv.username}
                  </h3>
                  {conv.lastMessage ? (
                    <p className={`text-sm truncate ${isUnread ? 'text-gray-300 font-medium' : 'text-gray-400'}`}>
                      {conv.lastMessage.content || 'Đã gửi file'}
                    </p>
                  ) : (
                    <p className="text-gray-500 text-sm">Bắt đầu trò chuyện</p>
                  )}
                </div>
              </button>
            )
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            <svg className="w-16 h-16 text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <p className="text-gray-500">
              {searchQuery ? 'Không tìm thấy cuộc trò chuyện nào.' : 'Chưa có cuộc trò chuyện nào.'}
            </p>
          </div>
        )}
      </div>
    </>
  )

  return (
    <div className="h-screen bg-[#0B0E11] flex overflow-hidden pt-14 md:pt-0 pb-20 md:pb-0">
      {/* Left: Navigation */}
      <Navigation />

      {/* Mobile: single column (list <-> chat) */}
      <div className="md:hidden flex-1 min-w-0 min-h-0 overflow-hidden">
        {selectedUser ? (
          <ChatWindow
            targetUserId={selectedUser.id}
            targetUsername={selectedUser.username}
            targetFullname={selectedUser.fullname}
            targetImage={selectedUser.image}
            onClose={closeChat}
            isStandalone={true}
            showBackButton={true}
            onBack={closeChat}
            onMessageSent={() => handleMessageSent(selectedUser.id)}
          />
        ) : (
          <div className="w-full h-full bg-[#0B0E11] flex flex-col min-h-0">
            {conversationListPanel}
          </div>
        )}
      </div>

      {/* Desktop: list + chat */}
      <div className="ml-0 md:ml-20 lg:ml-64 w-96 border-r border-gray-800 bg-[#0B0E11] flex flex-col min-h-0 hidden md:flex">
        {conversationListPanel}
      </div>

      <div className="hidden md:block flex-1 bg-[#0B0E11] min-h-0 overflow-hidden">
        {selectedUser ? (
          <ChatWindow
            targetUserId={selectedUser.id}
            targetUsername={selectedUser.username}
            targetFullname={selectedUser.fullname}
            targetImage={selectedUser.image}
            onClose={closeChat}
            isStandalone={true}
            onMessageSent={() => handleMessageSent(selectedUser.id)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500 px-6">
            <svg className="w-24 h-24 mb-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Tin nhắn của bạn</h3>
            <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>

      {/* New Message Modal */}
      {isNewMessageOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setIsNewMessageOpen(false)
          }}
        >
          <div className="w-full max-w-md bg-[#0B0E11] border border-gray-800 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <div>
                <h3 className="text-white font-bold">Tin nhắn mới</h3>
                <p className="text-gray-500 text-xs mt-1">Chọn người bạn đang theo dõi để bắt đầu chat</p>
              </div>
              <button
                type="button"
                onClick={() => setIsNewMessageOpen(false)}
                className="p-2 rounded-lg hover:bg-[#1A1D21] text-gray-300"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center bg-[#1A1D21] border border-gray-700 rounded-lg px-4 py-2 focus-within:border-[#7565E6] transition-all">
                <svg className="w-5 h-5 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  value={followingQuery}
                  onChange={(e) => setFollowingQuery(e.target.value)}
                  placeholder="Tìm người bạn đang theo dõi..."
                  className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500"
                  autoFocus
                />
              </div>
            </div>

            <div className="max-h-[60vh] overflow-y-auto scrollbar-win">
              {followingLoading ? (
                <div className="flex justify-center items-center py-10">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7565E6]"></div>
                </div>
              ) : (() => {
                const q = followingQuery.trim().toLowerCase()
                const list = q
                  ? followingUsers.filter(u =>
                    (u.username || '').toLowerCase().includes(q) ||
                    (u.fullname || '').toLowerCase().includes(q)
                  )
                  : followingUsers

                if (list.length === 0) {
                  return (
                    <div className="p-6 text-center text-gray-500">
                      {followingUsers.length === 0
                        ? 'Bạn chưa theo dõi ai.'
                        : 'Không tìm thấy người dùng phù hợp.'}
                    </div>
                  )
                }

                return (
                  <div className="divide-y divide-gray-800">
                    {list.map(u => (
                      <button
                        key={u.id}
                        type="button"
                        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#1A1D21] transition-colors text-left"
                        onClick={() => {
                          setIsNewMessageOpen(false)
                          setActiveTab('primary')
                          openChatWithUser({
                            id: u.id,
                            username: u.username,
                            fullname: u.fullname,
                            image: u.image,
                            isFollowing: true,
                            hasReplied: false,
                          })
                        }}
                      >
                        {u.image ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-700 flex-shrink-0">
                            <Image
                              src={u.image}
                              alt={u.username}
                              width={40}
                              height={40}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold border border-gray-700 flex-shrink-0">
                            {(u.username || 'U').charAt(0).toUpperCase()}
                          </div>
                        )}

                        <div className="min-w-0">
                          <div className="text-white font-semibold truncate">{u.username}</div>
                          <div className="text-gray-500 text-sm truncate">{u.fullname}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

