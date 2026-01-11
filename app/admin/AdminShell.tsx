'use client'
import { useState } from "react"
import AdminNavigation from "./AdminNavigation"
import DashboardTab from "./tabs/DashboardTab"
import HistoryTab from "./tabs/HistoryTab"
import LogoutModal from "./LogoutModal"

export default function AdminShell({ admin }: { admin: { id: string; username: string } }) {
  const [tab, setTab] = useState("dashboard")
  const [showLogout, setShowLogout] = useState(false)

  return (
    <div className="min-h-screen bg-[#0B0E11] pl-60">
      <AdminNavigation
        activeTab={tab}
        onChange={(t) => {
          if (t === "logout") {
            setShowLogout(true)
          } else {
            setTab(t)
          }
        }}
      />

      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl">
            Chào mừng {admin.username}
          </h1>
        </div>

        {/* Main */}
        <div className="flex justify-center">
          <div className="w-full max-w-[720px]">
            {tab === "dashboard" && <DashboardTab />}
            {tab === "history" && <HistoryTab />}
          </div>
        </div>
      </div>

      {showLogout && (
        <LogoutModal onClose={() => setShowLogout(false)} />
      )}
    </div>
  )
}
