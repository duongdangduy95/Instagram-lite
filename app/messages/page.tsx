'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import ChatWindow from '@/app/components/ChatWindow'
import { supabase } from '@/lib/supabaseClientClient'

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

export default function MessagesPage() {
  const [conversations, setConversations] = useState<ConversationUser[]>([])
  const [filteredConversations, setFilteredConversations] = useState<ConversationUser[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedUser, setSelectedUser] = useState<ConversationUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'primary' | 'pending'>('primary')

  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  // Fetch conversations from API
  const fetchConversations = useCallback(async () => {
    if (!currentUserId) return

    setLoading(true)
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()

      // Transform to ConversationUser format
      const convUsers: ConversationUser[] = data.map((conv: any) => ({
        id: conv.otherUser.id,
        username: conv.otherUser.username,
        fullname: conv.otherUser.fullname,
        image: conv.otherUser.image,
        lastMessage: conv.lastMessage,
        conversationId: conv.id,
        isFollowing: conv.isFollowing,
        hasReplied: conv.hasReplied
      }))

      setConversations(convUsers)
      setFilteredConversations(convUsers)
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

    const channel = supabase
      .channel('messages-page')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message'
        },
        (payload) => {
          const message = payload.new as any

          // Update conversations without full refetch for smoother UX
          setConversations(prev => {
            const updated = [...prev]
            const convIndex = updated.findIndex(c => {
              // Find by checking if message belongs to this conversation
              // We need to match based on the conversation participants
              return c.conversationId === message.conversationId
            })

            if (convIndex >= 0) {
              // Update existing conversation
              const conv = updated[convIndex]
              updated[convIndex] = {
                ...conv,
                lastMessage: {
                  content: message.content,
                  createdAt: message.createdAt,
                  senderId: message.senderId
                },
                // Increment unread if message is from other user
                unreadCount: message.senderId !== currentUserId
                  ? (conv.unreadCount || 0) + 1
                  : 0
              }

              // Move to top
              const [movedConv] = updated.splice(convIndex, 1)
              updated.unshift(movedConv)
            } else {
              // New conversation - refetch to get full data
              fetchConversations()
            }

            return updated
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [currentUserId, fetchConversations])

  // Filter conversations based on activeTab and search
  useEffect(() => {
    let filtered = conversations

    // Filter by tab
    if (activeTab === 'primary') {
      // Primary: Show if following OR if current user has replied
      filtered = filtered.filter(conv => conv.isFollowing !== false || conv.hasReplied)
    } else {
      // Pending: Only show if NOT following AND current user has NOT replied AND there is a message
      filtered = filtered.filter(conv => conv.isFollowing === false && !conv.hasReplied && conv.lastMessage)
    }

    // Filter by search query (chỉ áp dụng cho tab "Đoạn chat", không lấy ở danh sách chờ)
    if (activeTab === 'primary' && searchQuery.trim()) {
      filtered = filtered.filter(conv =>
        conv.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.fullname.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    setFilteredConversations(filtered)
  }, [searchQuery, conversations, activeTab])

  // Handle sending message - move conversation to top and update lastMessage
  const handleMessageSent = useCallback((userId: string) => {
    setConversations(prev => {
      const updated = [...prev]
      const index = updated.findIndex(c => c.id === userId)
      if (index >= 0) {
        const conv = updated[index]
        // Update last message timestamp to now (will be replaced by realtime update with actual message)
        updated[index] = {
          ...conv,
          lastMessage: {
            content: '...',
            createdAt: new Date().toISOString(),
            senderId: currentUserId || ''
          },
          unreadCount: 0 // Reset unread when sending
        }

        // Move to top if not already there
        if (index > 0) {
          const [movedConv] = updated.splice(index, 1)
          updated.unshift(movedConv)
        }
      }
      return updated
    })
  }, [currentUserId])

  return (
    <div className="h-screen bg-[#0B0E11] flex overflow-hidden">
      {/* Left: Navigation */}
      <Navigation />

      {/* Middle: Conversation List */}
      <div className="ml-64 w-96 border-r border-gray-800 bg-[#0B0E11] flex flex-col min-h-0">
        {/* Header */}
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-bold text-white mb-4">Tin nhắn</h1>

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
                setSearchQuery('') // không search trong danh sách chờ
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
                  key={conv.id}
                  onClick={() => setSelectedUser(conv)}
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
      </div>

      {/* Right: Chat Window */}
      <div className="flex-1 bg-[#0B0E11] min-h-0 overflow-hidden">
        {selectedUser ? (
          <ChatWindow
            targetUserId={selectedUser.id}
            targetUsername={selectedUser.username}
            targetFullname={selectedUser.fullname}
            targetImage={selectedUser.image}
            onClose={() => setSelectedUser(null)}
            isStandalone={true}
            onMessageSent={() => handleMessageSent(selectedUser.id)}
          />
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-500">
            <svg className="w-24 h-24 mb-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-400 mb-2">Tin nhắn của bạn</h3>
            <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        )}
      </div>
    </div>
  )
}
