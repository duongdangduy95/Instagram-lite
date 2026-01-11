'use client'

import { useState } from 'react'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  blogId: string
}

export default function ReportModal({ isOpen, onClose, blogId }: ReportModalProps) {
  const [reason, setReason] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false) // trạng thái gửi thành công

  if (!isOpen) return null

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError('Bạn phải nhập lý do!')
      return
    }

    setLoading(true)
    setError('')
    try {
      const res = await fetch(`/api/blog/${blogId}/report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
        credentials: 'include',
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Có lỗi xảy ra khi gửi báo cáo')
      } else {
        setSuccess(true)
        setReason('')
      }
    } catch (err) {
      console.error(err)
      setError('Có lỗi xảy ra khi gửi báo cáo')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999]">
      <div className="bg-gray-900 p-6 rounded-xl w-96 text-white">
        <h2 className="text-lg font-semibold mb-4">Báo cáo bài viết</h2>

        {!success ? (
          <>
            <textarea
              className="w-full p-2 mb-2 text-black rounded"
              rows={4}
              placeholder="Nhập lý do báo cáo..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
            {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
          </>
        ) : (
          <p className="text-green-400 mb-4">Báo cáo đã gửi thành công! Cảm ơn bạn.</p>
        )}

        <div className="flex justify-end gap-2 mt-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
          >
            {success ? 'Đóng' : 'Hủy'}
          </button>
          {!success && (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="px-4 py-2 bg-gray-700 rounded hover:bg-gray-600"
            >
              {loading ? 'Đang gửi...' : 'Gửi'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
