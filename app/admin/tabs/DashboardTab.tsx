'use client'

import { useEffect, useState } from "react"
import BlogFeed from "../BlogFeed"

type DashboardData = {
  blogs: any[]
}

export default function DashboardTab() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/dashboard")
        const json = await res.json()
        setData(json)
      } catch (e) {
        console.error("Dashboard fetch failed", e)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  if (loading) return <div className="text-gray-400">Đang tải</div>
  if (!data) return <div className="text-red-500">Tải thất bại</div>

  return <BlogFeed blogs={data.blogs} />

}
