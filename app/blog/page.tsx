// app/blog/page.tsx
'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useState } from 'react'

type Blog = {
  id: string
  caption: string
  imageUrl: string
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
              <Image
                src={blog.imageUrl}
                alt="blog image"
                width={400}
                height={300}
                className="w-full h-60 object-cover"
              />
              <div className="p-2">
                <p className="font-semibold">@{blog.author.username}</p>
                <p>{blog.caption}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
