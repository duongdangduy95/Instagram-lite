'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import CommentSection from './CommentSection'
import Image from 'next/image'

interface BlogActionsProps {
  blogId: string
  displayBlogId: string
  initialLikeCount: number
  initialCommentCount: number
  initialLiked: boolean
  currentUser: {
    id: string
    fullname: string
    username: string
  } | null
}

export default function BlogActions({
  blogId,
  displayBlogId,
  initialLikeCount,
  initialCommentCount,
  initialLiked,
  currentUser
}: BlogActionsProps) {
  const router = useRouter()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [liked, setLiked] = useState(initialLiked)
  const [saved, setSaved] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showComments, setShowComments] = useState(false)
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)
  const [likeAnimating, setLikeAnimating] = useState(false)
  const [saveAnimating, setSaveAnimating] = useState(false)
  const [commentAnimating, setCommentAnimating] = useState(false)
  const [shareAnimating, setShareAnimating] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [shareCaption, setShareCaption] = useState('')
  const [shareLoading, setShareLoading] = useState(false)

  // Sử dụng useSession từ next-auth thay vì gọi API
  useEffect(() => {
    // Component này đã nhận currentUser từ props, nên không cần check auth
    // Nếu có currentUser thì đã authenticated
    setAuthenticated(currentUser !== null)
  }, [currentUser])

  const handleLike = async () => {
    if (authenticated === null || !authenticated) {
      router.push('/login')
      return
    }

    // Optimistic update - cập nhật UI ngay lập tức
    const previousLiked = liked
    const previousCount = likeCount
    const newLiked = !liked
    const newCount = newLiked ? likeCount + 1 : likeCount - 1

    // Cập nhật UI ngay
    setLiked(newLiked)
    setLikeCount(newCount)
    
    // Animation
    setLikeAnimating(true)
    setTimeout(() => setLikeAnimating(false), 300)

    setLoading(true)
    try {
      const response = await fetch(`/api/blog/${blogId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        // Chỉ cập nhật nếu response khác với optimistic update
        if (data.liked !== newLiked) {
          setLiked(data.liked)
          setLikeCount(data.liked ? likeCount + 1 : likeCount - 1)
        }
      } else {
        // Rollback nếu có lỗi
        setLiked(previousLiked)
        setLikeCount(previousCount)
        console.error('Like failed')
      }
    } catch (error) {
      // Rollback nếu có lỗi
      setLiked(previousLiked)
      setLikeCount(previousCount)
      console.error('Like error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = () => {
    // Animation
    setSaveAnimating(true)
    setTimeout(() => setSaveAnimating(false), 300)
    
    // Toggle saved state
    setSaved(!saved)
  }

  const handleComment = () => {
    // Animation
    setCommentAnimating(true)
    setTimeout(() => setCommentAnimating(false), 300)
    
    // Open comment modal
    setShowComments(true)
  }

  const handleShare = () => {
    if (authenticated === null || !authenticated) {
      router.push('/login')
      return
    }

    // Animation
    setShareAnimating(true)
    setTimeout(() => setShareAnimating(false), 300)
    
    // Mở modal share
    setShowShareModal(true)
  }

  const handleShareSubmit = async () => {
    setShareLoading(true)
    try {
      const response = await fetch('/api/blog/share', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          blogId: displayBlogId,
          caption: shareCaption,
        }),
      })

      if (response.ok) {
        // Đóng modal và reset
        setShowShareModal(false)
        setShareCaption('')
        // Refresh trang để hiển thị bài share mới
        router.refresh()
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Có lỗi xảy ra' }))
        alert(errorData.error || 'Chia sẻ bài viết thất bại')
      }
    } catch (error) {
      console.error('Error sharing blog:', error)
      alert('Chia sẻ bài viết thất bại')
    } finally {
      setShareLoading(false)
    }
  }

  return (
    <>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left side: Like, Comment, Share */}
          <div className="flex items-center space-x-4">
            {/* Like button with count */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLike}
                disabled={loading || authenticated === null}
                className={`text-gray-300 hover:text-gray-100 transition-all duration-300 disabled:opacity-50 ${
                  likeAnimating ? 'scale-75' : 'scale-100'
                }`}
              >
                <Image 
                  src={liked ? '/icons/liked.svg' : '/icons/like.svg'} 
                  alt="Thích" 
                  width={24} 
                  height={24}
                />
              </button>
              <span className="text-gray-300 text-sm font-medium">{likeCount}</span>
            </div>

            {/* Comment button with count */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleComment}
                className={`text-gray-300 hover:text-gray-100 transition-all duration-300 ${
                  commentAnimating ? 'scale-75' : 'scale-100'
                }`}
              >
                <Image 
                  src="/icons/chat.svg" 
                  alt="Bình luận" 
                  width={24} 
                  height={24}
                />
              </button>
              <span className="text-gray-300 text-sm font-medium">{commentCount}</span>
            </div>

            {/* Share button */}
            <button 
              onClick={handleShare}
              className={`text-gray-300 hover:text-gray-100 transition-all duration-300 ${
                shareAnimating ? 'scale-75' : 'scale-100'
              }`}
            >
              <Image 
                src="/icons/share.svg" 
                alt="Chia sẻ" 
                width={24} 
                height={24}
              />
            </button>
          </div>

          {/* Right side: Save button */}
          <button 
            onClick={handleSave}
            className={`text-gray-300 hover:text-gray-100 transition-all duration-300 ${
              saveAnimating ? 'scale-75' : 'scale-100'
            }`}
          >
            <Image 
              src={saved ? '/icons/saved.svg' : '/icons/bookmark.svg'} 
              alt="Lưu" 
              width={24} 
              height={24}
            />
          </button>
        </div>
      </div>

      {/* Comment Section Inline */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <CommentSection 
            blogId={blogId} 
            currentUser={currentUser}
            onCommentAdded={() => setCommentCount(prev => prev + 1)}
            onClose={() => setShowComments(false)}
            inline={true}
          />
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div 
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowShareModal(false)
              setShareCaption('')
            }
          }}
        >
          <div 
            className="bg-gray-900 rounded-lg p-6 w-full max-w-md border border-gray-800 animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-white font-semibold text-lg mb-4">Chia sẻ bài viết</h3>
            <textarea
              value={shareCaption}
              onChange={(e) => setShareCaption(e.target.value)}
              placeholder="Viết cảm nghĩ của bạn..."
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg p-3 mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-purple-primary"
              rows={4}
            />
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowShareModal(false)
                  setShareCaption('')
                }}
                className="px-4 py-2 text-gray-300 hover:text-white transition-colors"
                disabled={shareLoading}
              >
                Hủy
              </button>
              <button
                onClick={handleShareSubmit}
                disabled={shareLoading}
                className="px-4 py-2 bg-[#877EFF] text-white rounded-lg hover:bg-[#7565E6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {shareLoading ? 'Đang chia sẻ...' : 'Chia sẻ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
