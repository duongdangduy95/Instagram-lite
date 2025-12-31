'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CreateBlogForm from '@/app/blog/create/CreateBlogForm'

export default function CreateBlogModal() {
  const router = useRouter()

  // lock scroll nền
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  return (
    <div
      className="fixed inset-0 z-[70] bg-black/60 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) router.back()
      }}
    >
      <button
        onClick={() => router.back()}
        className="fixed top-4 right-4 z-[80] h-10 w-10 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center text-xl"
        aria-label="Đóng"
      >
        ✕
      </button>

      <div
        className="w-full max-w-3xl bg-[#0B0E11] border border-gray-800 rounded-2xl p-6 shadow-2xl text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <CreateBlogForm onCancel={() => router.back()} onSuccess={() => router.back()} />
      </div>
    </div>
  )
}


