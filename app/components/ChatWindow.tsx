'use client'

import { useEffect, useState, useRef, ChangeEvent } from 'react'
import { io, Socket } from 'socket.io-client'
import { useSession } from 'next-auth/react'
import { supabase } from '@/lib/supabaseClientClient'

type Message = {
  fileNames: any
  id: string
  senderId: string
  content: string
  conversationId?: string
  fileUrls?: string[]
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

  const conversationIdRef = useRef<string | null>(null)
  const supabaseChannelRef = useRef<any>(null)
  const socketRef = useRef<Socket | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // ----------------- INIT CONVERSATION & SUPABASE REALTIME -----------------
  useEffect(() => {
    if (!currentUserId) return
    let active = true

    async function initConversation() {
      // 1️⃣ Lấy tin nhắn hiện có
      const res = await fetch(`/api/messages?userId=${targetUserId}`)
      const data: Message[] = await res.json()
      if (!active) return

      setMessages(data)
      let conversationId = data[0]?.conversationId

      // 2️⃣ Nếu chưa có conversation, tạo mới
      if (!conversationId) {
        const createRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId })
        })
        if (!createRes.ok) {
          console.error('Lỗi tạo conversation', await createRes.text())
          return
        }
        const conv = await createRes.json()
        conversationId = conv.id
      }

      conversationIdRef.current = conversationId

      // 3️⃣ Hủy channel cũ nếu có
      if (supabaseChannelRef.current) supabase.removeChannel(supabaseChannelRef.current)

      // 4️⃣ Subscribe Supabase Realtime
      const channel = supabase
        .channel(`chat:${conversationId}`)
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Message',
            filter: `conversationId=eq.${conversationId}`
          },
          (payload) => {
            const newMsg = payload.new as Message
            setMessages((prev) => {
              if (prev.find((m) => m.id === newMsg.id)) return prev
              return [...prev, newMsg]
            })
          }
        )
        .subscribe()

      supabaseChannelRef.current = channel
    }

    initConversation()
    return () => { active = false }
  }, [targetUserId, currentUserId])

  // ----------------- SOCKET.IO TYPING INDICATOR -----------------
  useEffect(() => {
    if (!currentUserId) return
    socketRef.current = io("http://localhost:4000")
    const socket = socketRef.current

    socket.on("connect", () => console.log("Socket connected:", socket.id))

    socket.on("typing", ({ senderId, conversationId }: { senderId: string, conversationId: string }) => {
      if (senderId === targetUserId && conversationId === conversationIdRef.current) {
        setIsTyping(true)
        if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
        typingTimeoutRef.current = setTimeout(() => setIsTyping(false), 1000)
      }
    })

    return () => socket.disconnect()
  }, [targetUserId, currentUserId])
   
  // ----------------- INPUT & FILE CHANGE -----------------
  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)
    if (conversationIdRef.current && currentUserId) {
      socketRef.current?.emit("typing", { senderId: currentUserId, conversationId: conversationIdRef.current })
    }
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setSelectedFiles(Array.from(e.target.files))
  }

  const sendMessage = async () => {
    if (!conversationIdRef.current || !currentUserId) return
    if (!input.trim() && selectedFiles.length === 0) return

    const formData = new FormData()
    formData.append('targetUserId', targetUserId)
    formData.append('content', input)
    selectedFiles.forEach(file => formData.append('files', file))

   const res = await fetch('/api/messages', { method: 'POST', body: formData })
if (!res.ok) return console.error('Failed to send message', await res.text())

const { message } = await res.json()
setMessages(prev => [...prev, message])

setInput('')
setSelectedFiles([])

    setInput('')
    setSelectedFiles([])
  }

  // ----------------- RENDER -----------------
  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 text-white rounded shadow-lg flex flex-col">
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`p-1 rounded max-w-full ${
              m.senderId === currentUserId ? 'bg-blue-600 self-end' : 'bg-gray-700 self-start'
            }`}
          >
            {m.content && <div>{m.content}</div>}
            {m.fileUrls?.map((url, idx) => (
  <a
    key={url}
    href={url}
    target="_blank"
    rel="noopener noreferrer"
    className="block text-blue-400 underline mt-1"
  >
    {m.fileNames?.[idx] || `Download file (${url.split('.').pop()})`}
  </a>
))}


          </div>
        ))}
        {isTyping && <div className="text-sm text-gray-300 italic">{targetUserId} is typing...</div>}
      </div>

      <div className="p-2 flex flex-col gap-1">
        <input
          type="text"
          className="flex-1 px-2 py-1 rounded text-black"
          value={input}
          onChange={handleInputChange}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Type a message..."
        />
        <input type="file" multiple onChange={handleFileChange} className="text-sm" />
        <button className="bg-blue-500 px-3 py-1 rounded mt-1" onClick={sendMessage}>
          Send
        </button>
      </div>

      <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white">
        X
      </button>
    </div>
  )
}
