'use client'

import { useState } from 'react'
import ChatWindow from '@/app/components/ChatWindow'
import ConversationList from './components/ConversationList'

export default function MessagesPage() {
  const [activeTarget, setActiveTarget] = useState<{
    id: string
    username: string
    fullname: string | null
  } | null>(null)

  return (
    <div className="flex h-screen ml-64 bg-black text-white">
      <ConversationList
        onSelectConversation={user =>
          setActiveTarget(user)
        }
      />

      {activeTarget && (
        <div className="flex-1">
          <ChatWindow
            targetUserId={activeTarget.id}
            targetUsername={activeTarget.username}
            targetFullname={activeTarget.fullname || ''}
            onClose={() => setActiveTarget(null)}
          />
        </div>
      )}
    </div>
  )
}
