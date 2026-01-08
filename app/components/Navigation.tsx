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
   const [messageBadge, setMessageBadge] = useState(0)

  // 🟢 Notifications dropdown
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)
  const [notifications, setNotifications] = useState<any[]>([])
  const [loadingNotif, setLoadingNotif] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
  useEffect(() => {
  if (!user?.id) return

  const channel = supabase
    .channel(`message-badge-${user.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'Message'
      },
      payload => {
        const msg = payload.new as any

        // ❗ chỉ cộng khi:
        // - người nhận là mình
        // - chưa SEEN
        if (
          msg.senderId !== user.id &&
          msg.status === 'SENT'
        ) {
          setMessageBadge(prev => prev + 1)
        }
      }
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [user?.id])

  // Toggle dropdown outside click / escape
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (notifOpen && notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false)
      // Mobile menu close on outside
      const target = e.target as Node
      if (mobileMenuOpen && !((target as HTMLElement)?.closest?.('[data-mobile-menu-root]'))) {
        setMobileMenuOpen(false)
      }
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setNotifOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    window.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      window.removeEventListener('keydown', handleKey)
    }
  }, [notifOpen, mobileMenuOpen])

  //Realtime subscription to Supabase notifications
  useEffect(() => {
    if (!user?.id) return
    fetchNotifications()

    const channel = supabase
      .channel(`notifications-${user.id}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'Notification', filter: `userId=eq.${user.id}` },
        async () => {
          await fetchNotifications()
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
    <>
      {/* ============ MOBILE TOP BAR ============ */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0B0E11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/80 border-b border-gray-800 z-50">
        <div className="h-full px-4 flex items-center justify-between">
          <Link href="/home" className="text-lg font-bold text-white">
            InstaClone
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/search"
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Tìm kiếm"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                  stroke="#877EFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.5 16.5 21 21"
                  stroke="#877EFF"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>

            {/* Notifications (mobile) */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => setNotifOpen(v => !v)}
                className="p-2 rounded-full hover:bg-white/10 transition-colors relative"
                aria-label="Thông báo"
              >
                <Image
                  src="/icons/notification-13-svgrepo-com.svg"
                  alt="Thông báo"
                  width={22}
                  height={22}
                />
                {notifications.some(n => !n.isRead) && (
                  <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full" />
                )}
              </button>

              {notifOpen && (
                <div className="absolute right-0 top-12 w-[min(92vw,360px)] max-h-[70vh] overflow-y-auto scrollbar-win bg-[#0B0E11] border border-gray-800 rounded-lg shadow-xl z-50">
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
                        onClick={async () => {
                          setNotifOpen(false)
                          if (!n.isRead) {
                            try {
                              await fetch(`/api/notifications/${n.id}`, { method: 'PATCH' })
                              setNotifications(prev => prev.map(x => (x.id === n.id ? { ...x, isRead: true } : x)))
                            } catch (err) {
                              console.error('Error marking notification read', err)
                            }
                          }
                        }}
                        className={`block px-4 py-3 text-sm border-b border-gray-800 hover:bg-gray-900 hover:text-white transition-colors ${
                          !n.isRead ? 'bg-gray-900' : ''
                        }`}
                      >
                        <div className="flex justify-between gap-3">
                          <span className="min-w-0">
                            <span className={`${!n.isRead ? 'font-bold' : ''}`}>
                              {n.actor.fullname || n.actor.username}
                            </span>{' '}
                            <span className="font-normal">{text.replace(n.actor.fullname || n.actor.username, '')}</span>
                          </span>
                          <span className="text-gray-400 text-xs whitespace-nowrap">
                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                          </span>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ============ TABLET/DESKTOP SIDEBAR ============ */}
      <nav className="hidden md:block fixed left-0 top-0 h-full bg-[#0B0E11] border-r border-gray-800 z-50 w-20 lg:w-64">
        <div className="flex flex-col h-full px-3 lg:px-4 py-6">
          {/* Logo */}
          <Link href="/home" className="text-2xl font-bold text-white mb-6 px-2 hidden lg:block">
            InstaClone
          </Link>
          <Link href="/home" className="text-white mb-6 px-2 lg:hidden flex justify-center">
            <Image src="/icons/favicon.ico" alt="Insta" width={28} height={28} />
          </Link>

        {/* Profile */}
        {user && (
          <Link
            href="/profile"
            className={`flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2 rounded-lg transition-colors mb-4 border-b border-gray-800 pb-4 ${pathname === '/profile'
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
            <span className="text-white font-medium hidden lg:inline">{displayName}</span>
          </Link>
        )}

        {/* Menu */}
        <div className="flex flex-col space-y-2">
          {navItems.map(item => {
  const isActive = pathname === item.href
  const isMessage = item.href === '/messages'
  const isHome = item.href === '/home'

  return (
    <Link
      key={item.href}
      href={item.href}
      className={`group relative flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2 rounded-lg ${
        isHome 
          ? 'lg:transition-colors' 
          : 'transition-colors'
      } ${
        isActive
          ? 'text-white font-semibold bg-gray-900'
          : isHome
          ? 'text-gray-400 lg:hover:text-white lg:hover:bg-gray-800'
          : 'text-gray-400 hover:text-white hover:bg-gray-800'
      }`}
    >
      <div className="relative w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
        <Image
          src={item.icon}
          alt={item.label}
          width={iconSize}
          height={iconSize}
        />

        {/* 🔴 BADGE TIN NHẮN */}
        {isMessage && messageBadge > 0 && (
          <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1
            text-[11px] font-bold text-white bg-red-500
            rounded-full flex items-center justify-center">
            {messageBadge}
          </span>
        )}
      </div>

      <span className="hidden lg:inline">{item.label}</span>
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
              className="group flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors w-full"
            >
              <div className="relative w-[22px] h-[22px] flex items-center justify-center flex-shrink-0">
                <Image
                  src="/icons/notification-13-svgrepo-com.svg"
                  alt="Thông báo"
                  width={iconSize}
                  height={iconSize}
                  className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
                />
                {/* 🔴 BADGE THÔNG BÁO - chỉ hiện số */}
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1
                    text-[11px] font-bold text-white bg-red-500
                    rounded-full flex items-center justify-center">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </div>
              {/* Text chỉ hiện ở desktop full (lg trở lên), ẩn hoàn toàn ở nấc 2 (icon-only) */}
              <span className="hidden md:hidden lg:inline">
                Thông báo {notifications.filter(n => !n.isRead).length > 0 && `(${notifications.filter(n => !n.isRead).length})`}
              </span>
            </button>

            {notifOpen && (
              <div className="absolute left-full ml-2 bottom-0 lg:left-0 lg:ml-0 lg:bottom-12 w-80 max-h-96 overflow-y-auto scrollbar-win bg-[#0B0E11] border border-gray-800 rounded-lg shadow-xl z-50">
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
                      onClick={async () => {
                        setNotifOpen(false);

                        // Nếu xem -> cập nhật isRead = true
                        if (!n.isRead) {
                          try {
                            await fetch(`/api/notifications/${n.id}`, {
                              method: 'PATCH',
                            });
                            // Cập nhật local state
                            setNotifications(prev =>
                              prev.map(x => (x.id === n.id ? { ...x, isRead: true } : x))
                            );
                          } catch (err) {
                            console.error('Error marking notification read', err);
                          }
                        }
                      }}
                      className={`block px-4 py-3 text-sm border-b border-gray-800 hover:bg-gray-900 hover:text-white transition-colors flex justify-between ${
                        !n.isRead ? 'bg-gray-900' : ''
                      }`}
                    >
                      <span>
                        <span className={`${!n.isRead ? 'font-bold' : ''}`}>
                          {n.actor.fullname || n.actor.username}
                        </span>{' '}
                        <span className="font-normal">{text.replace(n.actor.fullname || n.actor.username, '')}</span>
                      </span>
                      
                      <span className="flex items-center justify-end space-x-2">
                        <span className="text-gray-400 text-xs">
                          {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                        </span>
                        {!n.isRead && (
                          <span className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></span>
                        )}
                      </span>

                    </Link>

                  )
                })}
              </div>
            )}
          </div>

          {/* Settings */}
          <Link
            href="/settings/profile"
            className={`group flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2 rounded-lg transition-colors w-full ${
              pathname.startsWith('/settings')
                ? 'text-white font-semibold bg-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
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
            <span className="hidden lg:inline">Cài đặt</span>
          </Link>

          {/* Logout */}
          <button
            onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
            className="group flex items-center justify-center lg:justify-start lg:space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-gray-800 transition-colors w-full"
          >
            <Image
              src="/icons/logout.svg"
              alt="Đăng xuất"
              width={iconSize}
              height={iconSize}
              className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
            />
            <span className="hidden lg:inline">Đăng xuất</span>
          </button>

        </div>
      </div>
    </nav>

      {/* ============ MOBILE BOTTOM NAV ============ */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#0B0E11]/95 backdrop-blur supports-[backdrop-filter]:bg-[#0B0E11]/80 border-t border-gray-800 z-50">
        <div className="h-full grid grid-cols-5">
          {/* Home */}
          <Link href="/home" className="flex items-center justify-center">
            <Image src="/icons/home.svg" alt="Trang chủ" width={24} height={24} />
          </Link>
          {/* Explore */}
          <Link href="/explore" className="flex items-center justify-center">
            <Image src="/icons/explore-tool-svgrepo-com.svg" alt="Khám phá" width={24} height={24} />
          </Link>
          {/* Create */}
          <Link href="/blog/create" className="flex items-center justify-center">
            <Image src="/icons/square-plus-regular-full.svg" alt="Tạo bài viết" width={24} height={24} />
          </Link>
          {/* Messages */}
          <Link href="/messages" className="flex items-center justify-center relative">
            <Image src="/icons/send-svgrepo-com.svg" alt="Tin nhắn" width={24} height={24} />
            {messageBadge > 0 && (
              <span className="absolute top-2 right-6 min-w-[18px] h-[18px] px-1 text-[11px] font-bold text-white bg-red-500 rounded-full flex items-center justify-center">
                {messageBadge}
              </span>
            )}
          </Link>
          {/* More */}
          <div className="flex items-center justify-center" data-mobile-menu-root>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(v => !v)}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Menu"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M4 6h16M4 12h16M4 18h16" stroke="#877EFF" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            {mobileMenuOpen && (
              <div className="absolute bottom-16 right-3 w-56 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                <Link
                  href="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                    {userImage ? (
                      <Image src={userImage} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
                    ) : (
                      <span className="text-white font-bold text-sm">{userInitial}</span>
                    )}
                  </div>
                  <span>Trang cá nhân</span>
                </Link>
                <Link
                  href="/settings/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-sm text-gray-300 hover:bg-gray-900 hover:text-white transition-colors"
                >
                  Cài đặt
                </Link>
                <button
                  onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
                  className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-gray-900 transition-colors"
                >
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}