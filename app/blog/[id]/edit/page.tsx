'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'

export default function EditBlog() {
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string

  const [caption, setCaption] = useState('')
  const [hashtags, setHashtags] = useState<string[]>([])
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [existingFiles, setExistingFiles] = useState<string[]>([]) // URLs từ DB

  // Fetch blog dữ liệu
  useEffect(() => {
    fetch(`/api/blog/${blogId}`)
      .then(res => res.json())
      .then(data => {
        setCaption(data.caption)
        setHashtags(data.hashtags || [])
        setExistingFiles(data.imageUrls || [])
        setFilePreviews(data.imageUrls || [])
      })
  }, [blogId])

  // Handle upload file mới
  const handleFileChange = (fileList: FileList | null) => {
    if (!fileList) return
    const newFiles = Array.from(fileList)
    setFiles(prev => [...prev, ...newFiles])
    const newPreviews = newFiles.map(f => URL.createObjectURL(f))
    setFilePreviews(prev => [...prev, ...newPreviews])
  }

  // Xóa file (cả cũ và mới)
  const removeFile = (index: number) => {
    const preview = filePreviews[index]
    if (existingFiles.includes(preview)) {
      setExistingFiles(prev => prev.filter(url => url !== preview))
    } else {
      setFiles(prev => prev.filter((_, i) => i !== index))
    }
    setFilePreviews(prev => prev.filter((_, i) => i !== index))
  }

  // Xử lý hashtags (nhập dạng #tag1 #tag2)
  const handleHashtagsChange = (value: string) => {
    const tags = value.split(' ').map(t => t.replace('#', '')).filter(t => t.trim() !== '')
    setHashtags(tags)
  }

  const handleUpdate = async () => {
    const formData = new FormData()
    formData.append('caption', caption)
    formData.append('hashtags', JSON.stringify(hashtags))
    existingFiles.forEach(url => formData.append('existingImages', url))
    files.forEach(file => {
      const key = file.type.startsWith('video') ? 'videos' : 'images'
      formData.append(key, file)
    })

    const res = await fetch(`/api/blog/${blogId}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    })

    if (res.ok) {
      router.push('/profile')
    } else {
      const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
      alert(`Failed to update: ${errorData.error}`)
    }
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa bài viết</h1>

      {/* Caption */}
      <textarea
        value={caption}
        onChange={e => setCaption(e.target.value)}
        placeholder="Caption"
        className="w-full p-2 border mb-4 resize-none"
        rows={4}
      />

      {/* Hashtags */}
      <input
        type="text"
        value={hashtags.map(tag => `#${tag}`).join(' ')}
        onChange={e => handleHashtagsChange(e.target.value)}
        placeholder="Hashtags (#tag1 #tag2)"
        className="w-full p-2 border mb-4"
      />

      {/* Upload file */}
      <div className="border p-4 mb-4 rounded">
        <label className="cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded mb-2">
          Chọn ảnh/Video
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            className="hidden"
            onChange={e => handleFileChange(e.target.files)}
          />
        </label>

        <div className="flex flex-wrap gap-2 mt-2">
          {filePreviews.map((preview, idx) => {
            const isVideo =
              (!existingFiles.includes(preview) && files[idx].type.startsWith('video')) ||
              (existingFiles.includes(preview) && preview.endsWith('.mp4')) // giả định video có .mp4
            return (
              <div key={idx} className="relative">
                {isVideo ? (
                  <video
                    src={preview}
                    className="rounded object-cover w-36 h-36"
                    muted
                    controls
                  />
                ) : (
                  <Image
                    src={preview}
                    alt={`preview ${idx}`}
                    width={144}
                    height={144}
                    className="rounded object-cover"
                  />
                )}
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                >
                  ×
                </button>
              </div>
            )
          })}
        </div>
      </div>

      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cập nhật
      </button>
    </div>
  )
}
