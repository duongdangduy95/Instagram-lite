'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Blog = {
  id: string
  caption: string
  imageUrls: string[]   // mảng ảnh + video
  hashtags: string[]
  author: { username: string }
  createdAt: string
}

export default function BlogListPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])

  useEffect(() => {
    const fetchBlogs = async () => {
      const res = await fetch('/api/blog', { cache: 'no-store' })
      const data = await res.json()
      setBlogs(data)
    }
    fetchBlogs()
  }, [])

  // Kiểm tra URL là ảnh hay video
  const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url)
  const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url)

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">All Blogs</h1>
      <Link href="/blog/create" className="text-blue-500 underline mb-6 block">
        + Create New Blog
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {blogs.map(blog => (
          <Link key={blog.id} href={`/blog/${blog.id}`}>
            <div className="border rounded-lg overflow-hidden shadow hover:shadow-lg transition">
              {/* Hiển thị media đầu tiên */}
              {blog.imageUrls.length > 0 && (() => {
                const first = blog.imageUrls[0]
                if (isImage(first)) {
                  return (
                    <Image
                      src={first}
                      alt="blog media"
                      width={400}
                      height={300}
                      className="w-full h-60 object-cover"
                    />
                  )
                } else if (isVideo(first)) {
                  return (
                    <div className="relative w-full h-60 bg-black flex items-center justify-center">
                      {/* Thumbnail video */}
                      <video
                        src={first}
                        className="w-full h-full object-cover"
                        muted
                        preload="metadata" // chỉ load thumbnail
                      />
                      {/* Nút Play */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-white rounded-full p-4 text-black text-xl opacity-80 hover:opacity-100">
                          ▶
                        </button>
                      </div>
                    </div>
                  )
                }
              })()}

              <div className="p-2">
                <p className="font-semibold">@{blog.author.username}</p>
                <p>{blog.caption}</p>

                {/* Hiển thị hashtag */}
                {blog.hashtags.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-2">
                    {blog.hashtags.map((tag) => (
                      <span key={tag} className="text-blue-500 text-sm">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Nếu có nhiều media */}
                {blog.imageUrls.length > 1 && (
                  <p className="text-gray-500 text-sm mt-1">
                    +{blog.imageUrls.length - 1} more media(s)
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
