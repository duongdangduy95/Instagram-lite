'use client'
import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

export default function EditBlog() {
  const router = useRouter()
  const params = useParams()
  const blogId = params.id as string
  const [caption, setCaption] = useState('')
  const [imageUrl, setImageUrl] = useState('')

  useEffect(() => {
    fetch(`/api/blog/${blogId}`)
      .then(res => res.json())
      .then(data => {
        setCaption(data.caption)
        setImageUrl(data.imageUrl)
      })
  }, [blogId])

  const handleUpdate = async () => {
    await fetch(`/api/blog/${blogId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ caption, imageUrl })
    })
    router.push('/profile')
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Chỉnh sửa bài viết</h1>
      <input
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
        placeholder="Caption"
        className="w-full p-2 border mb-4"
      />
      <input
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
        placeholder="Image URL"
        className="w-full p-2 border mb-4"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Cập nhật
      </button>
    </div>
  )
}
