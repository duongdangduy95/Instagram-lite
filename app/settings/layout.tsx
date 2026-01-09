'use client'

import Navigation from '@/app/components/Navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  const settingsMenu = [
    { label: 'Chỉnh sửa thông tin cá nhân', href: '/settings/profile' },
    { label: 'Đổi mật khẩu', href: '/settings/security' },
  ]

  return (
    <div className="min-h-screen bg-[#0B0E11] pt-14 md:pt-0 pb-20 md:pb-0">
      <Navigation />
      
      {/* Layout 3 cột: Navbar trái | Sidebar cài đặt giữa | Nội dung phải */}
      <div className="ml-0 md:ml-20 lg:ml-64 min-h-screen flex">
        {/* Sidebar cài đặt (giữa) - Desktop only */}
        <aside className="hidden lg:block w-64 border-r border-gray-800 bg-[#0B0E11] flex-shrink-0">
          <div className="p-6">
            <h2 className="text-xl font-bold text-white mb-6">Cài đặt</h2>
            <nav className="space-y-1">
              {settingsMenu.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`block px-4 py-3 rounded-lg text-sm transition-colors ${
                      isActive
                        ? 'bg-gray-900 text-white font-semibold'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Nội dung chính (phải - lớn nhất) */}
        <main className="flex-1 min-w-0">
          {/* Mobile Navigation Tabs */}
          <div className="lg:hidden border-b border-gray-800 bg-[#0B0E11] sticky top-14 z-10">
            <div className="flex">
              {settingsMenu.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex-1 px-4 py-3 text-center text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-white border-b-2 border-[#877EFF]'
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
          
          {/* Đẩy nội dung xuống một chút để tránh bị sticky tabs đè lên tiêu đề */}
          <div className="pt-6 lg:pt-0">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

