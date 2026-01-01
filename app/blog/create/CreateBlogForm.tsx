'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { MAX_MEDIA_FILES, validateAndFilterMediaFiles } from '@/lib/mediaValidation'

type Props = {
  onSuccess?: () => void
  onCancel?: () => void
}

export default function CreateBlogForm({ onSuccess, onCancel }: Props) {
  const router = useRouter()
  const { data: session, status } = useSession()

  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [fileTypes, setFileTypes] = useState<('image' | 'video')[]>([])
  const [loading, setLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Auth check
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login')
    }
  }, [status, router])

  // Cleanup previews
  useEffect(() => {
    return () => {
      previews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [previews])

  // Add files
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    const selected = Array.from(e.target.files)

    // Reset input để có thể chọn lại cùng file
    e.target.value = ''

    const remainingSlots = Math.max(0, MAX_MEDIA_FILES - files.length)
    const { accepted, rejectedReasons, truncatedByLimit } = validateAndFilterMediaFiles({
      selectedFiles: selected,
      remainingSlots,
    })

    if (rejectedReasons.length > 0) {
      alert(rejectedReasons.slice(0, 3).join('\n') + (rejectedReasons.length > 3 ? '\n...' : ''))
    }
    if (truncatedByLimit) {
      alert(`Chỉ được tối đa ${MAX_MEDIA_FILES} file. Một số file đã bị bỏ qua.`)
    }
    if (accepted.length === 0) return

    setFiles(prev => [...prev, ...accepted])
    setFileTypes(prev => [
      ...prev,
      ...accepted.map(f => (f.type.startsWith('video') ? 'video' : 'image')),
    ])
    setPreviews(prev => [
      ...prev,
      ...accepted.map(f => URL.createObjectURL(f)),
    ])
  }

  // Remove file
  const removeFile = (index: number) => {
    const url = previews[index]
    if (url) URL.revokeObjectURL(url)
    setFiles(prev => prev.filter((_, i) => i !== index))
    setPreviews(prev => prev.filter((_, i) => i !== index))
    setFileTypes(prev => prev.filter((_, i) => i !== index))
  }

  // Submit
  const handleSubmit = async () => {
    if (!caption.trim() && files.length === 0) {
      alert('Bài viết không được để trống')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('caption', caption)

      files.forEach(file => {
        formData.append(
          file.type.startsWith('video') ? 'videos' : 'images',
          file
        )
      })

      const res = await fetch('/api/blog/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        window.dispatchEvent(new CustomEvent('blog:created'))
        if (onSuccess) onSuccess()
        else router.push('/home')
      } else {
        alert('Đăng bài thất bại')
      }
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-[200px] text-white">
        Đang kiểm tra đăng nhập...
      </div>
    )
  }

  if (!session) return null

  return (
    <div className="text-white">
      <h1 className="text-xl font-semibold mb-4">Tạo bài viết</h1>

      {/* Caption */}
      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        rows={3}
        placeholder="Bạn đang nghĩ gì?"
        className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
      />

      {/* Media grid */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        {/* Previews */}
        {previews.map((url, index) => (
          <div key={url} className="relative group">
            {fileTypes[index] === 'video' ? (
              <video
                src={url}
                controls
                className="aspect-square object-cover rounded-lg"
              />
            ) : (
              <img
                src={url}
                className="aspect-square object-cover rounded-lg"
              />
            )}

            <button
              onClick={() => removeFile(index)}
              className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2 opacity-0 group-hover:opacity-100 transition"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Add button */}
        <label
          onClick={() => fileInputRef.current?.click()}
          className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 cursor-pointer transition"
        >
          <span className="text-3xl">+</span>
        </label>
      </div>

      {/* Hidden input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*"
        onChange={handleAddFiles}
        className="hidden"
      />

      {/* Actions */}
      <div className="flex gap-3 mt-6">
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-4 py-2 rounded-lg bg-[#877EFF] hover:bg-[#7565E6] text-white"
        >
          {loading ? 'Đang đăng...' : 'Đăng bài'}
        </button>

        <button
          onClick={onCancel ?? (() => router.back())}
          className="px-4 py-2 bg-gray-700 rounded-lg"
        >
          Hủy
        </button>
      </div>
    </div>
  )
}


