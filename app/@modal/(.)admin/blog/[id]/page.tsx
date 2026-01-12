'use client'
import { useParams } from "next/navigation"
import BlogPostModal from "@/app/components/BlogPostModal"

export default function AdminBlogModal() {
  const params = useParams()
  return <BlogPostModal blogId={params.id as string} isAdmin />
}
