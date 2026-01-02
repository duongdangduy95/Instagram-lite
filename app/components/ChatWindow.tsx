'use client'

import { useEffect, useState, useRef, ClipboardEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClientClient'

type Message = {
  id: string
  senderId: string
  content: string
  conversationId: string
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

  /* ===== PHẦN THÊM ===== */
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  /* ==================== */

  const convIdRef = useRef<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  /* ================= INIT CHAT ================= */
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
      convIdRef.current = data.conversationId
      const cid = data.conversationId
      if (data.conversationId) {
        channelRef.current = supabase
          .channel(`chat:${data.conversationId}`)
    .on(
  'postgres_changes',
  {
    event: '*',
    schema: 'public',
    table: 'Message',
    filter: `conversationId=eq.${cid}`
  },
  (payload) => {
    if (payload.eventType === 'INSERT') {
      const newMsg = payload.new as Message

      setMessages(prev =>
        prev.some(m => m.id === newMsg.id)
          ? prev
          : [...prev, newMsg]
      )
    }

    if (payload.eventType === 'UPDATE') {
      const updatedMsg = payload.new as Message

      setMessages(prev =>
        prev.map(m =>
          m.id === updatedMsg.id ? updatedMsg : m
        )
      )
    }

    if (payload.eventType === 'DELETE') {
      const deletedMsg = payload.old as Message

      setMessages(prev =>
        prev.filter(m => m.id !== deletedMsg.id)
      )
    }
  }
)

          .subscribe()
      }
    }

    initChat()
    return () => {
      active = false
    }
  }, [targetUserId, currentUserId])

  /* ================= SOCKET TYPING ================= */
  useEffect(() => {
    socketRef.current = io('http://localhost:4000')
    socketRef.current.on('typing', ({ senderId, conversationId }) => {
      if (
        senderId === targetUserId &&
        conversationId === convIdRef.current
      ) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      }
    })
    return () => {
      socketRef.current?.disconnect()
    }
  }, [targetUserId])

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.includes('image')) {
        const blob = items[i].getAsFile()
        if (blob) {
          setSelectedFiles((p) => [
            ...p,
            new File([blob], `paste-${Date.now()}.png`, {
              type: blob.type
            })
          ])
        }
      }
    }
  }

  /* ================= SEND ================= */
  const sendMessage = async () => {
    if (!convIdRef.current) return

    const form = new FormData()
    form.append('targetUserId', targetUserId)
    form.append('content', input)
    selectedFiles.forEach((f) => form.append('files', f))

    setInput('')
    setSelectedFiles([])

    await fetch('/api/messages', { method: 'POST', body: form })
  }

  /* ================= UPDATE / DELETE ================= */
  const updateMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id, content: editValue })
    })
    setEditingId(null)
  }

  const deleteMessage = async (id: string) => {
    await fetch('/api/messages', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messageId: id })
    })
  }

  const isTextOnly = (m: Message) =>
    m.content && (!m.fileUrls || m.fileUrls.length === 0)

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-900 text-white rounded-lg flex flex-col">
      <div className="flex-1 overflow-y-auto p-3" ref={scrollRef}>
        {messages.map((m) => {
          const mine = m.senderId === currentUserId
          return (
            <div key={m.id} className={`group mb-2 ${mine ? 'text-right' : ''}`}>
              <div className="relative inline-block bg-gray-700 p-2 rounded">
                {editingId === m.id ? (
                  <input
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && updateMessage(m.id)}
                    className="bg-transparent outline-none"
                  />
                ) : (
                  <p>{m.content}</p>
                )}

                {m.fileUrls?.map((u, i) => (
                  <a key={i} href={u} target="_blank" className="text-xs underline">
                    📎 {m.fileNames?.[i]}
                  </a>
                ))}

                {mine && (
                  <div className="absolute -top-4 right-0 hidden group-hover:flex gap-2 text-xs">
                    {isTextOnly(m) && (
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
              </div>
            </div>
          )
        })}
        {isTyping && <div className="text-xs italic">Đối phương đang nhập...</div>}
      </div>

      <input
        value={input}
        onChange={(e) => {
          setInput(e.target.value)
          socketRef.current?.emit('typing', {
            senderId: currentUserId,
            conversationId: convIdRef.current
          })
        }}
        onPaste={handlePaste}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        className="p-2 bg-gray-800 outline-none"
        placeholder="Nhập tin nhắn..."
      />
    </div>
  )
}
