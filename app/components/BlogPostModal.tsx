'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import BlogImages from '@/app/components/BlogImages'
import CommentSection from '@/app/components/CommentSection'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'
import type { CurrentUserSafe } from '@/types/dto'

type BlogAuthor = {
  id: string
  fullname: string
  username: string
}

type BlogCounts = { likes: number; comments: number }

type BlogDetail = {
  id: string
  caption?: string | null
  imageUrls: string[]
  createdAt: string
  hashtags?: string[]
  author: BlogAuthor
  likes?: { userId: string }[]
  _count: BlogCounts
}

export default function BlogPostModal({ blogId }: { blogId: string }) {
  const router = useRouter()
  const { user: currentUser } = useCurrentUser()

  const [blog, setBlog] = useState<BlogDetail | null>(null)
  const [loading, setLoading] = useState(true)

  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [saved, setSaved] = useState(false)
  const [composer, setComposer] = useState('')
  const [posting, setPosting] = useState(false)
  const [reloadKey, setReloadKey] = useState(0)

  const dialogRef = useRef<HTMLDivElement>(null)

  const close = useCallback(() => router.back(), [router])

  // Lock background scroll while modal is open
  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [close])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/blog/${blogId}`, { credentials: 'include' })
        if (!res.ok) {
          close()
          return
        }
        const data = (await res.json()) as BlogDetail
        if (cancelled) return
        setBlog(data)
        setLiked((data.likes?.length ?? 0) > 0)
        setLikeCount(data._count?.likes ?? 0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [blogId, close])

  const handleLike = async () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    if (!blog) return

    const prevLiked = liked
    const prevCount = likeCount
    const nextLiked = !prevLiked
    const nextCount = nextLiked ? prevCount + 1 : Math.max(0, prevCount - 1)

    setLiked(nextLiked)
    setLikeCount(nextCount)
    // Sync ngay với feed (home/profile) để khỏi phải refresh
    window.dispatchEvent(
      new CustomEvent('blog:like-change', {
        detail: { blogId: blog.id, liked: nextLiked, likeCount: nextCount },
      })
    )

    try {
      const res = await fetch(`/api/blog/${blog.id}/like`, {
        method: 'POST',
        credentials: 'include',
      })
      if (!res.ok) {
        setLiked(prevLiked)
        setLikeCount(prevCount)
        window.dispatchEvent(
          new CustomEvent('blog:like-change', {
            detail: { blogId: blog.id, liked: prevLiked, likeCount: prevCount },
          })
        )
        return
      }
      const data = await res.json()
      if (typeof data?.liked === 'boolean' && data.liked !== nextLiked) {
        setLiked(data.liked)
        setLikeCount(data.liked ? prevCount + 1 : Math.max(0, prevCount - 1))
        window.dispatchEvent(
          new CustomEvent('blog:like-change', {
            detail: {
              blogId: blog.id,
              liked: data.liked,
              likeCount: data.liked ? prevCount + 1 : Math.max(0, prevCount - 1),
            },
          })
        )
      }
    } catch {
      setLiked(prevLiked)
      setLikeCount(prevCount)
      window.dispatchEvent(
        new CustomEvent('blog:like-change', {
          detail: { blogId: blog.id, liked: prevLiked, likeCount: prevCount },
        })
      )
    }
  }

  const safeUser: CurrentUserSafe = currentUser
  const shareUrl = useMemo(() => {
    if (typeof window === 'undefined') return ''
    return `${window.location.origin}/blog/${blogId}`
  }, [blogId])

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ url: shareUrl })
        return
      }
    } catch {
      // ignore
    }

    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Đã sao chép link bài viết')
    } catch {
      alert('Không thể chia sẻ lúc này')
    }
  }

  const handleSubmitComment = async () => {
    if (!blog) return
    if (!currentUser) {
      router.push('/login')
      return
    }
    const content = composer.trim()
    if (!content) return

    setPosting(true)
    try {
      const res = await fetch(`/api/blog/${blog.id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ content }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt)
      }
      setComposer('')
      setReloadKey((k) => k + 1)
    } catch {
      alert('Không thể gửi bình luận. Vui lòng thử lại.')
    } finally {
      setPosting(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[60] bg-black/45 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) close()
      }}
    >
      {/* Close button (outside card) */}
      <button
        onClick={close}
        className="fixed top-4 right-4 z-[70] h-10 w-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center text-xl"
        aria-label="Đóng"
      >
        ✕
      </button>

      <div
        ref={dialogRef}
        className="w-full max-w-5xl bg-black border border-gray-800 rounded-2xl overflow-hidden shadow-2xl md:h-[82vh] md:max-h-[760px]"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="p-10 text-gray-300 text-center">Đang tải...</div>
        )}

        {!loading && blog && (
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_0.8fr] md:h-full">
            {/* Left: media */}
            <div className="bg-black md:h-full">
              <BlogImages imageUrls={blog.imageUrls} rounded={false} frameMode="fill" />
            </div>

            {/* Right: content */}
            <div className="border-l border-gray-800 bg-[#212227] flex flex-col md:h-full min-h-0">
              {/* Scroll area chứa caption + comments */}
              <div className="flex-1 min-h-0 overflow-y-auto no-scrollbar">
                <div className="p-4 border-b border-gray-800">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">
                        <span className="text-white font-bold">
                          {blog.author.fullname.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-gray-100 font-semibold truncate">
                          {blog.author.fullname}
                        </p>
                        <p className="text-xs text-gray-400">
                          {formatTimeAgo(blog.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {blog.caption && (
                    <div className="mt-3 text-gray-200 whitespace-pre-wrap">
                      {blog.caption}
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <CommentSection
                    blogId={blog.id}
                    currentUser={safeUser}
                    inline={true}
                    showComposer={false}
                    inlineScrollable={false}
                    reloadKey={reloadKey}
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="mt-auto border-t border-gray-800">
                {/* Row: like + share + save */}
                <div className="px-4 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={handleLike}
                      className="flex items-center gap-2 text-gray-200 hover:text-white"
                      aria-label="Thích"
                    >
                      <Image
                        src={liked ? '/icons/liked.svg' : '/icons/like.svg'}
                        alt="Thích"
                        width={22}
                        height={22}
                      />
                      <span className="text-sm">{likeCount}</span>
                    </button>

                    <button
                      onClick={handleShare}
                      className="text-gray-200 hover:text-white"
                      aria-label="Chia sẻ"
                    >
                      <Image src="/icons/share.svg" alt="Chia sẻ" width={22} height={22} />
                    </button>
                  </div>

                  <button
                    onClick={() => setSaved((v) => !v)}
                    className="text-gray-200 hover:text-white"
                    aria-label="Lưu"
                  >
                    <Image
                      src={saved ? '/icons/saved.svg' : '/icons/bookmark.svg'}
                      alt="Lưu"
                      width={22}
                      height={22}
                    />
                  </button>
                </div>

                {/* Composer pinned bottom */}
                <div className="px-4 py-3 border-t border-gray-800 flex items-center gap-3">
                  <input
                    value={composer}
                    onChange={(e) => setComposer(e.target.value)}
                    placeholder="Bình luận..."
                    className="flex-1 bg-transparent border-0 px-0 py-2 text-gray-100 placeholder-gray-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void handleSubmitComment()
                      }
                    }}
                    disabled={posting}
                  />
                  <button
                    onClick={() => void handleSubmitComment()}
                    disabled={posting || !composer.trim()}
                    className="text-purple-primary font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Đăng
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}


