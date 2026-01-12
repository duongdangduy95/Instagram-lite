'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type Notification = {
  id: string
  type: string
  isRead: boolean
  createdAt: string
  actor: { id: string; username: string; fullname: string; image?: string }
  blog?: { id: string }
  comment?: { id: string; blogId: string }
  message?: { id: string; conversationId: string }
}

type NotifContextType = {
  notifications: Notification[]
  unreadCount: number
  addNotification: (n: Notification) => void
}

const NotificationContext = createContext<NotifContextType>({
  notifications: [],
  unreadCount: 0,
  addNotification: () => {}
})

export const useNotifications = () => useContext(NotificationContext)

export function NotificationProvider({
  userId,
  children
}: {
  userId: string
  children: ReactNode
}) {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  // fetch initial notifications
  useEffect(() => {
    fetch('/api/notifications')
      .then(res => res.json())
      .then((data: Notification[]) => {
        const filtered = (Array.isArray(data) ? data : []).filter(n => n?.type !== 'MESSAGE')
        setNotifications(filtered)
        setUnreadCount(filtered.filter(n => !n.isRead).length)
      })
  }, [])

  // subscribe realtime
  useEffect(() => {
    if (!userId) return

    const channel = supabase
      .channel(`notifications-${userId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notification', filter: `userId=eq.${userId}` },
        payload => {
          const n = payload.new as Notification
          // Bỏ thông báo tin nhắn khỏi nút Thông báo (không add, không tăng unread, không toast)
          if ((n as any)?.type === 'MESSAGE') return
          setNotifications(prev => [n, ...prev])
          setUnreadCount(prev => prev + 1)

          // 🔔 Toast nhỏ hiển thị
          const toast = document.createElement('div')
          toast.innerText = `${n.actor.fullname} vừa ${
            n.type === 'FOLLOW'
              ? 'theo dõi bạn'
              : n.type === 'COMMENT_POST'
              ? 'bình luận bài viết của bạn'
              : n.type === 'LIKE_POST'
              ? 'thích bài viết của bạn'
              : n.type === 'NEW_POST'
              ? 'đăng bài mới'
              : 'có thông báo mới'
          }`
          toast.className =
            'fixed top-4 right-4 bg-blue-600 text-white px-3 py-2 rounded shadow z-50 animate-slidein'
          document.body.appendChild(toast)
          setTimeout(() => toast.remove(), 4000)
        }
      )
      .subscribe()

    return () => {
      // cleanup trong useEffect không được trả về Promise
      void supabase.removeChannel(channel)
    }
  }, [userId])

  const addNotification = (n: Notification) => {
    setNotifications(prev => [n, ...prev])
    setUnreadCount(prev => prev + 1)
  }

  return (
    <NotificationContext.Provider value={{ notifications, unreadCount, addNotification }}>
      {children}
    </NotificationContext.Provider>
  )
}
