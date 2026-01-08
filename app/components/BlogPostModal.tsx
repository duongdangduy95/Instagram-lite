'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import BlogImages from '@/app/components/BlogImages'
import CommentSection from '@/app/components/CommentSection'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'
import type { CurrentUserSafe } from '@/types/dto'
import RenderCaption from '@/app/components/RenderCaption'
import { usePathname, useRouter } from 'next/navigation'
import ShareModal from '@/app/components/ShareModal'


type BlogAuthor = {
  id: string
  fullname: string
  username: string
  image?: string | null
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
  savedBy?: { userId: string }[]
  _count: BlogCounts
}

export default function BlogPostModal({ blogId }: { blogId: string }) {
  const pathname = usePathname()
  const isOpen = pathname.startsWith('/blog/') && !pathname.endsWith('/edit')





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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [replyTo, setReplyTo] = useState<null | { parentId: string; username: string; fullname: string }>(null)
  const [showOptions, setShowOptions] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const composerRef = useRef<HTMLInputElement>(null)

  const dialogRef = useRef<HTMLDivElement>(null)
  const optionsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target as Node)) {
        setShowOptions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const close = useCallback(() => router.back(), [router])

  useEffect(() => {
    const handler = () => close()
    window.addEventListener('modal:close', handler)
    return () => window.removeEventListener('modal:close', handler)
  }, [close])


  // Lock background scroll while modal is open
  useEffect(() => {
    if (!isOpen) return
    const prevBodyOverflow = document.body.style.overflow
    const prevHtmlOverflow = document.documentElement.style.overflow
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBodyOverflow
      document.documentElement.style.overflow = prevHtmlOverflow
    }
  }, [isOpen])


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
        setSaved((data.savedBy?.length ?? 0) > 0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => {
      cancelled = true
    }
  }, [blogId, close])

  // Realtime update avatar/fullname/username nếu user vừa sửa profile ở tab khác
  useEffect(() => {
    const onProfileChange = (e: Event) => {
      const detail = (e as CustomEvent).detail as
        | { userId: string; fullname?: string | null; username?: string | null; image?: string | null }
        | undefined
      if (!detail?.userId) return
      setBlog((prev) => {
        if (!prev) return prev
        if (prev.author?.id !== detail.userId) return prev
        return {
          ...prev,
          author: {
            ...prev.author,
            fullname: (detail.fullname ?? prev.author.fullname) as string,
            username: (detail.username ?? prev.author.username) as string,
            image: typeof detail.image !== 'undefined' ? detail.image : prev.author.image,
          },
        }
      })
    }

    window.addEventListener('user:profile-change', onProfileChange as EventListener)
    return () => window.removeEventListener('user:profile-change', onProfileChange as EventListener)
  }, [])

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

  const handleShare = () => {
    if (!currentUser) {
      router.push('/login')
      return
    }
    setShowShareModal(true)
  }

  const safeUser: CurrentUserSafe = currentUser

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
        body: JSON.stringify({ content, parentId: replyTo?.parentId ?? null }),
      })
      if (!res.ok) {
        const txt = await res.text().catch(() => '')
        throw new Error(txt)
      }
      setComposer('')
      setReplyTo(null)
      setReloadKey((k) => k + 1)
    } catch {
      alert('Không thể gửi bình luận. Vui lòng thử lại.')
    } finally {
      setPosting(false)
    }
  }

  if (!isOpen) {
    return null
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
        className="w-full max-w-5xl bg-[#0B0E11] border border-gray-800 rounded-2xl overflow-hidden shadow-2xl h-[90vh] max-h-[90vh] md:h-[82vh] md:max-h-[760px]"
        onClick={(e) => e.stopPropagation()}
      >
        {loading && (
          <div className="p-10 text-gray-300 text-center">Đang tải...</div>
        )}

        {!loading && blog && (
          <>
            {/* Mobile Layout: Caption → Image → Comments (dọc từ trên xuống) */}
            <div className="flex flex-col h-full md:hidden">
              {/* 1. Caption Header */}
              <div className="border-b border-gray-800 bg-[#212227] flex-shrink-0 flex flex-col max-h-[30vh]">
                {/* Header Info - Fixed */}
                <div className="p-4 pb-3 flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                        {blog.author.image ? (
                          <Image
                            src={blog.author.image}
                            alt={blog.author.fullname}
                            width={36}
                            height={36}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          <span className="text-white font-bold">
                            {blog.author.fullname.charAt(0).toUpperCase()}
                          </span>
                        )}
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
                    {currentUser?.id === blog.author.id && (
                      <div className="relative" ref={optionsRef}>
                        <button
                          onClick={() => setShowOptions(!showOptions)}
                          className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                        >
                          <div
                            className="w-5 h-5 bg-[#7565E6]"
                            style={{
                              maskImage: 'url(/icons/edit.svg)',
                              maskRepeat: 'no-repeat',
                              maskPosition: 'center',
                              maskSize: 'contain',
                              WebkitMaskImage: 'url(/icons/edit.svg)',
                              WebkitMaskRepeat: 'no-repeat',
                              WebkitMaskPosition: 'center',
                              WebkitMaskSize: 'contain'
                            }}
                          />
                        </button>

                        {showOptions && (
                          <div className="absolute right-0 top-full mt-1 w-40 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-[100]">
                            <button
                              onClick={() => {
                                setShowOptions(false)
                                router.push(`/blog/${blog.id}/edit`)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-t-lg"
                            >
                              Chỉnh sửa
                            </button>

                            <button
                              onClick={() => {
                                setShowOptions(false)
                                setShowDeleteConfirm(true)
                              }}
                              className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-b-lg"
                            >
                              Xóa bài viết
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Caption - Scrollable */}
                {blog.caption && (
                  <div className="px-4 pb-4 overflow-y-auto scrollbar-win flex-1 min-h-0">
                    <div className="text-gray-200 whitespace-pre-wrap">
                      <RenderCaption text={blog.caption} />
                    </div>
                  </div>
                )}
              </div>

              {/* 2. Image/Video */}
              <div className="bg-[#0B0E11] flex-shrink-0">
                <BlogImages imageUrls={blog.imageUrls} rounded={false} frameMode="aspect" />
              </div>

              {/* 3. Actions (Like, Share, Save) */}
              <div className="px-4 py-3 border-t border-gray-800 bg-[#212227] flex items-center justify-between flex-shrink-0">
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
                  onClick={async () => {
                    if (!currentUser) {
                      router.push('/login')
                      return
                    }
                    const prevSaved = saved
                    setSaved(!prevSaved)
                    try {
                      const res = await fetch(`/api/blog/${blog.id}/save`, {
                        method: 'POST',
                        credentials: 'include',
                      })
                      if (!res.ok) {
                        setSaved(prevSaved)
                        return
                      }
                      const data = await res.json()
                      if (typeof data?.saved === 'boolean') {
                        setSaved(data.saved)
                      }
                    } catch {
                      setSaved(prevSaved)
                    }
                  }}
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

              {/* 4. Comments Section */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-win bg-[#212227] border-t border-gray-800 max-h-[40vh]">
                <div className="p-4">
                  <CommentSection
                    blogId={blog.id}
                    currentUser={safeUser}
                    inline={true}
                    showComposer={false}
                    inlineScrollable={false}
                    reloadKey={reloadKey}
                    onRequestReply={({ parentId, username, fullname }) => {
                      setReplyTo({ parentId, username, fullname })

                      // Prefill @tag cơ bản
                      if (username) {
                        const mention = `@${username}`
                        setComposer((prev) => {
                          const prevTrim = prev.trimStart()
                          const replaced = prevTrim.replace(/^@[^\s]+\s+/, '')
                          const nextBase = replaced.length > 0 ? replaced : ''
                          return `${mention} ${nextBase}`.trimEnd() + ' '
                        })
                      }

                      requestAnimationFrame(() => composerRef.current?.focus())
                    }}
                  />
                </div>
              </div>

              {/* 5. Comment Composer (pinned bottom) */}
              <div className="border-t border-gray-800 bg-[#212227] flex-shrink-0">
                {replyTo && (
                  <div className="px-4 pt-3 text-xs text-purple-primary flex items-center justify-between gap-3">
                    <div className="truncate">
                      Đang trả lời{' '}
                      <span className="font-semibold">
                        {replyTo.username ? `@${replyTo.username}` : replyTo.fullname}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="text-gray-400 hover:text-gray-200 underline whitespace-nowrap"
                      onClick={() => setReplyTo(null)}
                    >
                      Huỷ
                    </button>
                  </div>
                )}

                <div className="px-4 py-3 flex items-center gap-3">
                  <input
                    ref={composerRef}
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

            {/* Desktop Layout: Image Left | Caption + Comments Right (giữ nguyên) */}
            <div className="hidden md:grid md:grid-cols-[1.2fr_0.8fr] md:h-full">
              {/* Left: media */}
              <div className="bg-[#0B0E11] md:h-full">
                <BlogImages imageUrls={blog.imageUrls} rounded={false} frameMode="fill" />
              </div>

              {/* Right: content */}
              <div className="border-l border-gray-800 bg-[#212227] flex flex-col md:h-full min-h-0">
                {/* Scroll area chứa caption + comments */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-win">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                          {blog.author.image ? (
                            <Image
                              src={blog.author.image}
                              alt={blog.author.fullname}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {blog.author.fullname.charAt(0).toUpperCase()}
                            </span>
                          )}
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
                      {currentUser?.id === blog.author.id && (
                        <div className="relative" ref={optionsRef}>
                          <button
                            onClick={() => setShowOptions(!showOptions)}
                            className="p-2 rounded-full hover:bg-gray-800 transition-colors"
                          >
                            <div
                              className="w-5 h-5 bg-[#7565E6]"
                              style={{
                                maskImage: 'url(/icons/edit.svg)',
                                maskRepeat: 'no-repeat',
                                maskPosition: 'center',
                                maskSize: 'contain',
                                WebkitMaskImage: 'url(/icons/edit.svg)',
                                WebkitMaskRepeat: 'no-repeat',
                                WebkitMaskPosition: 'center',
                                WebkitMaskSize: 'contain'
                              }}
                            />
                          </button>

                          {showOptions && (
                            <div className="absolute right-0 top-full mt-1 w-40 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-[100]">
                              <button
                                onClick={() => {
                                  setShowOptions(false)
                                  router.push(`/blog/${blog.id}/edit`)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-t-lg"
                              >
                                Chỉnh sửa
                              </button>

                              <button
                                onClick={() => {
                                  setShowOptions(false)
                                  setShowDeleteConfirm(true)
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 rounded-b-lg"
                              >
                                Xóa bài viết
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {blog.caption && (
                      <div className="mt-3 text-gray-200 whitespace-pre-wrap">
                        <RenderCaption text={blog.caption} />
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
                      onRequestReply={({ parentId, username, fullname }) => {
                        setReplyTo({ parentId, username, fullname })

                        // Prefill @tag cơ bản
                        if (username) {
                          const mention = `@${username}`
                          setComposer((prev) => {
                            const prevTrim = prev.trimStart()
                            const replaced = prevTrim.replace(/^@[^\s]+\s+/, '')
                            const nextBase = replaced.length > 0 ? replaced : ''
                            return `${mention} ${nextBase}`.trimEnd() + ' '
                          })
                        }

                        requestAnimationFrame(() => composerRef.current?.focus())
                      }}
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-auto border-t border-gray-800">
                  {replyTo && (
                    <div className="px-4 pt-3 text-xs text-purple-primary flex items-center justify-between gap-3">
                      <div className="truncate">
                        Đang trả lời{' '}
                        <span className="font-semibold">
                          {replyTo.username ? `@${replyTo.username}` : replyTo.fullname}
                        </span>
                      </div>
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-200 underline whitespace-nowrap"
                        onClick={() => setReplyTo(null)}
                      >
                        Huỷ
                      </button>
                    </div>
                  )}

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
                      onClick={async () => {
                        if (!currentUser) {
                          router.push('/login')
                          return
                        }
                        const prevSaved = saved
                        setSaved(!prevSaved)
                        try {
                          const res = await fetch(`/api/blog/${blog.id}/save`, {
                            method: 'POST',
                            credentials: 'include',
                          })
                          if (!res.ok) {
                            setSaved(prevSaved)
                            return
                          }
                          const data = await res.json()
                          if (typeof data?.saved === 'boolean') {
                            setSaved(data.saved)
                          }
                        } catch {
                          setSaved(prevSaved)
                        }
                      }}
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
                      ref={composerRef}
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
          </>
        )}
      </div>


      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
          onClick={(e) => e.stopPropagation()} // Prevent clicking through
        >
          <div className="w-full max-w-sm bg-[#212227] border border-gray-700 rounded-lg p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-white mb-2">Xóa bài viết?</h2>
            <p className="text-gray-300 mb-6 text-sm">
              Bạn có chắc chắn muốn xóa bài viết này không?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={async () => {
                  if (blog?.id) {
                    await fetch(`/api/blog/${blog.id}`, { method: 'DELETE' })
                    window.dispatchEvent(new CustomEvent('blog:deleted', { detail: { blogId: blog.id } }))
                    close()
                    router.refresh()
                  }
                }}
                className="px-4 py-2 rounded-lg bg-[#7565E6] hover:bg-[#6455C2] text-white text-sm font-medium transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Share Modal */}
      {blog && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          blogId={blog.id}
        />
      )}
    </div>
  )
}


