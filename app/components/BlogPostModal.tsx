'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import BlogImages from '@/app/components/BlogImages'
import CommentSection from '@/app/components/CommentSection'
import { formatTimeAgo } from '@/lib/formatTimeAgo'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'
import type { CurrentUserSafe } from '@/types/dto'
import RenderCaption from '@/app/components/RenderCaption'
import { usePathname, useRouter } from 'next/navigation'
import ShareModal from '@/app/components/ShareModal'
import ExpandableCaption from '@/app/components/ExpandableCaption'
import ReportModal from '@/app/components/ReportModal'


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
  music?: {
    provider: 'deezer'
    trackId: number
    title: string
    artist: string
    previewUrl: string
    coverUrl?: string | null
    durationSec?: number | null
  } | null
  createdAt: string
  hashtags?: string[]
  author: BlogAuthor
  sharedFrom?: {
    id: string
    caption?: string | null
    imageUrls: string[]
    music?: {
      provider: 'deezer'
      trackId: number
      title: string
      artist: string
      previewUrl: string
      coverUrl?: string | null
      durationSec?: number | null
    } | null
    createdAt: string
    author: BlogAuthor
    _count: BlogCounts
  } | null
  likes?: { userId: string }[]
  savedBy?: { userId: string }[]
  _count: BlogCounts
}

