'use client'

import { useEffect, useState, useRef, ChangeEvent, ClipboardEvent } from 'react'
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

  // Tự động cuộn xuống cuối khi có tin nhắn mới hoặc đang nhập
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // --- 1. KHỞI TẠO HỘI THOẠI & REALTIME ---
  useEffect(() => {
    if (!currentUserId || !targetUserId) return
    let active = true

    // Dọn dẹp dữ liệu cũ ngay lập tức khi đổi targetUserId
    setMessages([])
    setSelectedFiles([])
    if (channelRef.current) supabase.removeChannel(channelRef.current)

    async function initChat() {
      try {
        const res = await fetch(`/api/messages?userId=${targetUserId}`)
        const data = await res.json()
        if (!active) return

        // data.messages từ backend (đã fix include messages: true)
        setMessages(data.messages || [])
        let cid = data.conversationId

        // Nếu chưa có hội thoại, gọi API tạo mới
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
          const channel = supabase
            .channel(`chat:${cid}`)
            .on('postgres_changes', {
              event: 'INSERT',
              schema: 'public',
              table: 'Message',
              filter: `conversationId=eq.${cid}`
            }, (payload) => {
              const newMsg = payload.new as Message
              setMessages(prev => prev.some(m => m.id === newMsg.id) ? prev : [...prev, newMsg])
            })
            .subscribe()
          channelRef.current = channel
        }
      } catch (err) {
        console.error("Lỗi khởi tạo chat:", err)
      }
    }

    initChat()
    return () => { active = false }
  }, [targetUserId, currentUserId])

  // --- 2. SOCKET.IO (TYPING) ---
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

  // --- 3. XỬ LÝ DÁN ẢNH (PASTE) ---
  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const items = e.clipboardData.items
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const blob = items[i].getAsFile()
        if (blob) {
          const file = new File([blob], `pasted-img-${Date.now()}.png`, { type: blob.type })
          setSelectedFiles(prev => [...prev, file])
        }
      }
    }
  }

  // --- 4. GỬI TIN NHẮN ---
  const sendMessage = async () => {
    if (!convIdRef.current || (!input.trim() && selectedFiles.length === 0)) return

    const formData = new FormData()
    formData.append('targetUserId', targetUserId)
    formData.append('content', input)
    selectedFiles.forEach(f => formData.append('files', f))

    // Reset UI nhanh
    setInput('')
    setSelectedFiles([])

    await fetch('/api/messages', { method: 'POST', body: formData })
  }

  const isImage = (url: string) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(url)

  return (
    <div className="fixed bottom-4 right-4 w-80 h-[500px] bg-gray-900 text-white rounded-lg shadow-2xl flex flex-col border border-gray-700">
      {/* Header */}
      <div className="p-3 bg-gray-800 border-b border-gray-700 flex justify-between items-center rounded-t-lg">
        <span className="text-sm font-bold truncate">Chat: {targetUserId.slice(-6)}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">✕</button>
      </div>

      {/* Danh sách tin nhắn */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 flex flex-col gap-3 scroll-smooth">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col ${m.senderId === currentUserId ? 'items-end' : 'items-start'}`}>
            <div className={`p-2 rounded-lg max-w-[90%] text-sm shadow-md ${
              m.senderId === currentUserId ? 'bg-blue-600 rounded-tr-none' : 'bg-gray-700 rounded-tl-none'
            }`}>
              {m.content && <p className="break-words mb-1">{m.content}</p>}
              {m.fileUrls?.map((url, idx) => (
                <div key={idx} className="mt-1">
                  {isImage(url) ? (
                    <img src={url} alt="chat-img" className="max-w-full rounded border border-black/20" />
                  ) : (
                    <a href={url} target="_blank" className="text-blue-200 underline text-[11px] block truncate">
                      📎 {m.fileNames?.[idx] || 'Tệp đính kèm'}
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        {isTyping && <div className="text-[10px] text-gray-400 italic animate-pulse">Đối phương đang nhập...</div>}
      </div>

      {/* Khu vực nhập liệu & Preview */}
      <div className="p-3 bg-gray-800 border-t border-gray-700">
        {/* Preview file/ảnh đã chọn */}
        {selectedFiles.length > 0 && (
          <div className="flex gap-2 overflow-x-auto mb-2 pb-1 border-b border-gray-700">
            {selectedFiles.map((f, i) => (
              <div key={i} className="relative flex-shrink-0">
                {f.type.startsWith('image/') ? (
                  <img src={URL.createObjectURL(f)} className="w-10 h-10 object-cover rounded border border-blue-500" alt="p" />
                ) : (
                  <div className="w-10 h-10 bg-gray-700 rounded text-[8px] flex items-center justify-center p-1 truncate">{f.name}</div>
                )}
                <button 
                  onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                  className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 text-[8px] flex items-center justify-center"
                >✕</button>
              </div>
            ))}
          </div>
        )}

        <div className="flex gap-2 items-center">
          <input
            className="flex-1 bg-gray-700 rounded-full px-4 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={input}
            onChange={(e) => {
              setInput(e.target.value)
              socketRef.current?.emit("typing", { senderId: currentUserId, conversationId: convIdRef.current })
            }}
            onPaste={handlePaste}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Aa... (Ctrl+V để dán ảnh)"
          />
          
          <label className="cursor-pointer text-gray-400 hover:text-blue-400">
            <input type="file" multiple className="hidden" onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))} />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32a1.5 1.5 0 11-2.121-2.121L16.31 6.31" />
            </svg>
          </label>

          <button onClick={sendMessage} className="bg-blue-600 hover:bg-blue-500 p-2 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
              <path d="M3.478 2.405a.75.75 0 00-.926.94l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.405z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}