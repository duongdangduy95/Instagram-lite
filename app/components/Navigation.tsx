'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'

const iconSize = 22

const navItems = [
  {
    label: 'Trang chủ',
    href: '/home',
    icon: '/icons/home.svg',
  },
  {
    label: 'Tìm kiếm',
    href: '/search',
    icon: '/icons/icons8-search-50-2.svg',
  },
  {
    label: 'Khám phá',
    href: '/explore',
    icon: '/icons/explore-tool-svgrepo-com.svg',
  },
  {
    label: 'Tin nhắn',
    href: '/messages',
    icon: '/icons/send-svgrepo-com.svg',
  },
  {
    label: 'Tạo bài viết mới',
    href: '/blog/create',
    icon: '/icons/edit.svg',
  },
  
]

export default function Navigation() {
  const pathname = usePathname()
  const { user } = useCurrentUser()
  const displayName = user?.fullname || user?.username || 'User'
  const userInitial = displayName.charAt(0).toUpperCase()
  const userImage = user?.image ?? null

  const [settingsOpen, setSettingsOpen] = useState(false)
  const settingsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!settingsOpen) return
    const onDown = (e: MouseEvent) => {
      if (!settingsRef.current) return
      if (!settingsRef.current.contains(e.target as Node)) setSettingsOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSettingsOpen(false)
    }
    document.addEventListener('mousedown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [settingsOpen])

  return (
    <nav className="fixed left-0 top-0 h-full w-64 bg-black border-r border-gray-800 z-50">
      <div className="flex flex-col h-full px-4 py-6">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white mb-6 px-2">
          InstaClone
        </Link>

        {/* Trang cá nhân - Riêng biệt */}
        {user && (
          <Link
            href="/profile"
            prefetch={true}
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-4 border-b border-gray-800 pb-4 ${
              pathname === '/profile'
                ? 'text-white font-semibold bg-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {userImage ? (
                <Image src={userImage} alt={displayName} width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <span className="text-white font-bold text-sm">{userInitial}</span>
              )}
            </div>
            <span className="text-white font-medium">{displayName}</span>
          </Link>
        )}

        {/* Menu Items - Vertical */}
        <div className="flex flex-col space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch={true}
                className={`group flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
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

        {/* Settings & Logout Buttons - Bottom */}
        <div className="mt-auto mb-4 space-y-2">
          <button
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
            <span>Thông báo</span>
          </button>

          <div className="relative" ref={settingsRef}>
            <button
              type="button"
              onClick={() => setSettingsOpen((v) => !v)}
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
              <div className="absolute left-0 bottom-12 w-56 bg-black border border-gray-800 rounded-lg shadow-xl overflow-hidden z-50">
                <Link
                  href="/settings/profile"
                  className={`block px-4 py-3 text-sm transition-colors ${
                    pathname.startsWith('/settings/profile')
                      ? 'text-white bg-gray-900'
                      : 'text-gray-300 hover:bg-gray-900 hover:text-white'
                  }`}
                  onClick={() => setSettingsOpen(false)}
                >
                  Chỉnh sửa trang cá nhân
                </Link>
                <Link
                  href="/settings/security"
                  className={`block px-4 py-3 text-sm transition-colors ${
                    pathname.startsWith('/settings/security')
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
