// app/messages/page.tsx
'use client'

import ChatButton from '../components/ChatButton'
import ChatWindow from '../components/ChatWindow'

export default function MessagesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tin nhắn</h1>
      <ChatButton />
      <ChatWindow targetUserId={''} onClose={function (): void {
        throw new Error('Function not implemented.')
      } } />
    </div>
  )
}
