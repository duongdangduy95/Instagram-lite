'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function CreateBlogPage() {
  const router = useRouter()
  const [caption, setCaption] = useState('')
  const [image, setImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
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

  const handleImageChange = (file: File | null) => {
    setImage(file)
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
  }

  const handleDragEvents = (e: React.DragEvent, type: 'in' | 'out' | 'over' | 'drop') => {
    e.preventDefault()
    e.stopPropagation()

    if (type === 'in') setDragActive(true)
    if (type === 'out') setDragActive(false)
    if (type === 'drop') {
      setDragActive(false)
      if (e.dataTransfer.files[0]) {
        handleImageChange(e.dataTransfer.files[0])
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append('caption', caption)
      if (image) formData.append('image', image)

      const res = await fetch('/api/blog/create', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      })

      if (res.ok) {
        router.push('/profile') // Redirect to profile after successful post
      } else if (res.status === 401) {
        alert('Please login to continue.')
        router.push('/login')
      } else {
        const error = await res.json().catch(() => ({ error: 'Unknown error' }))
        alert(`Failed: ${error.error}`)
      }
    } catch (error) {
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
          {/* Image Upload */}
          <div
            className={`border-2 border-dashed rounded-xl p-6 text-center transition ${
              dragActive ? 'border-purple-400 bg-purple-50' : 'border-gray-300'
            }`}
            onDragEnter={(e) => handleDragEvents(e, 'in')}
            onDragLeave={(e) => handleDragEvents(e, 'out')}
            onDragOver={(e) => handleDragEvents(e, 'over')}
            onDrop={(e) => handleDragEvents(e, 'drop')}
          >
            {imagePreview ? (
              <div className="relative">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={800}
                  height={600}
                  className="rounded-lg object-cover w-full max-h-80"
                />
                <button
                  type="button"
                  onClick={() => handleImageChange(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2"
                >
                  ×
                </button>
              </div>
            ) : (
              <div>
                <p className="mb-2">Drag & drop an image, or</p>
                <label className="cursor-pointer inline-block bg-purple-600 text-white px-4 py-2 rounded">
                  Choose Image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageChange(e.target.files?.[0] || null)}
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
              disabled={!image || !caption.trim() || isLoading}
              className={`px-6 py-2 rounded text-white transition ${
                !image || !caption.trim() || isLoading
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
