'use client'

import Link from 'next/link'
import { useSession, signOut } from 'next-auth/react'
import { useState } from 'react'

export default function Navigation() {
  const { data: session } = useSession()
  const [showMenu, setShowMenu] = useState(false)

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700">
            InstaClone
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link
              href="/home"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">🏠</span>
              <span>Trang chủ</span>
            </Link>

            <Link
              href="/search"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">🔍</span>
              <span>Tìm kiếm</span>
            </Link>

            <Link
              href="/blog/create"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">➕</span>
              <span>Tạo bài</span>
            </Link>

            <Link
              href="/profile"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors"
            >
              <span className="text-xl">👤</span>
              <span>Trang cá nhân</span>
            </Link>

            <button
              onClick={() => signOut({ redirect: true, callbackUrl: '/login' })}
              className="flex items-center space-x-2 text-gray-700 hover:text-red-600 transition-colors"
            >
              <span className="text-xl">🚪</span>
              <span>Đăng xuất</span>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="md:hidden text-2xl focus:outline-none"
          >
            ☰
          </button>
        </div>

        {/* Mobile Menu */}
        {showMenu && (
          <div className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            <Link
              href="/home"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              🏠 Trang chủ
            </Link>

            <Link
              href="/search"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              🔍 Tìm kiếm
            </Link>

            <Link
              href="/blog/create"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              ➕ Tạo bài
            </Link>

            <Link
              href="/profile"
              className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
              onClick={() => setShowMenu(false)}
            >
              👤 Trang cá nhân
            </Link>

            <button
              onClick={() => {
                signOut({ redirect: true, callbackUrl: '/login' })
                setShowMenu(false)
              }}
              className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-red-50 rounded-lg transition-colors"
            >
              🚪 Đăng xuất
            </button>
          </div>
        )}
      </div>
    </nav>
  )
}
