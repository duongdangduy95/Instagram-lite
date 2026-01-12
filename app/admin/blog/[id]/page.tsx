'use client'
import { useParams, usePathname } from "next/navigation"
import BlogPostModal from "@/app/components/BlogPostModal"
import { useEffect, useState } from "react"

export default function AdminBlogPage() {
  const params = useParams()
  const [blogId, setBlogId] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    if (params.id) {
      setBlogId(params.id as string)
    }
  }, [params.id, pathname])

  if (!blogId) return null

  return (
    <div>
      <BlogPostModal 
        key={blogId}  
        blogId={blogId} 
        isAdmin={true} 
      />
    </div>
  )
}