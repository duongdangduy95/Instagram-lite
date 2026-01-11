'use client'

import { useEffect, useState } from "react"
import { formatDistanceToNow, format } from "date-fns"

type Log = {
  id: string
  action: string
  createdAt: string
  admin: string
  blog: {
    caption: string
    author: string
  } | null
  report: {
    reason: string
    reporter: string
  } | null
}

export default function HistoryTab() {
  const [logs, setLogs] = useState<Log[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/history")
      .then(r => r.json())
      .then(d => setLogs(d.history))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return <div className="p-6 text-gray-400">Đang tải...</div>
  }

  return (
    <div className="bg-[#0b0b0b] border border-white/10 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-white/10 text-white font-semibold">
        🛡 Lịch sử quản trị
      </div>

      {logs.length === 0 && (
        <div className="p-6 text-gray-500 text-center">
          No admin activity yet
        </div>
      )}

      <div className="divide-y divide-white/5">
        {logs.map(log => {
          const date = new Date(log.createdAt)

          return (
            <div key={log.id} className="px-5 py-4 space-y-2">

              {/* LINE 1 — ACTION + TIME */}
              <div className="flex items-center justify-between">
                <div className="text-white text-sm">
                  <span className="font-semibold">{log.admin}</span>{" "}
                  <span className="text-gray-300">
                    {describeAction(log.action)}
                  </span>
                </div>

                <div className="text-xs text-gray-500 text-right">
                  <div>{formatDistanceToNow(date)} ago</div>
                  <div>{format(date, "dd/MM/yyyy HH:mm")}</div>
                </div>
              </div>

              {/* LINE 2 — BLOG */}
              {log.blog && (
                <div className="text-sm text-gray-400">
                  📄 Bài viết:{" "}
                  <span className="text-white">{truncate(log.blog.caption)}</span>{" "}
                  <span className="text-gray-500">— của {log.blog.author}</span>
                </div>
              )}

              {/* LINE 3 — REPORT */}
              {log.report && (
                <div className="text-sm text-gray-400">
                  🚩 Bị báo cáo bởi{" "}
                  <span className="text-white">{log.report.reporter}</span>{" "}
                  <span className="text-gray-500">
                    — lý do: {log.report.reason}
                  </span>
                </div>
              )}

            </div>
          )
        })}
      </div>
    </div>
  )
}

/* -------- helpers -------- */

function describeAction(action: string) {
  switch (action) {
    case "DELETE_BLOG":
      return "đã xóa 1 bài viết"
    case "REJECT_REPORT":
      return "đã từ chối 1 báo cáo"
    case "APPROVE_REPORT":
      return "đã chấp nhận 1 báo cáo"
    case "RESOLVE_REPORT":
      return "đã xử lý 1 báo cáo"
    default:
      return action.replaceAll("_", " ").toLowerCase()
  }
}

function truncate(text: string, len = 60) {
  return text.length > len ? text.slice(0, len) + "…" : text
}
