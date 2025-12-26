'use client'

import { useParams } from 'next/navigation'
import BlogPostModal from '@/app/components/BlogPostModal'

export default function BlogModalPage() {
  const params = useParams()
  const blogId = params.id as string
  return <BlogPostModal blogId={blogId} />
}