export default function BlogPostModal({ blogId, isAdmin = false, }: { blogId: string, isAdmin?: boolean}) {
  const pathname = usePathname()
  const isOpen =
  (pathname.startsWith('/blog/') || pathname.startsWith('/admin/blog/')) &&
  !pathname.endsWith('/edit')




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
  const [showReportModal, setShowReportModal] = useState(false)

  const dialogRef = useRef<HTMLDivElement>(null)
  // Lưu ý: mobile + desktop đều render đồng thời (chỉ khác CSS md:hidden/hidden md:*),
  // nên không được dùng chung 1 ref cho dropdown options.
  const optionsRefMobile = useRef<HTMLDivElement>(null)
  const optionsRefDesktop = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Node | null
      if (!target) return

      const inMobile = optionsRefMobile.current?.contains(target) ?? false
      const inDesktop = optionsRefDesktop.current?.contains(target) ?? false
      if (inMobile || inDesktop) return
      setShowOptions(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    return () => document.removeEventListener('pointerdown', handlePointerDown)
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
    // Stop any preview playing in feed/background to avoid double audio when opening modal
    window.dispatchEvent(new CustomEvent('music:stop'))
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
    setBlog(null)
    setLoading(true)
    setLiked(false)
    setLikeCount(0)
    setSaved(false)
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

  const isShared = !!blog?.sharedFrom
  const displayBlog = blog?.sharedFrom ?? blog

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

  // if (!isOpen) {
  //   return null
  // }

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
            {/* Mobile Layout: Header fixed → Scrollable (Caption + Image + Comments) → Actions fixed → Composer fixed */}
            <div className="flex flex-col h-full md:hidden">
              {/* 1. Header - Fixed */}
              <div className="border-b border-gray-800 bg-[#212227] flex-shrink-0 p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/profile/${blog.author.id}`}
                      onClick={(e) => e.stopPropagation()}
                      className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
                    >
                      {blog.author.image ? (
                        <Image
                          src={blog.author.image}
                          alt={blog.author.username}
                          width={36}
                          height={36}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-white font-bold">
                          {blog.author.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </Link>
                    <div className="min-w-0">
                      <Link
                        href={`/profile/${blog.author.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-gray-100 font-semibold truncate hover:text-purple-primary transition-colors block"
                      >
                        {blog.author.username}
                      </Link>
                      <p className="text-xs text-gray-400">
                        {formatTimeAgo(blog.createdAt)}
                      </p>
                    </div>
                  </div>
                  {currentUser?.id === blog.author.id && (
                    <div className="relative" ref={optionsRefMobile}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          e.preventDefault()
                          setShowOptions(!showOptions)
                        }}
                        onPointerDown={(e) => e.stopPropagation()}
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
                        <div
                          className="absolute right-0 top-full mt-1 w-40 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-[200]"
                          onClick={(e) => {
                            e.stopPropagation()
                            e.preventDefault()
                          }}
                          onPointerDown={(e) => e.stopPropagation()}
                          onMouseDown={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setShowOptions(false)
                              router.push(`/blog/${blog.id}/edit`)
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => {
                              e.stopPropagation()
                            }}
                            className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-t-lg"
                          >
                            Chỉnh sửa
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setShowOptions(false)
                              setShowDeleteConfirm(true)
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
                            onMouseDown={(e) => {
                              e.stopPropagation()
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

              {/* 2. Scrollable Content: Caption + Image + Comments */}
              <div className="flex-1 min-h-0 overflow-y-auto scrollbar-win bg-[#212227]">
                {/* Content: Shared vs Normal */}
                {isShared ? (
                  <div className="px-4 py-4">
                    {/* Sharer Caption */}
                    {blog.caption && (
                      <div className="mb-3 text-gray-200 whitespace-pre-wrap text-sm">
                        <RenderCaption text={blog.caption} />
                      </div>
                    )}

                    {/* Inner Card */}
                    <div className="rounded-2xl overflow-hidden border border-gray-800 bg-gray-900/40">
                      {/* Media */}
                      <Link href={`/blog/${displayBlog?.id}`} className="block" onClick={close}>
                        <div className="bg-gray-900">
                          {displayBlog && (
                            <BlogImages
                              imageUrls={displayBlog.imageUrls}
                              music={(displayBlog as any).music ?? null}
                              musicKey={displayBlog.id}
                              rounded={false}
                              frameMode="aspect"
                            />
                          )}
                        </div>
                      </Link>

                      {/* Original Info + Caption */}
                      <div className="px-4 py-3 border-t border-gray-800">
                        <Link
                          href={`/profile/${displayBlog?.author.id}`}
                          onClick={(e) => { e.stopPropagation(); close() }}
                          className="block mb-2"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                              {displayBlog?.author.image ? (
                                <Image src={displayBlog.author.image} alt={displayBlog.author.username} width={32} height={32} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-white text-xs">
                                  {displayBlog?.author.username.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-100 text-sm">
                                {displayBlog?.author.username}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {displayBlog && formatTimeAgo(displayBlog.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>

                        {displayBlog?.caption && (
                          <div className="text-gray-200 text-sm whitespace-pre-wrap">
                            <RenderCaption text={displayBlog.caption} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Caption */}
                    {blog.caption && (
                      <div className="px-4 pt-4 pb-2">
                        <div className="text-gray-200 whitespace-pre-wrap">
                          <RenderCaption text={blog.caption} />
                        </div>
                      </div>
                    )}

                    {/* Image/Video */}
                    <div className="bg-[#0B0E11]">
                      <BlogImages imageUrls={blog.imageUrls} music={(blog as any).music ?? null} musicKey={blog.id} rounded={false} frameMode="aspect" />
                    </div>
                  </>
                )}

                {/* Comments Section */}
                <div className="p-4 border-t border-gray-800">
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

              {/* 3. Actions (Like, Share, Save) - Fixed */}
              <div className="px-4 py-3 border-t border-gray-800 bg-[#212227] flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-4">
                  <button
                    onClick={isAdmin ? undefined : handleLike}
                    disabled={isAdmin}
                    className={`flex items-center gap-2 ${
                      isAdmin ? "opacity-40 cursor-not-allowed" : "hover:text-white"
                    }`}
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
                    onClick={isAdmin ? undefined : handleShare}
                    disabled={isAdmin}
                    className={isAdmin ? "opacity-40 cursor-not-allowed" : ""}
                    aria-label="Chia sẻ"
                  >
                    <Image src="/icons/share.svg" alt="Chia sẻ" width={22} height={22} />
                  </button>
                </div>

                <div className="flex items-center gap-4">
                  {/* Save */}
                  <button
                    onClick={async () => {
                      if (!currentUser) {
                        router.push('/login')
                        return
                      }
                      const prevSaved = saved
                      const newSaved = !prevSaved
                      setSaved(newSaved)
                      try {
                        const res = await fetch(`/api/blog/${blog.id}/save`, {
                          method: 'POST',
                          credentials: 'include',
                        })
                        if (!res.ok) {
                          setSaved(prevSaved)
                          window.dispatchEvent(
                            new CustomEvent('blog:save-change', {
                              detail: { blogId: blog.id, saved: prevSaved },
                            })
                          )
                          return
                        }
                        const data = await res.json()
                        const finalSaved = typeof data?.saved === 'boolean' ? data.saved : newSaved
                        setSaved(finalSaved)
                        window.dispatchEvent(
                          new CustomEvent('blog:save-change', {
                            detail: { blogId: blog.id, saved: finalSaved },
                          })
                        )
                      } catch {
                        setSaved(prevSaved)
                        window.dispatchEvent(
                          new CustomEvent('blog:save-change', {
                            detail: { blogId: blog.id, saved: prevSaved },
                          })
                        )
                      }
                    }}
                    className="text-gray-200 hover:text-white"
                    aria-label="Lưu"
                  >
                    <Image
                      src={saved ? '/icons/saved.svg' : '/icons/save.svg'}
                      alt="Lưu"
                      width={22}
                      height={22}
                    />
                  </button>

                  {/* Report */}
                  <button
                    onClick={() => {
                      setShowReportModal(true)
                    }}
                    className="text-yellow-500 hover:text-yellow-400 transition-all duration-300"
                    aria-label="Báo cáo"
                  >
                    <Image src="/icons/report.svg" alt="Báo cáo" width={24} height={24} />
                  </button>

                  {/* Modal */}
                  <ReportModal
                    isOpen={showReportModal}
                    onClose={() => setShowReportModal(false)}
                    blogId={blogId}
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
                    placeholder={isAdmin ? "Admin không được bình luận" : "Bình luận..."}
                    className="flex-1 bg-transparent border-0 px-0 py-2 text-gray-100 placeholder-gray-500 focus:outline-none"
                    onKeyDown={(e) => {
                      if (!isAdmin && e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        void handleSubmitComment()
                      }
                    }}
                    disabled={posting}
                  />
                  <button
                    onClick={() => void handleSubmitComment()}
                    disabled={posting || !composer.trim() || isAdmin}
                    className="p-1.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <img
                      src="/icons/send-solid-purple.svg"
                      alt="Đăng"
                      className="w-5 h-5"
                    />
                  </button>
                </div>
              </div>
            </div>

            {/* Desktop Layout: Image Left | Caption + Comments Right (giữ nguyên) */}
            <div className="hidden md:grid md:grid-cols-[1.2fr_0.8fr] md:h-full">
              {/* Left: media or Shared Card */}
              <div className="bg-[#0B0E11] md:h-full overflow-y-auto scrollbar-win flex items-center justify-center">
                {isShared ? (
                  <div className="w-full h-full flex flex-col">
                    <div className="flex-1 flex flex-col border border-gray-800 bg-gray-900/40">
                      {/* Media - Flex grow to fill available space, centered */}
                      <Link
                        href={`/blog/${displayBlog?.id}`}
                        className="flex-1 bg-gray-900 flex items-center justify-center overflow-hidden min-h-0 relative group"
                        onClick={close}
                      >
                        {displayBlog && (
                          <BlogImages
                            imageUrls={displayBlog.imageUrls}
                            music={(displayBlog as any).music ?? null}
                            musicKey={displayBlog.id}
                            rounded={false}
                            frameMode="aspect"
                          />
                        )}
                      </Link>

                      {/* Original Info + Caption - Fixed at bottom of left panel */}
                      <div className="px-4 py-3 border-t border-gray-800 bg-[#0B0E11] flex-shrink-0">
                        <Link
                          href={`/profile/${displayBlog?.author.id}`}
                          onClick={(e) => { e.stopPropagation() }}
                          className="block mb-2"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden">
                              {displayBlog?.author.image ? (
                                <Image src={displayBlog.author.image} alt={displayBlog.author.username} width={32} height={32} className="w-full h-full object-cover" />
                              ) : (
                                <span className="font-bold text-white text-xs">
                                  {displayBlog?.author.username.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <div>
                              <p className="font-semibold text-gray-100 text-sm">
                                {displayBlog?.author.username}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {displayBlog && formatTimeAgo(displayBlog.createdAt)}
                              </p>
                            </div>
                          </div>
                        </Link>

                        {displayBlog?.caption && (
                          <div className="text-gray-200 text-sm">
                            <ExpandableCaption text={displayBlog.caption} initialLines={3} />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <BlogImages imageUrls={blog.imageUrls} music={(blog as any).music ?? null} musicKey={blog.id} rounded={false} frameMode="fill" />
                )}
              </div>

              {/* Right: content */}
              <div className="border-l border-gray-800 bg-[#212227] flex flex-col md:h-full min-h-0">
                {/* Scroll area chứa caption + comments */}
                <div className="flex-1 min-h-0 overflow-y-auto scrollbar-win">
                  <div className="p-4 border-b border-gray-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/profile/${blog.author.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden"
                        >
                          {blog.author.image ? (
                            <Image
                              src={blog.author.image}
                              alt={blog.author.username}
                              width={36}
                              height={36}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-white font-bold">
                              {blog.author.username.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </Link>
                        <div className="min-w-0">
                          <Link
                            href={`/profile/${blog.author.id}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-gray-100 font-semibold truncate hover:text-purple-primary transition-colors block"
                          >
                            {blog.author.username}
                          </Link>
                          <p className="text-xs text-gray-400">
                            {formatTimeAgo(blog.createdAt)}
                            {isShared && ' đã chia sẻ'}
                          </p>
                        </div>
                      </div>
                      {currentUser?.id === blog.author.id && (
                        <div className="relative" ref={optionsRefDesktop}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              e.preventDefault()
                              setShowOptions(!showOptions)
                            }}
                            onPointerDown={(e) => e.stopPropagation()}
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
                            <div
                              className="absolute right-0 top-full mt-1 w-40 bg-[#0B0E11] border border-gray-800 rounded-lg shadow-lg z-[200]"
                              onClick={(e) => {
                                e.stopPropagation()
                                e.preventDefault()
                              }}
                              onPointerDown={(e) => e.stopPropagation()}
                              onMouseDown={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  setShowOptions(false)
                                  router.push(`/blog/${blog.id}/edit`)
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
                                }}
                                className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-gray-800 rounded-t-lg"
                              >
                                Chỉnh sửa
                              </button>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  e.preventDefault()
                                  setShowOptions(false)
                                  setShowDeleteConfirm(true)
                                }}
                                onPointerDown={(e) => e.stopPropagation()}
                                onMouseDown={(e) => {
                                  e.stopPropagation()
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

                    {isShared && (
                      <div className="mt-2 text-xs text-gray-400 italic">
                        Đã chia sẻ bài viết của <Link href={`/profile/${displayBlog?.author.id}`} className="font-semibold text-gray-300 hover:text-white">{displayBlog?.author.username}</Link>
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
                    <div className="flex items-center gap-4">
                      <button
                        onClick={async () => {
                          if (!currentUser) {
                            router.push('/login')
                            return
                          }
                          const prevSaved = saved
                          const newSaved = !prevSaved
                          setSaved(newSaved)
                          try {
                            const res = await fetch(`/api/blog/${blog.id}/save`, {
                              method: 'POST',
                              credentials: 'include',
                            })
                            if (!res.ok) {
                              setSaved(prevSaved)
                              window.dispatchEvent(
                                new CustomEvent('blog:save-change', {
                                  detail: { blogId: blog.id, saved: prevSaved },
                                })
                              )
                              return
                            }
                            const data = await res.json()
                            const finalSaved = typeof data?.saved === 'boolean' ? data.saved : newSaved
                            setSaved(finalSaved)
                            // Dispatch event to sync with home feed
                            window.dispatchEvent(
                              new CustomEvent('blog:save-change', {
                                detail: { blogId: blog.id, saved: finalSaved },
                              })
                            )
                          } catch {
                            setSaved(prevSaved)
                            window.dispatchEvent(
                              new CustomEvent('blog:save-change', {
                                detail: { blogId: blog.id, saved: prevSaved },
                              })
                            )
                          }
                        }}
                        className="text-gray-200 hover:text-white"
                        aria-label="Lưu"
                      >
                        <Image
                          src={saved ? '/icons/saved.svg' : '/icons/save.svg'}
                          alt="Lưu"
                          width={22}
                          height={22}
                        />
                      </button>

                      {/* Report */}
                      <button
                        onClick={() => {
                          setShowReportModal(true)
                        }}
                        className="text-yellow-500 hover:text-yellow-400 transition-all duration-300"
                        aria-label="Báo cáo"
                      >
                        <Image src="/icons/report.svg" alt="Báo cáo" width={24} height={24} />
                      </button>

                      {/* Modal */}
                      <ReportModal
                        isOpen={showReportModal}
                        onClose={() => setShowReportModal(false)}
                        blogId={blogId}
                      />
                    </div>
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
                        if (!isAdmin && e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          void handleSubmitComment()
                        }
                      }}
                      disabled={posting}
                    />

                    <button
                      onClick={() => void handleSubmitComment()}
                      disabled={posting || !composer.trim() || isAdmin}
                      className="p-1.5 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <img
                        src="/icons/send-solid-purple.svg"
                        alt="Đăng"
                        className="w-5 h-5"
                      />
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
                    await fetch(`/api/blog/${blog.id}`, { method: 'DELETE', credentials: 'include' })
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


