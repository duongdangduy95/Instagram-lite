'use client'
import { useParams, useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminBlogPage() {
  const params = useParams()
  const router = useRouter()

  useEffect(() => {
    // Khi F5 hoặc load trực tiếp /admin/blog/[id], redirect về /admin
    router.replace('/admin')
  }, [router])

  return null
}