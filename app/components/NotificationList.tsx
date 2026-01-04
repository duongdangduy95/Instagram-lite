'use client'

import { useNotifications } from './NotificationProvider'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

export default function NotificationList() {
  const { notifications } = useNotifications()

  const getLink = (n: any) => {
    switch (n.type) {
      case 'FOLLOW': return `/profile/${n.actor.id}`
      case 'NEW_POST': return n.blog ? `/post/${n.blog.id}` : '#'
      case 'LIKE_POST':
      case 'COMMENT_POST':
      case 'SHARE_POST':
        return n.comment ? `/post/${n.comment.blogId}` : n.blog ? `/post/${n.blog.id}` : '#'
      case 'MESSAGE': return n.message ? `/messages/${n.message.conversationId}` : '#'
      default: return '#'
    }
  }

  return (
    <div className="w-80 border rounded shadow p-2 bg-white">
      {notifications.length === 0 && <p className="text-gray-500">Không có thông báo</p>}
      <ul>
        {notifications.map(n => (
          <li key={n.id} className={`p-2 border-b ${n.isRead ? '' : 'bg-blue-50'}`}>
            <Link href={getLink(n)}>
              <div className="flex items-center gap-2">
                {n.actor.image ? (
                  <img src={n.actor.image} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center text-white">
                    {n.actor.fullname[0]}
                  </div>
                )}
                <div className="text-sm">
                  {n.type === 'FOLLOW' && <span><b>{n.actor.fullname}</b> đã theo dõi bạn</span>}
                  {n.type === 'NEW_POST' && <span><b>{n.actor.fullname}</b> vừa đăng bài mới</span>}
                  {n.type === 'LIKE_POST' && <span><b>{n.actor.fullname}</b> thích bài viết của bạn</span>}
                  {n.type === 'COMMENT_POST' && <span><b>{n.actor.fullname}</b> bình luận bài viết của bạn</span>}
                  {n.type === 'SHARE_POST' && <span><b>{n.actor.fullname}</b> chia sẻ bài viết của bạn</span>}
                  {n.type === 'MESSAGE' && <span><b>{n.actor.fullname}</b> đã nhắn tin cho bạn</span>}
                  <div className="text-gray-400 text-xs">
                    {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                  </div>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
