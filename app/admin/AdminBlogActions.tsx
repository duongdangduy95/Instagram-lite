'use client'

import { useState, useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import CommentSection from '../components/CommentSection'
import Image from 'next/image'
import DeleteConfirmModal from './DeleteConfirmModal'

interface AdminBlogActionsProps {
  blogId: string
  displayBlogId: string
  initialCommentCount: number
  onBlogDeleted?: (blogId: string) => void // Callback khi xóa bài viết thành công, truyền blogId để xóa khỏi list
}

export default function AdminBlogActions({
  blogId,
  displayBlogId,
  initialCommentCount,
  onBlogDeleted,
}: AdminBlogActionsProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [showComments, setShowComments] = useState(false)
  const [commentAnimating, setCommentAnimating] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const handleComment = () => {
    // Animation
    setCommentAnimating(true)
    setTimeout(() => setCommentAnimating(false), 300)

    // Admin luôn mở inline comments, không push route
    setShowComments(true)
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/admin/blog/${blogId}/delete`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
      })

      if (res.ok) {
        // Gọi callback để xóa bài khỏi list ngay lập tức
        onBlogDeleted?.(blogId)
      } else {
        const data = await res.json()
        alert(data.error || 'Có lỗi xảy ra khi xóa bài viết')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Có lỗi xảy ra khi xóa bài viết')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <>
      <div className="px-4 py-3 border-t border-gray-800">
        <div className="flex items-center justify-between">
          {/* Left side: Comment */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleComment}
              className={`text-gray-300 hover:text-gray-100 transition-all duration-300 ${commentAnimating ? 'scale-75' : 'scale-100'
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

          {/* Right side: Delete button */}
          <button
            onClick={() => setShowDeleteModal(true)}
            disabled={deleting}
            className="px-4 py-1.5 bg-red-600 text-white text-sm rounded hover:bg-red-700 disabled:opacity-50 transition-colors"
          >
            {deleting ? 'Đang xóa...' : 'Xóa bài viết'}
          </button>
        </div>
      </div>

      {/* Comment Section Inline - Chỉ hiển thị comments, không cho phép comment mới, nhưng cho phép admin xóa */}
      {showComments && (
        <div className="px-4 pb-4 border-t border-gray-800 pt-3">
          <CommentSection
            blogId={blogId}
            currentUser={{ id: 'admin', username: 'admin', fullname: 'Admin', image: null }} // Mock user cho admin view
            onCommentAdded={() => setCommentCount(prev => prev + 1)}
            onCommentDeleted={() => setCommentCount(prev => Math.max(0, prev - 1))} // Giảm số comment khi xóa
            onClose={() => setShowComments(false)}
            inline={true}
            showComposer={false} // Ẩn composer cho admin
            isAdmin={true} // Cho phép admin xóa comment
          />
        </div>
      )}

      {/* Delete Confirm Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Xóa bài viết"
        message="Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác."
        confirmText="Xóa"
        cancelText="Hủy"
      />
    </>
  )
}
