'use client'

import { useNotifications } from './NotificationProvider'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

type NotificationItem = {
  id: string
  type: 'FOLLOW' | 'NEW_POST' | 'LIKE_POST' | 'COMMENT_POST' | 'SHARE_POST' | string
  isRead: boolean
  createdAt: string
  actor: { id: string; fullname: string; username: string; image?: string | null }
  blog?: { id: string } | null
  comment?: { id: string; blogId: string } | null
  message?: { id: string; conversationId: string } | null
}

export default function NotificationList() {
  const { notifications } = useNotifications()
  const filtered = (notifications || []).filter((n: any) => n?.type !== 'MESSAGE')
  const list = filtered as NotificationItem[]

  const getLink = (n: NotificationItem) => {
    switch (n.type) {
      case 'FOLLOW': return `/profile/${n.actor.id}`
      case 'NEW_POST': return n.blog ? `/post/${n.blog.id}` : '#'
      case 'LIKE_POST':
      case 'COMMENT_POST':
      case 'SHARE_POST':
        return n.comment ? `/post/${n.comment.blogId}` : n.blog ? `/post/${n.blog.id}` : '#'
      default: return '#'
    }
  }

  return (
    <div className="w-80 border border-gray-800 rounded shadow p-2 bg-[#0B0E11]">
      {list.length === 0 && <p className="text-gray-500">Không có thông báo</p>}
      <ul>
        {list.map(n => {
          const actorName = n?.actor?.username || n?.actor?.fullname || 'User'
          const text =
            n.type === 'FOLLOW' ? 'đã theo dõi bạn'
            : n.type === 'NEW_POST' ? 'đã đăng bài mới'
            : n.type === 'LIKE_POST' ? 'đã thích bài viết của bạn'
            : n.type === 'COMMENT_POST' ? 'đã bình luận bài viết của bạn'
            : n.type === 'SHARE_POST' ? 'đã chia sẻ bài viết của bạn'
            : 'Thông báo mới'

          return (
          <li key={n.id} className={`p-2 border-b border-gray-800 ${n.isRead ? '' : 'bg-[#212227]'}`}>
            <Link href={getLink(n)}>
              <div className="flex items-start gap-3">
                {n.actor.image ? (
                  <img src={n.actor.image} alt="" className="w-9 h-9 rounded-full object-cover" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center text-white">
                    {(actorName || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <div className="text-sm min-w-0 flex-1">
                  <div className="text-white leading-snug">
                    <span className={`${!n.isRead ? 'font-bold' : 'font-semibold'}`}>{actorName}</span>{' '}
                    <span className="text-gray-300 font-normal">{text}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="text-gray-400 text-xs">
                      {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                    </span>
                    {!n.isRead && <span className="w-2.5 h-2.5 bg-[#7565E6] rounded-full" />}
                  </div>
                </div>
              </div>
            </Link>
          </li>
          )
        })}
      </ul>
    </div>
  )
}
