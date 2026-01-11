'use client'
import { useState } from "react"
import AdminNavigation from "./AdminNavigation"
import DashboardTab from "./tabs/DashboardTab"
import ManagementTab from "./tabs/ManagementTab"
import HistoryTab from "./tabs/HistoryTab"
import LogoutButton from "./LogoutButton"

export default function AdminShell({ admin }: { admin: { id: string; username: string } }) {
  const [tab, setTab] = useState("dashboard")

  return (
    <div className="min-h-screen bg-[#0B0E11] pl-60">
      <AdminNavigation activeTab={tab} onChange={setTab} />

      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-white text-2xl">
            Welcome {admin.username}
          </h1>
          <LogoutButton />
        </div>

        {/* Main content */}
        <div className="flex justify-center">
          <div className="w-full max-w-[720px]">
            {tab === "dashboard" && <DashboardTab />}
            {tab === "management" && <ManagementTab />}
            {tab === "history" && <HistoryTab />}
          </div>
        </div>
      </div>
    </div>
  )
}
