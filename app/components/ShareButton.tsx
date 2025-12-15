'use client'

import { useState } from 'react'

export default function ShareButton({
  blogId,
  onShared,
}: {
  blogId: string
  onShared?: () => void
}) {
  const [open, setOpen] = useState(false)
  const [caption, setCaption] = useState('')
  const [loading, setLoading] = useState(false)

  const handleShare = async () => {
    setLoading(true)

    await fetch('/api/blog/share', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        blogId,
        caption,
      }),
    })

    setLoading(false)
    setOpen(false)
    setCaption('')
    onShared?.()
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg flex-1 justify-center"
      >
        <span>📤</span>
        <span className="font-medium">Chia sẻ</span>
      </button>

      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 w-full max-w-md">
            <h3 className="font-semibold mb-2">Chia sẻ bài viết</h3>

            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Viết cảm nghĩ của bạn..."
              className="w-full border rounded p-2 mb-3"
              rows={3}
            />

            <div className="flex justify-end space-x-2">
              <button onClick={() => setOpen(false)}>Hủy</button>
              <button
                onClick={handleShare}
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-1 rounded"
              >
                {loading ? 'Đang chia sẻ...' : 'Chia sẻ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
