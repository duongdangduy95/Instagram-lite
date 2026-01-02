'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

type Conversation = {
  id: string
  otherUser: {
    id: string
    username: string
    fullname: string | null
    image: string | null
  }
  lastMessage?: {
    content: string
    createdAt: string
  }
}

export default function ConversationList({
  onSelectConversation
}: {
  onSelectConversation: (user: {
    id: string
    username: string
    fullname: string | null
  }) => void
}) {
  const [conversations, setConversations] =
    useState<Conversation[]>([])

  useEffect(() => {
    fetch('/api/conversations')
      .then(res => res.json())
      .then(setConversations)
  }, [])

  return (
    <div className="w-80 border-r border-gray-800 bg-black overflow-y-auto">
      <div className="p-4 font-semibold border-b border-gray-800">
        Tin nhắn
      </div>

      {conversations.map(c => (
        <button
          key={c.id}
          onClick={() =>
            onSelectConversation({
              id: c.otherUser.id,
              username: c.otherUser.username,
              fullname: c.otherUser.fullname
            })
          }
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-900"
        >
          {/* AVATAR */}
          <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
            {c.otherUser.image ? (
              <Image
                src={c.otherUser.image}
                alt=""
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-bold">
                {(c.otherUser.fullname ||
                  c.otherUser.username)[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* TEXT */}
          <div className="flex-1 text-left">
            <div className="font-medium">
              {c.otherUser.fullname || c.otherUser.username}
            </div>
            <div className="text-xs text-gray-400 truncate">
              {c.lastMessage?.content || 'Bắt đầu trò chuyện'}
            </div>
          </div>
        </button>
      ))}
    </div>
  )
}
