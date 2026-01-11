'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import BlogImages from '../components/BlogImages'
import ExpandableCaption from '../components/ExpandableCaption'

export default function BlogFeed({ blogs }: { blogs: any[] }) {
  const router = useRouter()

  const handleAction = async (reportId: string, action: "delete" | "reject") => {
    const res = await fetch(`/api/admin/report/${reportId}/${action}`, {
      method: "POST",
      credentials: "same-origin",
    })
    if (res.ok) window.location.reload()
    else alert("Action failed")
  }

  return (
    <div className="space-y-8">
      {blogs.map((blog) => (
        <div
          key={blog.id}
          className="bg-[#11151B] border border-gray-800 rounded-xl overflow-hidden hover:border-gray-600 transition cursor-pointer"
          onClick={() => router.push(`/admin/blog/${blog.id}`)}
        >
          {/* HEADER */}
          <div className="flex items-center justify-between px-4 py-3">
            <Link
              href={`/profile/${blog.author.id}`}
              className="flex items-center gap-3"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden">
                {blog.author.image && (
                  <Image src={blog.author.image} alt="" width={40} height={40} />
                )}
              </div>
              <div>
                <p className="text-white font-semibold">{blog.author.username}</p>
                <p className="text-xs text-gray-400">{formatTimeAgo(blog.createdAt)}</p>
              </div>
            </Link>

            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction(blog.reportId, "delete")
                }}
                className="bg-red-600 px-3 py-1 text-sm rounded text-white hover:bg-red-700"
              >
                Delete
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  handleAction(blog.reportId, "reject")
                }}
                className="bg-gray-600 px-3 py-1 text-sm rounded text-white hover:bg-gray-700"
              >
                Reject
              </button>
            </div>
          </div>

          {/* 🚨 REPORT INFO */}
          <div className="px-4 py-2 bg-[#0E1116] border-t border-gray-800">
            <p className="text-sm text-red-400">
              <b>Reported by:</b> {blog.reporter?.username || "Unknown"}
            </p>
            <p className="text-sm text-yellow-400">
              <b>Reason:</b> {blog.reportReason}
            </p>
          </div>

          {/* CAPTION */}
          <div className="px-4 py-2 text-gray-200">
            <ExpandableCaption text={blog.caption} initialLines={2} />
          </div>

          {/* IMAGES */}
          <div className="px-4 pb-4">
            <BlogImages imageUrls={blog.imageUrls} />
          </div>
        </div>
      ))}
    </div>
  )
}
