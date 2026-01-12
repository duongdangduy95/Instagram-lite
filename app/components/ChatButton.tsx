'use client'

import { useRouter } from 'next/navigation'

// Nút chat nổi: điều hướng sang trang Messages thay vì render ChatWindow placeholder
export default function ChatButton() {
  const router = useRouter()

  return (
    <button
      onClick={() => router.push('/messages')}
      className="fixed bottom-4 right-4 p-3 bg-blue-500 text-white rounded-full"
      aria-label="Mở tin nhắn"
      type="button"
    >
      💬
    </button>
  )
}
