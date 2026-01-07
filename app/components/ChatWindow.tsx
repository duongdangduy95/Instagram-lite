'use client'

import { useEffect, useState, useRef, ClipboardEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClientClient'
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

export default function ChatWindow({
  targetUserId,
  targetUsername,
  targetFullname,
  onClose,
  onSeen,
  isStandalone = false,
  onMessageSent
}: {
  targetUserId: string
  targetUsername: string
  targetFullname: string
  onClose: () => void
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

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const targetUserName =
    targetUsername || targetFullname || 'Người dùng'

  const [typingUserName, setTypingUserName] =
    useState<string | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(true)

  const convIdRef = useRef<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

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

    const res = await fetch('/api/messages', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: convIdRef.current
      })
    })

    const data = await res.json()

    // 🔥 TRỪ BADGE ĐÚNG SỐ TIN VỪA SEEN
    if (data.seenCount > 0) {
      onSeen?.(data.seenCount)
    }
  }


  /* ================= AUTO SEEN WHEN MESSAGE ARRIVES ================= */
  useEffect(() => {
    if (!isChatOpen || !isTabActive) return

    const hasUnread = messages.some(
      m =>
        m.senderId !== currentUserId &&
        m.status === 'DELIVERED'
    )


    if (hasUnread) {
      markSeen()
    }
  }, [messages, isChatOpen, isTabActive])

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

    setMessages([])
    setSelectedFiles([])
    if (channelRef.current)
      supabase.removeChannel(channelRef.current)

    async function initChat() {
      const res = await fetch(
        `/api/messages?userId=${targetUserId}`
      )
      const data = await res.json()
      if (!active) return

      setMessages(
        (data.messages || []).map((m: Message) => ({
          ...m,
          createdAt: normalizeCreatedAt(m.createdAt)
        }))
      )

      let cid = data.conversationId
      if (!cid) {
        const r = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId })
        })
        cid = (await r.json()).id
      }

      convIdRef.current = cid

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
            if (payload.eventType === 'INSERT') {
              const raw = payload.new as Message
              const msg = {
                ...raw,
                createdAt: normalizeCreatedAt(
                  raw.createdAt
                )
              }

              setMessages(prev =>
                prev.some(m => m.id === msg.id)
                  ? prev
                  : [...prev, msg]
              )
            }

            if (payload.eventType === 'UPDATE') {
              const raw = payload.new as Message
              setMessages(prev =>
                prev.map(m =>
                  m.id === raw.id
                    ? {
                      ...raw,
                      createdAt: normalizeCreatedAt(
                        raw.createdAt
                      )
                    }
                    : m
                )
              )
            }

            if (payload.eventType === 'DELETE') {
              const msg = payload.old as Message
              setMessages(prev =>
                prev.filter(m => m.id !== msg.id)
              )
            }
          }
        )
        .subscribe()

      channelRef.current = channel
    }

    initChat()
    return () => {
      active = false
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

    const form = new FormData()
    form.append('targetUserId', targetUserId)
    form.append('content', input)
    selectedFiles.forEach(f => form.append('files', f))

    setInput('')
    setSelectedFiles([])

    const res = await fetch('/api/messages', {
      method: 'POST',
      body: form
    })


    // Update convIdRef and setup channel if conversation was just created
    if (!convIdRef.current) {
      const data = await res.json()
      if (data.message?.conversationId) {
        const cid = data.message.conversationId
        convIdRef.current = cid

        // Setup realtime channel for the new conversation
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current)
        }

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
              if (payload.eventType === 'INSERT') {
                const raw = payload.new as Message
                const msg = {
                  ...raw,
                  createdAt: normalizeCreatedAt(raw.createdAt)
                }
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
      }
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

  const isImage = (url: string) =>
    /\.(png|jpg|jpeg|gif|webp|svg)$/i.test(url)

  /* ================= UI ================= */
  return (
    <div className={isStandalone
      ? "h-full bg-[#0B0E11] text-white flex flex-col border-l border-gray-800"
      : "fixed bottom-4 right-4 w-80 h-[500px] bg-gray-900 text-white rounded-lg flex flex-col border border-gray-700"
    }>
      {/* HEADER */}
      <div className={isStandalone
        ? "p-4 bg-[#1A1D21] border-b border-gray-800 flex justify-between items-center"
        : "p-3 bg-gray-800 flex justify-between"
      }>
        <span className={isStandalone ? "font-bold text-lg" : "font-bold text-sm"}>
          {targetUserName}
        </span>
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

      {/* MESSAGES */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-3 space-y-3"
      >
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
                className={`group flex flex-col ${m.senderId === currentUserId
                  ? 'items-end'
                  : 'items-start'
                  }`}
              >
                {m.senderId === currentUserId && (
                  <div className="hidden group-hover:flex gap-2 text-[10px] mb-1">
                    {m.content && (
                      <button
                        onClick={() => {
                          setEditingId(m.id)
                          setEditValue(m.content)
                        }}
                        className="text-blue-400"
                      >
                        Sửa
                      </button>
                    )}
                    <button
                      onClick={() =>
                        deleteMessage(m.id)
                      }
                      className="text-red-400"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                <div className={m.senderId === currentUserId
                  ? "bg-[#7565E6] p-2 rounded max-w-[90%]"
                  : "bg-gray-700 p-2 rounded max-w-[90%]"
                }>
                  {editingId === m.id ? (
                    <input
                      value={editValue}
                      onChange={e =>
                        setEditValue(e.target.value)
                      }
                      onKeyDown={e =>
                        e.key === 'Enter' &&
                        updateMessage(m.id)
                      }
                      className="bg-transparent outline-none w-full"
                    />
                  ) : (
                    m.content && <p>{m.content}</p>
                  )}

                  {m.fileUrls?.map((url, i) =>
                    isImage(url) ? (
                      <img
                        key={i}
                        src={url}
                        className="mt-1 rounded"
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
      <div className={isStandalone
        ? "p-4 bg-[#1A1D21] border-t border-gray-800"
        : "p-3 bg-gray-800"
      }>
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

        <div className="flex gap-2 items-center">
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
            className={isStandalone
              ? "flex-1 bg-[#262A2E] border border-gray-700 rounded-lg px-4 py-3 outline-none focus:border-[#7565E6]"
              : "flex-1 bg-gray-700 rounded px-3 py-1"
            }
            placeholder="Aa..."
          />

          <label className="cursor-pointer text-gray-400 hover:text-white">
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
            📎
          </label>

          <button
            onClick={sendMessage}
            className={isStandalone
              ? "bg-[#7565E6] hover:bg-[#6455C2] px-4 py-3 rounded-lg transition-colors"
              : "bg-blue-600 px-3 rounded"
            }
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
