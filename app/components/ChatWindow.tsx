'use client'

import { useEffect, useState, useRef, ChangeEvent } from 'react'
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

export default function ChatWindow({ targetUserId, onClose }: { targetUserId: string, onClose: () => void }) {
  const { data: session } = useSession()
  const currentUserId = session?.user?.id

  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [isTyping, setIsTyping] = useState(false)

  const convIdRef = useRef<string | null>(null)
  const socketRef = useRef<Socket | null>(null)
  const channelRef = useRef<any>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages, isTyping])

  // --- INIT CHAT & REALTIME ---
  useEffect(() => {
    if (!currentUserId || !targetUserId) return
    let active = true
    setMessages([]); if (channelRef.current) supabase.removeChannel(channelRef.current)

    async function initChat() {
      const res = await fetch(`/api/messages?userId=${targetUserId}`)
      const data = await res.json()
      if (!active) return

      setMessages(data.messages || [])
      let cid = data.conversationId

      if (!cid) {
        const resC = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetUserId })
        })
        const newC = await resC.json()
        cid = newC.id
      }

      convIdRef.current = cid
      if (cid) {
        const channel = supabase.channel(`chat:${cid}`)
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'Message', filter: `conversationId=eq.${cid}` }, 
          (payload) => {
            const newMsg = payload.new as Message
            setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
          }).subscribe()
        channelRef.current = channel
      }
    }
    initChat(); return () => { active = false }
  }, [targetUserId, currentUserId])

  // --- TYPING INDICATOR ---
  useEffect(() => {
    socketRef.current = io("http://localhost:4000")
    socketRef.current.on("typing", ({ senderId, conversationId }) => {
      if (senderId === targetUserId && conversationId === convIdRef.current) {
        setIsTyping(true)
        setTimeout(() => setIsTyping(false), 3000)
      }
    })
    return () => { socketRef.current?.disconnect() }
  }, [targetUserId])

  // --- SEND MESSAGE LOGIC ---
  const sendMessage = async () => {
    if (!convIdRef.current || (!input.trim() && selectedFiles.length === 0)) return

    const formData = new FormData()
    formData.append('targetUserId', targetUserId)
    formData.append('content', input)
    
    // Gửi đúng key 'files' để Backend nhận diện được mảng File[]
    selectedFiles.forEach(file => {
      formData.append('files', file)
    })

    setInput('')
    setSelectedFiles([])

    try {
      const res = await fetch('/api/messages', { method: 'POST', body: formData })
      if (!res.ok) console.error("Gửi thất bại")
    } catch (error) {
      console.error("Lỗi kết nối:", error)
    }
  }

  // Kiểm tra định dạng ảnh để hiển thị xem trước
  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[480px] bg-gray-900 text-white rounded-lg shadow-2xl flex flex-col border border-gray-700">
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center rounded-t-lg">
        <span className="text-sm font-bold truncate">Chat: {targetUserId.slice(-6)}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-3">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
            <div className={`p-2 rounded-lg max-w-[90%] text-sm ${
              m.senderId === currentUserId ? 'bg-blue-600' : 'bg-gray-700'
            }`}>
              {m.content && <p className="mb-1">{m.content}</p>}
              
              {/* Hiển thị File / Ảnh */}
              {m.fileUrls?.map((url, idx) => (
                <div key={idx} className="mt-2">
                  {isImage(url) ? (
                    <img src={url} alt="upload" className="max-w-full rounded border border-white/10" />
                  ) : (
                    <a href={url} target="_blank" className="flex items-center gap-1 text-[11px] text-blue-300 underline">
                      📎 {m.fileNames?.[idx] || 'Tệp tin'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-gray-400 italic">Đối phương đang nhập...</div>}
      </div>

      <div className="p-3 bg-gray-800 border-t border-gray-700">
        {selectedFiles.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {selectedFiles.map((f, i) => (
              <span key={i} className="text-[9px] bg-blue-900 px-1 rounded truncate max-w-[100px]">{f.name}</span>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <input
            className="flex-1 bg-gray-700 rounded-md px-3 py-1 text-sm focus:outline-none"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              socketRef.current?.emit("typing", { senderId: currentUserId, conversationId: convIdRef.current })
            }}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Aa..."
          />
          <label className="cursor-pointer p-1 hover:bg-gray-600 rounded">
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))} />
            📎
          </label>
          <button onClick={sendMessage} className="bg-blue-600 px-3 py-1 rounded text-sm font-bold">Gửi</button>
        </div>
      </div>
    </div>
  )
}