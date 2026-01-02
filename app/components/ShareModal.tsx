'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    blogId: string
    onSuccess?: () => void
}

export default function ShareModal({ isOpen, onClose, blogId, onSuccess }: ShareModalProps) {
    const router = useRouter()
    const [caption, setCaption] = useState('')
    const [loading, setLoading] = useState(false)

    if (!isOpen) return null

    const handleShareSubmit = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/blog/share', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    blogId,
                    caption,
                }),
            })

            if (response.ok) {
                setCaption('')
                onSuccess?.()
                onClose()
                router.refresh()
            } else {
                const errorData = await response.json().catch(() => ({ error: 'Có lỗi xảy ra' }))
                alert(errorData.error || 'Chia sẻ bài viết thất bại')
            }
        } catch (error) {
            console.error('Error sharing blog:', error)
            alert('Chia sẻ bài viết thất bại')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-[100] animate-fadeIn"
            onClick={(e) => {
                if (e.target === e.currentTarget) {
                    onClose()
                    setCaption('')
                }
            }}
        >
            <div
                className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800 animate-slideUp"
                onClick={(e) => e.stopPropagation()}
            >
                <h3 className="text-white font-semibold text-lg mb-4">Chia sẻ bài viết</h3>
                <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Viết cảm nghĩ của bạn..."
                    className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-primary"
                    rows={4}
                />
                <div className="flex justify-end space-x-3">
                    <button
                        onClick={() => {
                            onClose()
                            setCaption('')
                        }}
                        className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handleShareSubmit}
                        disabled={loading}
                        className="px-4 py-2 bg-[#877EFF] text-white rounded-lg hover:bg-[#7565E6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Đang chia sẻ...' : 'Chia sẻ'}
                    </button>
                </div>
            </div>
        </div>
    )
}
