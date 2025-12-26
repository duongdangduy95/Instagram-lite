'use client'

import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'
import { MAX_MEDIA_FILES, validateAndFilterMediaFiles } from '@/lib/mediaValidation'

export default function EditBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [newPreviews])


  const [caption, setCaption] = useState('')
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newFileTypes, setNewFileTypes] = useState<('image' | 'video')[]>([])



  // Load blog data
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blog/${id}`)
      if (!res.ok) {
        router.push('/home')
        return
      }
      const data = await res.json()
      setCaption(data.caption ?? '')
      setExistingImages(data.imageUrls ?? [])
    }

    fetchBlog()
  }, [id, router])

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  // Add new images
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selected = Array.from(e.target.files)

    // Reset input để có thể chọn lại cùng file
    e.target.value = ''

    const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingImages.length - newFiles.length)
    const { accepted, rejectedReasons, truncatedByLimit } = validateAndFilterMediaFiles({
      selectedFiles: selected,
      remainingSlots,
    })

    if (rejectedReasons.length > 0) {
      alert(rejectedReasons.slice(0, 3).join('\n') + (rejectedReasons.length > 3 ? '\n...' : ''))
    }
    if (truncatedByLimit) {
      alert(`Chỉ được tối đa ${MAX_MEDIA_FILES} file (tính cả file hiện có). Một số file đã bị bỏ qua.`)
    }
    if (accepted.length === 0) return

    setNewFiles(prev => [...prev, ...accepted])
    setNewFileTypes(prev => [
      ...prev,
      ...accepted.map(file =>
        file.type.startsWith('video') ? 'video' : 'image'
      ),
    ])

    setNewPreviews(prev => [
      ...prev,
      ...accepted.map(file => URL.createObjectURL(file))
    ])
  }

  // Save edit
  const handleSave = async () => {
    if (!confirm('Bạn có chắc muốn lưu chỉnh sửa?')) return
    setLoading(true)

    const formData = new FormData()
    formData.append('caption', caption)
    existingImages.forEach(url => formData.append('existingImages', url))
    newFiles.forEach(file => formData.append('newFiles', file))

    const res = await fetch(`/api/blog/${id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    })

    setLoading(false)

    if (res.ok) {
      router.push(`/blog/${id}`)
    } else {
      alert('Cập nhật thất bại')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h1>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full bg-gray-900 border border-gray-700 rounded-lg p-3"
        />

        {/* Images grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Existing images */}
          {existingImages.map((url, index) => {
            const isVideo = url.match(/\.(mp4|webm|mov)$/)

            return (
              <div key={url} className="relative group">
                {isVideo ? (
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
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            )
          })}


          {/* New images */}
          {newPreviews.map((url, index) => (
            <div key={url} className="relative group">
              {newFileTypes[index] === 'video' ? (
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
                onClick={() => {
                  // Revoke ngay để tránh leak khi thao tác nhiều
                  URL.revokeObjectURL(url)
                  setNewPreviews(prev => prev.filter((_, i) => i !== index))
                  setNewFiles(prev => prev.filter((_, i) => i !== index))
                  setNewFileTypes(prev => prev.filter((_, i) => i !== index))
                }}
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

        {/* Hidden file input */}
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
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>

          <button
            onClick={() => router.back()}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Hủy
          </button>
        </div>
      </div>
    </div>
  )
}
