'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

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
    label: 'Tạo bài viết mới',
    href: '/blog/create',
    icon: '/icons/edit.svg',
  },
]

export default function Navigation() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [user, setUser] = useState<{ fullname: string; username?: string } | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (res.ok) {
          const userData = await res.json()
          setUser({ fullname: userData.fullname, username: userData.username })
        }
      } catch (error) {
        console.error('Error fetching user:', error)
      }
    }

    if (session) {
      fetchUser()
    }
  }, [session])

  const userInitial = user?.fullname?.charAt(0).toUpperCase() || 'U'

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
            className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors mb-4 border-b border-gray-800 pb-4 ${
              pathname === '/profile'
                ? 'text-white font-semibold bg-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-800'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">{userInitial}</span>
            </div>
            <span className="text-white font-medium">{user.fullname}</span>
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
                src="/icons/icons8-setting-50.svg" 
                alt="Cài đặt" 
                width={iconSize} 
                height={iconSize}
                className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
              />
            </div>
            <span>Cài đặt</span>
          </button>
          
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
