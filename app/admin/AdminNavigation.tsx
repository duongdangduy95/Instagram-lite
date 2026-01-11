'use client'

export default function AdminNavigation({
  activeTab,
  onChange,
}: {
  activeTab: string
  onChange: (t: string) => void
}) {
  return (
    <div className="fixed top-0 left-0 h-screen w-60 bg-[#0E1116] border-r border-gray-800 px-4 py-6 z-50">
      <h2 className="text-white text-xl font-bold mb-8">ADMIN PANEL</h2>

      <div className="flex flex-col gap-3">
        {["dashboard", "management", "history"].map((t) => (
          <button
            key={t}
            onClick={() => onChange(t)}
            className={`text-left px-4 py-2 rounded-lg transition ${
              activeTab === t
                ? "bg-blue-600 text-white"
                : "text-gray-400 hover:bg-gray-800"
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  )
}
