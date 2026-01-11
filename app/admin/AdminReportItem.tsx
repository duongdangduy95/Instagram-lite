'use client'

import { useState } from 'react'

export default function AdminReportItem({
  reportId,
  blogCaption,
  reporterUsername,
  reason,
}: {
  reportId: string
  blogCaption: string
  reporterUsername: string
  reason: string
}) {
  const [loadingAction, setLoadingAction] = useState<"delete" | "reject" | null>(null);

  const handleAction = async (action: "delete" | "reject") => {
    setLoadingAction(action);

    try {
      const res = await fetch(`/api/admin/report/${reportId}/${action}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'same-origin',
      });
      const data = await res.json();

      if (res.ok) {
        alert(action === "delete" ? "Bài viết đã bị xóa" : "Báo cáo đã bị từ chối");
        window.location.reload();
      } else {
        alert(data.error || "Có lỗi xảy ra");
      }
    } catch {
      alert("Có lỗi xảy ra");
    } finally {
      setLoadingAction(null);
    }
  }

  return (
    <div className="bg-[#1B1F25] text-gray-100 border border-gray-700 rounded-xl p-4 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold">Reported by: {reporterUsername}</p>
        <span className="text-sm text-gray-400">Report ID: {reportId}</span>
      </div>

      {/* Blog Caption */}
      <p className="text-gray-200 mb-3">{blogCaption}</p>

      {/* Reason */}
      <p className="text-yellow-400 mb-3"><strong>Reason:</strong> {reason}</p>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => handleAction("delete")}
          disabled={loadingAction === "delete"}
          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 disabled:opacity-50"
        >
          {loadingAction === "delete" ? "Processing..." : "Delete Blog"}
        </button>
        <button
          onClick={() => handleAction("reject")}
          disabled={loadingAction === "reject"}
          className="bg-gray-600 text-white px-4 py-1 rounded hover:bg-gray-700 disabled:opacity-50"
        >
          {loadingAction === "reject" ? "Processing..." : "Reject"}
        </button>
      </div>
    </div>
  );
}
