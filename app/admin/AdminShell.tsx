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
    <div className="min-h-screen bg-[#0B0E11] px-4 py-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-white text-2xl">
          Welcome {admin.username}
        </h1>
        <LogoutButton />
      </div>

      <AdminNavigation activeTab={tab} onChange={setTab} />

      {tab === "dashboard" && <DashboardTab />}
      {tab === "management" && <ManagementTab />}
      {tab === "history" && <HistoryTab />}
    </div>
  )
}
