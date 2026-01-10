'use client'

import { useEffect, useState, useRef, ClipboardEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClientClient'
import type { RealtimeChannel } from '@supabase/supabase-js'
import { formatTime, formatDate, isNewDay } from '@/lib/time'

type MessageStatus = 'SENT' | 'DELIVERED' | 'SEEN'

type Message = {
  id: string
  senderId: string
  content: string
  conversationId: string
  createdAt: string
  status: MessageStatus
  fileUrls?: string[]
  fileNames?: string[]
}

function normalizeCreatedAt(dateStr: string) {
  if (dateStr.endsWith('Z') || dateStr.includes('+')) return dateStr
  const local = new Date(dateStr)
  return new Date(
    local.getTime() - local.getTimezoneOffset() * 60000
  ).toISOString()
}

const isImage = (url: string) => /\.(png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url)

export default function ChatWindow({
  targetUserId,
  targetUsername,
  targetFullname,
  targetImage,
  onClose,
  showBackButton = false,
  onBack,
  onSeen,
  isStandalone = false,
  onMessageSent
}: {
  targetUserId: string
  targetUsername: string
  targetFullname: string
  targetImage?: string | null
  onClose: () => void
  showBackButton?: boolean
  onBack?: () => void
  onSeen?: (count: number) => void
  isStandalone?: boolean
  onMessageSent?: () => void
}) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isTabActive, setIsTabActive] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)

  const targetUserName =
    targetUsername || targetFullname || 'Người dùng'

  const [typingUserName, setTypingUserName] =
    useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(true)
  const [showInfo, setShowInfo] = useState(false)

  // Compute shared files from messages
  const sharedFiles = messages.flatMap(m =>
    (m.fileUrls || []).map((url, i) => ({
      url,
      name: m.fileNames?.[i] || 'File',
      type: isImage(url) ? 'image' : 'file'
    }))
  )

  const convIdRef = useRef<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<RealtimeChannel | null>(null)
  const channelConvIdRef = useRef<string | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const messagesCacheRef = useRef<Map<string, Message[]>>(new Map())
  const fetchAbortRef = useRef<AbortController | null>(null)
  const markingSeenRef = useRef(false)

  /* ================= TAB ACTIVE ================= */
  useEffect(() => {
    const handleVisibility = () =>
      setIsTabActive(!document.hidden)

    document.addEventListener(
      'visibilitychange',
      handleVisibility
    )
    return () =>
      document.removeEventListener(
        'visibilitychange',
        handleVisibility
      )
  }, [])

  /* ================= MARK SEEN ================= */
  const markSeen = async () => {
    if (!convIdRef.current) return
    if (!isChatOpen || !isTabActive) return
    if (markingSeenRef.current) return
    markingSeenRef.current = true

    try {
      const res = await fetch('/api/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: convIdRef.current
        })
      })

      const data = await res.json().catch(() => ({ seenCount: 0 }))
      const seenCount = Number(data?.seenCount || 0)

      // 🔥 TRỪ BADGE ĐÚNG SỐ TIN VỪA SEEN
      if (seenCount > 0) {
        onSeen?.(seenCount)
        // Đồng bộ badge ở Navigation (global) — chỉ trừ "Tin nhắn" navbar, không đụng notifications
        try {
          window.dispatchEvent(
            new CustomEvent('messages:seen', { detail: { seenCount } })
          )
        } catch {
          // ignore
        }
      }
    } finally {
      markingSeenRef.current = false
    }
  }


  /* ================= AUTO SEEN WHEN MESSAGE ARRIVES ================= */
  useEffect(() => {
    if (!isChatOpen || !isTabActive) return

    const hasUnread = messages.some(
      m =>
        m.senderId !== currentUserId &&
        m.status !== 'SEEN'
    )


    if (hasUnread) {
      markSeen()
    }
  }, [messages, isChatOpen, isTabActive, currentUserId])

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    const el = scrollRef.current
    if (!el || messages.length === 0) return

    const last = messages[messages.length - 1]

    el.scrollTo({
      top: el.scrollHeight,
      behavior:
        last.senderId === currentUserId
          ? 'smooth'
          : 'auto'
    })
  }, [messages, isTyping])

  /* ================= INIT CHAT + REALTIME ================= */
  useEffect(() => {
    if (!currentUserId || !targetUserId) return
    let active = true

    // Cache: hiển thị ngay tin nhắn đã tải lần trước để chuyển qua lại không bị "trống"
    const cached = messagesCacheRef.current.get(targetUserId)
    setMessages(cached ?? [])
    setSelectedFiles([])

    // Huỷ request cũ nếu đổi user nhanh
    fetchAbortRef.current?.abort()
    const abortController = new AbortController()
    fetchAbortRef.current = abortController

    // Reset convId + remove channel cũ chắc chắn để luôn resubscribe đúng
    convIdRef.current = null
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
      channelConvIdRef.current = null
    }

    async function initChat() {
      try {
        setIsLoading(true)
        setError(null)

        const res = await fetch(
          `/api/messages?userId=${targetUserId}`,
          { signal: abortController.signal }
        )

        if (!res.ok) {
          throw new Error(`Failed to load messages: ${res.statusText}`)
        }

        const data = await res.json()
        if (!active) return

        const nextMessages = (data.messages || []).map((m: Message) => ({
          ...m,
          createdAt: normalizeCreatedAt(m.createdAt)
        }))

        setMessages(nextMessages)
        messagesCacheRef.current.set(targetUserId, nextMessages)

        let cid = data.conversationId
        if (!cid) {
          const r = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ targetUserId })
          })

          if (!r.ok) {
            throw new Error(`Failed to create conversation: ${r.statusText}`)
          }

          cid = (await r.json()).id
        }

        convIdRef.current = cid

        // Đảm bảo remove channel cũ trước khi tạo mới (tránh duplicate)
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
          channelRef.current = null
          channelConvIdRef.current = null
        }

        // Nếu đã có channel đúng conversationId rồi thì thôi (tránh subscribe lặp)
        if (channelConvIdRef.current === cid && channelRef.current) return

        const channel = supabase
          .channel(`chat:${cid}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Message',
              filter: `conversationId=eq.${cid}`
            },
            payload => {
              if (!active) return // Bỏ qua nếu component đã unmount

              if (payload.eventType === 'INSERT') {
                const raw = payload.new as Message
                const msg = {
                  ...raw,
                  createdAt: normalizeCreatedAt(
                    raw.createdAt
                  )
                }

                // Kiểm tra duplicate trước khi thêm (bảo vệ kép)
                setMessages(prev =>
                  prev.some(m => m.id === msg.id) ? prev : (() => {
                    const merged = [...prev, msg]
                    messagesCacheRef.current.set(targetUserId, merged)
                    return merged
                  })()
                )
              }

              if (payload.eventType === 'UPDATE') {
                const raw = payload.new as Message
                setMessages(prev =>
                  (() => {
                    const merged = prev.map(m =>
                      m.id === raw.id
                        ? {
                          ...raw,
                          createdAt: normalizeCreatedAt(raw.createdAt)
                        }
                        : m
                    )
                    messagesCacheRef.current.set(targetUserId, merged)
                    return merged
                  })()
                )
              }

              if (payload.eventType === 'DELETE') {
                const msg = payload.old as Message
                setMessages(prev =>
                  (() => {
                    const merged = prev.filter(m => m.id !== msg.id)
                    messagesCacheRef.current.set(targetUserId, merged)
                    return merged
                  })()
                )
              }
            }
          )
          .subscribe()

        channelRef.current = channel
        channelConvIdRef.current = cid
      } catch (err) {
        // Khi đổi chat nhanh, request cũ bị abort là bình thường → không log/không setError
        const isAbort =
          (err instanceof DOMException && err.name === 'AbortError') ||
          abortController.signal.aborted
        if (isAbort) return

        console.error('Error initializing chat:', err)
        if (active) {
          setError(err instanceof Error ? err.message : 'Không thể tải tin nhắn')
        }
      } finally {
        if (active) setIsLoading(false)
      }
    }

    initChat()
    return () => {
      active = false
      const controller = fetchAbortRef.current
      fetchAbortRef.current = null
      // Abort request cũ để tránh race, nhưng đừng tạo console error
      if (controller && !controller.signal.aborted) {
        try {
          controller.abort()
        } catch {
          // ignore
        }
      }
      // Cleanup: remove channel khi component unmount hoặc dependencies thay đổi
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
        channelConvIdRef.current = null
      }
    }
  }, [targetUserId, currentUserId])

  /* ================= SOCKET TYPING ================= */
  useEffect(() => {
    socketRef.current = io('http://localhost:4000')

    socketRef.current.on(
      'typing',
      ({ senderId, senderName, conversationId }) => {
        if (
          senderId === targetUserId &&
          conversationId === convIdRef.current
        ) {
          setTypingUserName(senderName || targetUserName)
          setIsTyping(true)

          setTimeout(() => {
            setIsTyping(false)
            setTypingUserName(null)
          }, 3000)
        }
      }
    )

    return () => {
      socketRef.current?.disconnect()
    }
  }, [targetUserId, targetUserName])

  /* ================= PASTE IMAGE ================= */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile()
        if (file) {
          setSelectedFiles(prev => [
            ...prev,
            new File(
              [file],
              `paste-${Date.now()}.png`,
              { type: file.type }
            )
          ])
        }
      }
    }
  }

  /* ================= SEND ================= */
  const sendMessage = async () => {
    if (!input.trim() && selectedFiles.length === 0)
      return

    // Lưu input và files để restore nếu fail
    const savedInput = input
    const savedFiles = [...selectedFiles]

    const form = new FormData()
    form.append('targetUserId', targetUserId)
    form.append('content', input)
    selectedFiles.forEach(f => form.append('files', f))

    // Clear input ngay để UX tốt hơn (optimistic)
    setInput('')
    setSelectedFiles([])
    setIsSending(true)
    setError(null)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        body: form
      })

      if (!res.ok) {
        const errorText = await res.text().catch(() => '')
        // Server có thể trả JSON { error }, hoặc plain text
        let msg = errorText || `Gửi tin nhắn thất bại: ${res.statusText}`
        try {
          const parsed = errorText ? JSON.parse(errorText) : null
          if (parsed?.error) msg = parsed.error
        } catch {
          // ignore
        }
        throw new Error(msg)
      }

      const data = await res.json()
      const sentMessage = data.message
      const serverConversationId: string | undefined =
        sentMessage?.conversationId

      // Thêm message vào state ngay để hiển thị tức thì (optimistic update)
      if (sentMessage) {
        const msg: Message = {
          ...sentMessage,
          createdAt: normalizeCreatedAt(sentMessage.createdAt)
        }
        setMessages(prev =>
          prev.some(m => m.id === msg.id) ? prev : (() => {
            const merged = [...prev, msg]
            messagesCacheRef.current.set(targetUserId, merged)
            return merged
          })()
        )
      }

      // ✅ LUÔN đồng bộ conversationId theo server (tránh case DB có duplicate conversation)
      // Nếu convIdRef đang khác với serverConversationId, phải resubscribe theo cid mới,
      // nếu không sẽ miss realtime ở lần reply đầu tiên.
      if (serverConversationId && convIdRef.current !== serverConversationId) {
        convIdRef.current = serverConversationId

        // Đảm bảo remove channel cũ trước khi tạo mới (tránh duplicate)
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
          channelRef.current = null
          channelConvIdRef.current = null
        }

        // Setup realtime channel cho conversation đúng theo server
        const channel = supabase
          .channel(`chat:${serverConversationId}`)
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Message',
              filter: `conversationId=eq.${serverConversationId}`
            },
            payload => {
              if (payload.eventType === 'INSERT') {
                const raw = payload.new as Message
                const msg = {
                  ...raw,
                  createdAt: normalizeCreatedAt(raw.createdAt)
                }
                // Kiểm tra duplicate trước khi thêm
                setMessages(prev =>
                  prev.some(m => m.id === msg.id) ? prev : [...prev, msg]
                )
              }
              if (payload.eventType === 'UPDATE') {
                const raw = payload.new as Message
                setMessages(prev =>
                  prev.map(m =>
                    m.id === raw.id
                      ? { ...raw, createdAt: normalizeCreatedAt(raw.createdAt) }
                      : m
                  )
                )
              }
              if (payload.eventType === 'DELETE') {
                const msg = payload.old as Message
                setMessages(prev => prev.filter(m => m.id !== msg.id))
              }
            }
          )
          .subscribe()

        channelRef.current = channel
        channelConvIdRef.current = serverConversationId

        // ⛔ Không reload lại toàn bộ messages sau khi gửi:
        // - Rất chậm
        // - Dễ ghi đè state gây "hụt" tin nhắn
        // Supabase realtime + optimistic update là đủ.
      }
    } catch (error) {
      console.error('Error sending message:', error)
      // Restore input và files nếu gửi thất bại
      setInput(savedInput)
      setSelectedFiles(savedFiles)
      setError(error instanceof Error ? error.message : 'Không thể gửi tin nhắn')
    } finally {
      setIsSending(false)
    }

    // Notify parent component that message was sent
    onMessageSent?.()
  }

  /* ================= EDIT / DELETE ================= */
  const updateMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        messageId: id,
        content: editValue
      })
    })
    setEditingId(null)
    setEditValue('')
  }

  const deleteMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id })
    })
  }

  /* ================= UI ================= */
  return (
    <div className={isStandalone
      ? `h-full bg-[#0B0E11] text-white flex flex-row overflow-hidden min-h-0 ${showBackButton ? '' : 'border-l border-gray-800'}`
      : "fixed bottom-20 md:bottom-4 right-4 w-auto max-w-[90vw] h-[min(500px,calc(100dvh-6rem))] md:h-[500px] bg-[#0B0E11] text-white rounded-lg flex flex-row border border-gray-700 shadow-xl overflow-hidden min-h-0"
    }>
      {/* LEFT COLUMN: CHAT CONTENT */}
      <div className={`relative flex flex-col min-w-0 min-h-0 overflow-hidden transition-all duration-300 ${isStandalone ? 'flex-1' : 'w-80'}`}>
        {/* HEADER */}
        <div className={`${isStandalone ? "p-4" : "p-3"} bg-[#0B0E11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/80 border-b border-gray-800 flex items-center gap-3 shrink-0 ${isStandalone ? 'h-[72px]' : ''}`}>
          {showBackButton && (
            <button
              type="button"
              onClick={() => onBack?.()}
              className="p-2 -ml-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Quay lại"
              title="Quay lại"
            >
              ←
            </button>
          )}
          <div className="flex items-center gap-3 flex-1">
            {/* Avatar - show in both modes */}
            {targetImage ? (
              <img
                src={targetImage}
                alt={targetUserName}
                className={isStandalone ? "w-10 h-10 rounded-full object-cover" : "w-8 h-8 rounded-full object-cover"}
              />
            ) : (
              <div className={isStandalone
                ? "w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                : "w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold"
              }>
                {targetUserName?.charAt(0).toUpperCase()}
              </div>
            )}

            <span className={isStandalone ? "font-bold text-lg" : "font-bold text-sm"}>
              {targetUserName}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <img src="/icons/icons8-info.svg" className="w-6 h-6 invert" alt="Info" />
            </button>

            {!isStandalone && (
              <button
                onClick={() => {
                  setIsChatOpen(false)
                  onClose()
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div
          ref={scrollRef}
          className={`flex-1 min-h-0 overflow-y-auto p-3 space-y-3 scrollbar-win`}
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 mb-3">
              <div className="flex items-center justify-between">
                <p className="text-red-400 text-sm">{error}</p>
                <button
                  onClick={() => setError(null)}
                  className="text-red-400 hover:text-red-300"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && messages.length === 0 && (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7565E6]"></div>
            </div>
          )}

          {messages.map((m, index) => {
            const prev = messages[index - 1]

            return (
              <div key={m.id}>
                {isNewDay(
                  m.createdAt,
                  prev?.createdAt
                ) && (
                    <div className="flex justify-center my-3">
                      <span className="bg-gray-600 text-xs px-3 py-1 rounded-full text-gray-200">
                        {formatDate(m.createdAt)}
                      </span>
                    </div>
                  )}

                <div
                  className={`group flex gap-2 ${m.senderId === currentUserId
                    ? 'flex-row-reverse'
                    : 'flex-row'
                    }`}
                >
                  {/* Avatar for received messages */}
                  {m.senderId !== currentUserId && (
                    <div className="w-7 h-7 flex-shrink-0">
                      {/* Show avatar if: first message, sender changed, OR interrupted by date separator */}
                      {(!prev || prev.senderId !== m.senderId || isNewDay(m.createdAt, prev.createdAt)) ? (
                        targetImage ? (
                          <img
                            src={targetImage}
                            alt={targetUserName}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                            {targetUserName?.charAt(0).toUpperCase()}
                          </div>
                        )
                      ) : (
                        <div className="w-7 h-7" /> // Empty space to maintain alignment
                      )}
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div className={m.senderId === currentUserId
                    ? "bg-[#7565E6] p-3 rounded-2xl max-w-[90%] break-words whitespace-pre-wrap overflow-hidden"
                    : isStandalone
                      ? "bg-gray-700 p-3 rounded-2xl max-w-[90%] break-words whitespace-pre-wrap overflow-hidden"
                      : "bg-[#3E4042] p-3 rounded-2xl max-w-[90%] break-words whitespace-pre-wrap overflow-hidden"
                  } style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                    {editingId === m.id ? (
                      <input
                        value={editValue}
                        onChange={e =>
                          setEditValue(e.target.value)
                        }
                        onKeyDown={e => {
                          if (e.key === 'Enter') {
                            updateMessage(m.id)
                          }
                        }}
                        className="bg-transparent outline-none w-full"
                      />
                    ) : (
                      m.content && <p style={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>{m.content}</p>
                    )}

                    {m.fileUrls?.map((url, i) =>
                      isImage(url) ? (
                        <img
                          key={i}
                          src={url}
                          alt=""
                          className="mt-1 rounded"
                          loading="lazy"
                          onError={(e) => {
                            // Retry 1 lần: đôi khi Supabase public URL vừa upload cần vài nhịp mới sẵn sàng
                            const img = e.currentTarget
                            if (img.dataset.retried) return
                            img.dataset.retried = '1'
                            const sep = url.includes('?') ? '&' : '?'
                            img.src = `${url}${sep}t=${Date.now()}`
                          }}
                        />
                      ) : (
                        <a
                          key={i}
                          href={url}
                          target="_blank"
                          className="text-xs text-blue-300 block"
                        >
                          📎 {m.fileNames?.[i]}
                        </a>
                      )
                    )}

                    <div className="text-[10px] text-right mt-1 opacity-70 flex gap-1 justify-end items-center">
                      <span>
                        {formatTime(m.createdAt)}
                      </span>

                      {m.senderId === currentUserId && (
                        <span>
                          {m.status === 'SENT' && '✔'}
                          {m.status ===
                            'DELIVERED' && '✔✔'}
                          {m.status === 'SEEN' && (
                            <span className="text-white">
                              ✔✔
                            </span>
                          )}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3-Dot Menu (only for own messages) */}
                  {m.senderId === currentUserId && (
                    <div className="relative">
                      <button
                        onClick={() => setMenuOpenId(menuOpenId === m.id ? null : m.id)}
                        className="text-gray-400 hover:text-white p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
                          <circle cx="8" cy="2" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="14" r="1.5" />
                        </svg>
                      </button>

                      {/* Dropdown Menu */}
                      {menuOpenId === m.id && (
                        <div className="absolute right-0 top-0 mt-6 bg-[#262A2E] border border-gray-700 rounded-lg shadow-lg py-1 z-10 min-w-[100px]">
                          {m.content && (
                            <button
                              onClick={() => {
                                setEditingId(m.id)
                                setEditValue(m.content)
                                setMenuOpenId(null)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-white hover:bg-gray-700 transition-colors"
                            >
                              Sửa
                            </button>
                          )}
                          <button
                            onClick={() => {
                              deleteMessage(m.id)
                              setMenuOpenId(null)
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )
          })}

          {isTyping && typingUserName && (
            <div className="text-xs text-gray-400 italic">
              {typingUserName} đang nhập…
            </div>
          )}
        </div>



        {/* INPUT */}
        <div className="shrink-0 bg-[#0B0E11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/80 p-3 shadow-[0_-12px_24px_-18px_rgba(0,0,0,0.9)]">
          {selectedFiles.length > 0 && (
            <div className="flex gap-2 mb-2 overflow-x-auto">
              {selectedFiles.map((f, i) => (
                <div key={i} className="relative">
                  {f.type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(f)}
                      className="w-10 h-10 object-cover rounded"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-700 text-[8px] flex items-center justify-center rounded">
                      {f.name}
                    </div>
                  )}
                  <button
                    onClick={() =>
                      setSelectedFiles(prev =>
                        prev.filter(
                          (_, idx) => idx !== i
                        )
                      )
                    }
                    className="absolute -top-1 -right-1 bg-red-500 w-3 h-3 rounded-full text-[8px]"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Instagram-style Input */}
          <div className="flex items-center gap-3 border border-gray-700 rounded-full px-4 py-2">
            {/* File Attachment Icon */}
            <label className="cursor-pointer flex-shrink-0">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={e =>
                  e.target.files &&
                  setSelectedFiles(
                    Array.from(e.target.files)
                  )
                }
              />
              <svg width="20" height="20" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M27.75 1.875C28.3713 1.875 28.875 2.37868 28.875 3V7.125H33C33.6213 7.125 34.125 7.62868 34.125 8.25C34.125 8.87132 33.6213 9.375 33 9.375H28.875V13.5C28.875 14.1213 28.3713 14.625 27.75 14.625C27.1287 14.625 26.625 14.1213 26.625 13.5V9.375H22.5C21.8787 9.375 21.375 8.87132 21.375 8.25C21.375 7.62868 21.8787 7.125 22.5 7.125H26.625V3C26.625 2.37868 27.1287 1.875 27.75 1.875Z" fill="#877EFF" />
                <path fillRule="evenodd" clipRule="evenodd" d="M18 1.875L17.9139 1.875C14.4513 1.87498 11.7378 1.87497 9.62056 2.15962C7.45345 2.45098 5.74342 3.05899 4.4012 4.4012C3.05899 5.74342 2.45098 7.45345 2.15962 9.62056C1.87497 11.7378 1.87498 14.4513 1.875 17.9139V18.0861C1.87498 21.5487 1.87497 24.2622 2.15962 26.3794C2.45098 28.5465 3.05899 30.2566 4.4012 31.5988C5.74342 32.941 7.45345 33.549 9.62056 33.8404C11.7378 34.125 14.4513 34.125 17.9139 34.125H18.0861C21.5487 34.125 24.2622 34.125 26.3794 33.8404C28.5465 33.549 30.2566 32.941 31.5988 31.5988C32.941 30.2566 33.549 28.5465 33.8404 26.3794C34.125 24.2622 34.125 21.5487 34.125 18.0861V18C34.125 17.3787 33.6213 16.875 33 16.875C32.3787 16.875 31.875 17.3787 31.875 18C31.875 21.5673 31.8726 24.1297 31.6104 26.0796C31.6001 26.1566 31.5894 26.2323 31.5783 26.3068L27.4173 22.5619C25.4682 20.8076 22.5655 20.633 20.42 22.1407L19.9727 22.4551C19.2273 22.979 18.2131 22.8912 17.5688 22.2469L11.1342 15.8123C9.43111 14.1092 6.6992 14.0182 4.88657 15.6042L4.12646 16.2693C4.13329 13.5809 4.17186 11.5395 4.38956 9.92037C4.64737 8.00276 5.13771 6.84668 5.99219 5.99219C6.84668 5.13771 8.00276 4.64737 9.92037 4.38956C11.8703 4.12739 14.4327 4.125 18 4.125C18.6213 4.125 19.125 3.62132 19.125 3C19.125 2.37868 18.6213 1.875 18 1.875ZM4.38956 26.0796C4.64737 27.9972 5.13771 29.1533 5.99219 30.0078C6.84668 30.8623 8.00276 31.3526 9.92037 31.6104C11.8703 31.8726 14.4327 31.875 18 31.875C21.5673 31.875 24.1297 31.8726 26.0796 31.6104C27.9972 31.3526 29.1533 30.8623 30.0078 30.0078C30.3731 29.6425 30.6719 29.2221 30.9143 28.7106C30.856 28.6749 30.8001 28.6334 30.7474 28.586L25.9121 24.2343C24.7426 23.1817 23.001 23.0769 21.7138 23.9816L21.2665 24.296C19.6264 25.4485 17.3952 25.2553 15.9778 23.8379L9.54323 17.4033C8.67772 16.5378 7.28937 16.4915 6.36819 17.2976L4.12557 19.2598C4.12944 22.1826 4.15933 24.3672 4.38956 26.0796Z" fill="#877EFF" />
              </svg>
            </label>

            {/* Input Field */}
            <input
              value={input}
              onChange={e => {
                setInput(e.target.value)
                socketRef.current?.emit('typing', {
                  senderId: currentUserId,
                  senderName:
                    session?.user?.username ||
                    session?.user?.fullname ||
                    'Người dùng',
                  conversationId: convIdRef.current
                })
              }}
              onPaste={handlePaste}
              onKeyDown={e =>
                e.key === 'Enter' && sendMessage()
              }
              className="flex-1 bg-transparent border-none outline-none text-white placeholder-gray-500 text-sm"
              placeholder="Nhắn tin..."
            />

            {/* Send Button */}
            <button
              onClick={sendMessage}
              disabled={isSending || (!input.trim() && selectedFiles.length === 0)}
              className={`transition-opacity flex-shrink-0 ${isSending || (!input.trim() && selectedFiles.length === 0) ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
            >
              {isSending ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#877EFF]"></div>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20.33 3.66996C20.1408 3.48213 19.9035 3.35008 19.6442 3.28833C19.3849 3.22659 19.1135 3.23753 18.86 3.31996L4.23 8.19996C3.95867 8.28593 3.71891 8.45039 3.54099 8.67255C3.36307 8.89471 3.25498 9.16462 3.23037 9.44818C3.20576 9.73174 3.26573 10.0162 3.40271 10.2657C3.5397 10.5152 3.74754 10.7185 4 10.85L10.07 13.85L13.07 19.94C13.1906 20.1783 13.3751 20.3785 13.6029 20.518C13.8307 20.6575 14.0929 20.7309 14.36 20.73H14.46C14.7461 20.7089 15.0192 20.6023 15.2439 20.4239C15.4686 20.2456 15.6345 20.0038 15.72 19.73L20.67 5.13996C20.7584 4.88789 20.7734 4.6159 20.7132 4.35565C20.653 4.09541 20.5201 3.85762 20.33 3.66996ZM4.85 9.57996L17.62 5.31996L10.53 12.41L4.85 9.57996ZM14.43 19.15L11.59 13.47L18.68 6.37996L14.43 19.15Z" fill="#877EFF" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN: INFO SIDEBAR */}
      <div
        className={`bg-[#0B0E11] flex flex-col transition-[width,opacity] duration-300 ease-in-out ${showInfo ? 'w-72 opacity-100 border-l border-gray-800' : 'w-0 opacity-0 overflow-hidden'
          }`}
      >
        {/* Sidebar Header */}
        <div className={`p-4 border-b border-gray-800 flex items-center justify-between bg-[#0B0E11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/80 shrink-0 ${isStandalone ? 'h-[72px]' : ''}`}>
          <h2 className="font-bold text-lg truncate">Chi tiết</h2>
          <button
            onClick={() => setShowInfo(false)}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 scrollbar-win">
          {/* User Profile */}
          <div className="flex flex-col items-center mb-8">
            {targetImage ? (
              <img
                src={targetImage}
                alt={targetUserName}
                className="w-20 h-20 rounded-full object-cover mb-3"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl font-bold mb-3">
                {targetUserName?.charAt(0).toUpperCase()}
              </div>
            )}
            <h3 className="text-xl font-bold">{targetUserName}</h3>
            {targetFullname && <p className="text-gray-400 text-sm mt-1">{targetFullname}</p>}

            {/* Follow Status (Mock) */}
            <div className="mt-4 px-4 py-1.5 bg-gray-800 rounded-lg text-sm font-medium text-gray-300">
              Trạng thái: Đang theo dõi
            </div>
          </div>

          {/* Shared Files Section */}
          <div className="border-t border-gray-800 pt-4">
            <h4 className="font-bold mb-4 text-sm text-gray-400 uppercase tracking-wider">File đã chia sẻ</h4>

            {sharedFiles.length === 0 ? (
              <p className="text-center text-gray-500 text-sm py-4">Chưa có file nào</p>
            ) : (
              <div className="grid grid-cols-3 gap-2">
                {sharedFiles.map((file, i) => (
                  file.type === 'image' ? (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      className="aspect-square block relative group rounded-lg overflow-hidden border border-gray-800 bg-gray-900"
                    >
                      <img
                        src={file.url}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </a>
                  ) : (
                    <a
                      key={i}
                      href={file.url}
                      target="_blank"
                      className="aspect-square rounded-lg border border-gray-800 bg-gray-900 hover:bg-gray-800 transition flex flex-col items-center justify-center p-2"
                    >
                      <span className="text-2xl mb-2">📄</span>
                      <span className="text-[10px] text-gray-400 truncate w-full text-center">{file.name}</span>
                    </a>
                  )
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
