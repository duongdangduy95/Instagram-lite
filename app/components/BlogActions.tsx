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
    // Animation
    setShareAnimating(true)
    setTimeout(() => setShareAnimating(false), 300)
    
    // TODO: Implement share functionality
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
    </>
  )
}
