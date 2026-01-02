'use client'

import { useEffect, useState, useRef, ClipboardEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClientClient'
import { formatTime, formatDate, isNewDay } from '@/lib/time'

type Message = {
  id: string
  senderId: string
  content: string
  conversationId: string
  createdAt: string
  fileUrls?: string[]
  fileNames?: string[]
}

export default function ChatWindow({
  targetUserId,
  onClose
}: {
  targetUserId: string
  onClose: () => void
}) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  const convIdRef = useRef<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  /* ================= AUTO SCROLL ================= */
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth'
    })
  }, [messages, isTyping])

  /* ================= INIT CHAT + REALTIME ================= */
  useEffect(() => {
    if (!currentUserId || !targetUserId) return
    let active = true

    setMessages([])
    setSelectedFiles([])
    if (channelRef.current) supabase.removeChannel(channelRef.current)

    async function initChat() {
      const res = await fetch(`/api/messages?userId=${targetUserId}`)
      const data = await res.json()
      if (!active) return

      setMessages(data.messages || [])

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

  const msg: Message = {
    ...raw,
    createdAt: raw.createdAt.endsWith('Z')
      ? raw.createdAt
      : raw.createdAt + 'Z' // ✅ ÉP UTC
  }

  setMessages(prev =>
    prev.some(m => m.id === msg.id)
      ? prev
      : [...prev, msg]
  )
}


            if (payload.eventType === 'UPDATE') {
              const msg = payload.new as Message
              setMessages(prev =>
                prev.map(m => (m.id === msg.id ? msg : m))
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
      ({ senderId, conversationId }) => {
        if (
          senderId === targetUserId &&
          conversationId === convIdRef.current
        ) {
          setIsTyping(true)
          setTimeout(() => setIsTyping(false), 3000)
        }
      }
    )
    return () => {
      socketRef.current?.disconnect()
    }
  }, [targetUserId])

  /* ================= PASTE IMAGE ================= */
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    for (const item of e.clipboardData.items) {
      if (item.type.startsWith('image')) {
        const file = item.getAsFile()
        if (file) {
          setSelectedFiles(prev => [
            ...prev,
            new File([file], `paste-${Date.now()}.png`, {
              type: file.type
            })
          ])
        }
      }
    }
  }

  /* ================= SEND ================= */
  const sendMessage = async () => {
    if (!convIdRef.current) return
    if (!input.trim() && selectedFiles.length === 0) return

    const form = new FormData()
    form.append('targetUserId', targetUserId)
    form.append('content', input)
    selectedFiles.forEach(f => form.append('files', f))

    setInput('')
    setSelectedFiles([])

    await fetch('/api/messages', {
      method: 'POST',
      body: form
    })
  }

  /* ================= EDIT / DELETE ================= */
  const updateMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id, content: editValue })
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
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-900 text-white rounded-lg flex flex-col border border-gray-700">
      {/* HEADER */}
      <div className="p-3 bg-gray-800 flex justify-between">
        <span className="font-bold text-sm">
          Chat {targetUserId.slice(-6)}
        </span>
        <button onClick={onClose}>✕</button>
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
              {/* ===== DATE DIVIDER (THÊM) ===== */}
              {isNewDay(m.createdAt, prev?.createdAt) && (
                <div className="flex justify-center my-3">
                  <span className="bg-gray-600 text-xs px-3 py-1 rounded-full text-gray-200">
                    {formatDate(m.createdAt)}
                  </span>
                </div>
              )}

              <div
                className={`group flex flex-col ${
                  m.senderId === currentUserId
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
                      onClick={() => deleteMessage(m.id)}
                      className="text-red-400"
                    >
                      Xóa
                    </button>
                  </div>
                )}

                <div className="bg-gray-700 p-2 rounded max-w-[90%]">
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

                  {/* ===== TIME (THÊM) ===== */}
                  <div className="text-[10px] text-right mt-1 opacity-70">
                    {formatTime(m.createdAt)}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {isTyping && (
          <div className="text-xs text-gray-400 italic">
            Đối phương đang nhập...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-3 bg-gray-800">
        {/* PREVIEW FILE */}
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
                      prev.filter((_, idx) => idx !== i)
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
                conversationId: convIdRef.current
              })
            }}
            onPaste={handlePaste}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-gray-700 rounded px-3 py-1"
            placeholder="Aa..."
          />

          <label className="cursor-pointer text-gray-400">
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
            className="bg-blue-600 px-3 rounded"
          >
            ➤
          </button>
        </div>
      </div>
    </div>
  )
}
