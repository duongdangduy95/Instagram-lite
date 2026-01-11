'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LogoutModal({ onClose }: { onClose: () => void }) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const logout = async () => {
    setLoading(true)
    const res = await fetch("/api/admin/logout", {
      method: "POST",
      credentials: "same-origin",
    })

    if (res.ok) {
      router.push("/admin/login")
    } else {
      alert("Logout thất bại")
    }
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="bg-[#0E1116] border border-white/10 rounded-xl p-6 w-[360px] shadow-xl">
        <h3 className="text-white text-lg font-semibold mb-2">
          Xác nhận đăng xuất
        </h3>

        <p className="text-gray-400 text-sm mb-6">
          Bạn có chắc muốn đăng xuất khỏi Trang quản trị không?
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600 text-white"
          >
            Hủy
          </button>

          <button
            onClick={logout}
            disabled={loading}
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
          >
            {loading ? "Đang thoát..." : "Đăng xuất"}
          </button>
        </div>
      </div>
    </div>
  )
}
