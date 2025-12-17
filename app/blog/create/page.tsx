'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CreateBlogPage() {
  const router = useRouter()
  const [caption, setCaption] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [filePreviews, setFilePreviews] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)

  // Check login
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/me', { credentials: 'include' })
        if (res.ok) {
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          router.push('/login')
        }
      } catch {
        setIsAuthenticated(false)
        router.push('/login')
      }
    }
    checkAuth()
  }, [router])

  // Handle file selection
  const handleFileChange = (filesList: FileList | null) => {
    if (!filesList) return
    const newFiles = Array.from(filesList)
    setFiles((prev) => [...prev, ...newFiles])

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file))
    setFilePreviews((prev) => [...prev, ...newPreviews])
  }

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
    setFilePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  // Drag & drop
  const handleDragEvents = (e: React.DragEvent, type: 'in' | 'out' | 'over' | 'drop') => {
    e.preventDefault()
    e.stopPropagation()

    if (type === 'in') setDragActive(true)
    if (type === 'out') setDragActive(false)
    if (type === 'drop') {
      setDragActive(false)
      if (e.dataTransfer.files.length) {
        handleFileChange(e.dataTransfer.files)
      }
    }
  }

  // Submit blog
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!files.length || !caption.trim()) return
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('caption', caption)
      files.forEach((file) =>
        formData.append(file.type.startsWith('video') ? 'videos' : 'images', file)
      )

      const res = await fetch('/api/blog/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/profile')
      } else if (res.status === 401) {
        alert('Please login to continue.')
        router.push('/login')
      } else {
        const errorData = await res.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed: ${errorData.error}`)
      }
    } catch {
      alert('Network error. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <p>Checking authentication...</p>
      </div>
    )
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-purple-600 mb-6">Create New Post</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
            }`}
            onDragEnter={(e) => handleDragEvents(e, 'in')}
            onDragLeave={(e) => handleDragEvents(e, 'out')}
            onDragOver={(e) => handleDragEvents(e, 'over')}
            onDrop={(e) => handleDragEvents(e, 'drop')}
          >
            {filePreviews.length > 0 ? (
              <div className="flex flex-wrap gap-4 justify-center">
                {filePreviews.map((preview, idx) => {
                  const isVideo = files[idx].type.startsWith('video')
                  return (
                    <div key={idx} className="relative">
                      {isVideo ? (
                        <video
                          src={preview}
                          className="rounded-lg object-cover w-40 h-40"
                          muted
                          preload="metadata"
                        />
                      ) : (
                        <Image
                          src={preview}
                          alt={`Preview ${idx}`}
                          width={160}
                          height={160}
                          className="rounded-lg object-cover"
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
            ) : (
              <div>
                <p className="mb-2">Drag & drop images/videos, or</p>
                <label className="cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded">
                  Choose Files
                  <input
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                  />
                </label>
              </div>
            )}
          </div>

          {/* Caption */}
          <div>
            <textarea
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              rows={4}
              maxLength={500}
              placeholder="Write your caption here..."
              className="w-full border border-gray-300 rounded-xl p-4 resize-none"
            />
            <p className="text-sm text-gray-500 text-right">{caption.length}/500</p>
          </div>

          {/* Buttons */}
          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!files.length || !caption.trim() || isLoading}
              className={`px-6 py-2 rounded text-white transition ${
                !files.length || !caption.trim() || isLoading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700'
              }`}
            >
              {isLoading ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
