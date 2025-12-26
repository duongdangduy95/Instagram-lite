'use client'
import { useEffect, useState } from 'react'

export default function ChatWindow({ targetUserId, onClose }: { targetUserId: string, onClose: () => void }) {
  const [messages, setMessages] = useState<{id:string, senderId:string, content:string}[]>([])
  const [input, setInput] = useState('')

  // Load tin nhắn khi mở chat
  useEffect(() => {
    async function loadMessages() {
      const res = await fetch(`/api/messages?userId=${targetUserId}`)
      const data = await res.json()
      setMessages(data)
    }
    loadMessages()
  }, [targetUserId])

  const sendMessage = async () => {
    if (!input.trim()) return
    const res = await fetch('/api/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetUserId, content: input }),
    })
    const newMessage = await res.json()
    setMessages((prev) => [...prev, newMessage])
    setInput('')
  }

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-gray-900 text-white rounded shadow-lg flex flex-col">
      <div className="flex-1 overflow-y-auto p-2">
        {messages.map((m) => (
          <div key={m.id} className={`my-1 p-1 rounded ${m.senderId === targetUserId ? 'bg-gray-700' : 'bg-blue-600 self-end'}`}>
            {m.content}
          </div>
        ))}
      </div>
      <div className="p-2 flex gap-2">
        <input
          className="flex-1 px-2 py-1 rounded text-black"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="bg-blue-500 px-3 py-1 rounded" onClick={sendMessage}>Send</button>
      </div>
      <button onClick={onClose} className="absolute top-1 right-1 text-gray-400 hover:text-white">X</button>
    </div>
  )
}
