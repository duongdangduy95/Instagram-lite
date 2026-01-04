'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'
import { createClient } from '@supabase/supabase-js'
import { formatDistanceToNow } from 'date-fns'

const iconSize = 22

const navItems = [
  { label: 'Trang chủ', href: '/home', icon: '/icons/home.svg' },
  { label: 'Tìm kiếm', href: '/search', icon: '/icons/icons8-search-50-2.svg' },
  { label: 'Khám phá', href: '/explore', icon: '/icons/explore-tool-svgrepo-com.svg' },
  { label: 'Tin nhắn', href: '/messages', icon: '/icons/send-svgrepo-com.svg' },
  { label: 'Tạo bài viết mới', href: '/blog/create', icon: '/icons/edit.svg' },
]

// 🔴 Supabase Realtime
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const displayName = user?.fullname || user?.username || 'User'
  const userInitial = displayName.charAt(0).toUpperCase()
  const userImage = user?.image ?? null

  // 🔵 Settings dropdown
  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  // 🟢 Notifications dropdown
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotif, setLoadingNotif] = useState(false)

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.id) return
    setLoadingNotif(true)
    try {
      const res = await fetch('/api/notifications')
      const data = await res.json()
      setNotifications(data)
    } catch (err) {
      console.error('Error fetching notifications', err)
    } finally {
      setLoadingNotif(false)
    }
  }

  // Toggle dropdown outside click / escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      if (settingsOpen && settingsRef.current && !settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false)
        setSettingsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [notifOpen, settingsOpen])

  // Realtime subscription to Supabase notifications
  useEffect(() => {
    if (!user?.id) return
    fetchNotifications()

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notification', filter: `userId=eq.${user.id}` },
        (payload) => {
          setNotifications(prev => [payload.new, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  // Map notification type -> link + text
  const getNotifLinkAndText = (n: any) => {
    let href = '#'
    let text = ''
    switch (n.type) {
      case 'FOLLOW':
        href = `/profile/${n.actor.id}`
        text = `${n.actor.fullname || n.actor.username} đã theo dõi bạn`
        break
      case 'NEW_POST':
        href = `/blog/${n.blog?.id}`
        text = `${n.actor.fullname || n.actor.username} đã đăng bài mới`
        break
      case 'LIKE_POST':
        href = `/blog/${n.blog?.id}`
        text = `${n.actor.fullname || n.actor.username} đã thích bài viết của bạn`
        break
      case 'COMMENT_POST':
        href = `/blog/${n.blog?.id}`
        text = `${n.actor.fullname || n.actor.username} đã bình luận bài viết của bạn`
        break
      case 'SHARE_POST':
        href = `/blog/${n.blog?.id}`
        text = `${n.actor.fullname || n.actor.username} đã chia sẻ bài viết của bạn`
        break
      case 'MESSAGE':
        href = `/messages?conversationId=${n.message?.conversationId}`
        text = `${n.actor.fullname || n.actor.username} đã gửi bạn tin nhắn`
        break
      default:
        text = 'Thông báo mới'
    }
    return { href, text }
  }

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-[#0B0E11] border-r border-gray-800 z-50">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white mb-6 px-2">
          InstaClone
        </Link>

        {/* Profile */}
        {user && (
          <Link
            href="/profile"
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-4 border-b border-gray-800 pb-4 ${pathname === '/profile'
              ? 'text-white font-semibold bg-gray-900'
              : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
              {userImage ? (
                <Image src={userImage} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <span className="text-white font-bold text-sm">{userInitial}</span>
              )}
            </div>
            <span className="text-white font-medium">{displayName}</span>
          </Link>
        )}

        {/* Menu */}
        <div className="flex flex-col space-y-2">
          {navItems.map(item => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${isActive
                  ? 'text-white font-semibold bg-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
              >
                <div className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                  <Image
                    src={item.icon}
                    alt={item.label}
                    width={iconSize}
                    height={iconSize}
                    className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                  />
                </div>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>

        {/* Notifications & Settings */}
        <div className="mt-auto mb-4 space-y-2">

          {/* Notifications */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => setNotifOpen(v => !v)}
              className="group flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
            >
              <div className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/icons/notification-13-svgrepo-com.svg"
                  alt="Thông báo"
                  width={iconSize}
                  height={iconSize}
                  className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
              </div>
              <span>
                Thông báo {notifications.filter(n => !n.isRead).length > 0 ? `(${notifications.filter(n => !n.isRead).length})` : ''}
              </span>
            </button>

            {notifOpen && (
              <div className="absolute left-0 bottom-12 w-80 max-h-96 overflow-y-auto bg-[#0B0E11] border border-gray-800 rounded-lg shadow-xl z-50">
                {loadingNotif && <div className="p-4 text-gray-300">Đang tải...</div>}
                {!loadingNotif && notifications.length === 0 && (
                  <div className="p-4 text-gray-300">Chưa có thông báo</div>
                )}
                {!loadingNotif && notifications.map(n => {
                  const { href, text } = getNotifLinkAndText(n)
                  return (
                    <Link
                      key={n.id}
                      href={href}
                      onClick={() => setNotifOpen(false)}
                      className="block px-4 py-3 text-sm border-b border-gray-800 hover:bg-gray-900 hover:text-white transition-colors flex justify-between"
                    >
                      <span>{text}</span>
                      <span className="text-gray-400 text-xs">
                        {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                      </span>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen(v => !v)}
              className="group flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
            >
              <div className="w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/icons/icons8-setting-50.svg"
                  alt="Cài đặt"
                  width={iconSize}
                  height={iconSize}
                  className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
              </div>
              <span>Cài đặt</span>
            </button>

            {settingsOpen && (
              <div className="absolute left-0 bottom-12 w-56 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                <Link
                  href="/settings/profile"
                  className={`block px-4 py-3 text-sm transition-colors ${pathname.startsWith('/settings/profile')
                    ? 'text-white bg-gray-900'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`}
                  onClick={() => setSettingsOpen(false)}
                >
                  Chỉnh sửa trang cá nhân
                </Link>
                <Link
                  href="/settings/security"
                  className={`block px-4 py-3 text-sm transition-colors ${pathname.startsWith('/settings/security')
                    ? 'text-white bg-gray-900'
                    : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                    }`}
                  onClick={() => setSettingsOpen(false)}
                >
                  Bảo mật
                </Link>
              </div>
            )}
          </div>

          {/* Logout */}
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            className="group flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-colors w-full"
          >
            <Image
              src="/icons/logout.svg"
              alt="Đăng xuất"
              width={iconSize}
              height={iconSize}
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
            <span>Đăng xuất</span>
          </button>

        </div>
      </div>
    </nav>
  )
}
