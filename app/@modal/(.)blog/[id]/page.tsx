'use client'

import { useParams, useSearchParams } from 'next/navigation'
import BlogPostModal from '@/app/components/BlogPostModal'

export default function BlogModalPage() {
  const params = useParams()
  const searchParams = useSearchParams()

  const blogId = params.id as string
  const isAdmin = searchParams.get("admin") === "1"

  return <BlogPostModal blogId={blogId} isAdmin={isAdmin} />
}
