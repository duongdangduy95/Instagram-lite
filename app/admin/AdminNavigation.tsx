'use client'

export default function AdminNavigation({
  activeTab,
  onChange,
}: {
  activeTab: string
  onChange: (t: string) => void
}) {
  const tabs = [
    { id: "home", label: "Trang chủ" },
    { id: "dashboard", label: "Báo cáo" },
    { id: "history", label: "Lịch sử" },
    { id: "logout", label: "Đăng xuất", danger: true },
  ]

  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#0E1116] border-r border-gray-800 px-4 py-6 z-50">
      <h2 className="text-white text-xl font-bold mb-8">Quản trị</h2>

      <div className="flex flex-col gap-2">
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={`
              text-left px-4 py-2 rounded-lg transition flex items-center gap-3
              ${
                t.danger
                  ? "text-red-400 hover:bg-red-500/10"
                  : activeTab === t.id
                  ? "bg-blue-600 text-white"
                  : "text-gray-400 hover:bg-gray-800"
              }
            `}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  )
}
