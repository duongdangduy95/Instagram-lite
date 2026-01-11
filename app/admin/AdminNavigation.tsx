'use client'
export default function AdminNavigation({
  activeTab,
  onChange,
}: {
  activeTab: string
  onChange: (t: string) => void
}) {
  return (
    <div className="flex gap-6 border-b border-gray-700 mb-6">
      {["dashboard", "management", "history"].map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`pb-2 ${
            activeTab === t
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400"
          }`}
        >
          {t.toUpperCase()}
        </button>
      ))}
    </div>
  )
}
