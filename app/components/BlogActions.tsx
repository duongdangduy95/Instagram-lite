'use client'

import { useState } from 'react'
import LikeButton from './LikeButton'
import CommentToggle from './CommentToggle'
import ShareButton from './ShareButton'

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
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [commentCount, setCommentCount] = useState(initialCommentCount)

  return (
    <div className="px-4 pb-4">
      <div className="flex justify-between text-sm text-gray-500 mb-2">
        <span>{likeCount} lượt thích</span>
        <span>{commentCount} bình luận</span>
      </div>

      <div className="flex space-x-4 border-t pt-2">
        <LikeButton
          blogId={blogId}
          initialLiked={initialLiked}
          initialCount={initialLikeCount}
          onLikeChange={(newCount) => setLikeCount(newCount)}
        />

        <CommentToggle
          blogId={blogId}
          currentUser={currentUser}
          onCommentAdded={() => setCommentCount(prev => prev + 1)}
        />

        <ShareButton
          blogId={displayBlogId}
        />
      </div>
    </div>
  )
}
