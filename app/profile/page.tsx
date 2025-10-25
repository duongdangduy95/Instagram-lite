'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import LikeButton from "../components/LikeButton";

interface Blog {
  _count: {
    likes: number
    comments: number
  }
  id: string
  caption: string
  imageUrl: string
  createdAt: string
  likes: Array<{ userId: string }> // Thêm thông tin likes để check user đã like chưa
}

interface Like {
  blog: Blog
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [myBlogs, setMyBlogs] = useState<Blog[]>([])
  const [likedBlogs, setLikedBlogs] = useState<Blog[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'liked'>('posts')
  const [editingPost, setEditingPost] = useState<string | null>(null)
  const [editCaption, setEditCaption] = useState<string>('')
  const [editImage, setEditImage] = useState<File | null>(null)
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/me', {
        credentials: 'include',
      })
      const data = await res.json()
      console.log(data)

      if (!data || data.error) return

      setUser(data)
      setMyBlogs(data.blogs)
      setLikedBlogs(data.likes.map((like: Like) => like.blog))
    }

    fetchData()
  }, [])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showDropdown) {
        setShowDropdown(null)
      }
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  const handleEditPost = (blog: Blog) => {
    setEditingPost(blog.id)
    setEditCaption(blog.caption)
    setEditImage(null)
  }

  const handleSaveEdit = async (blogId: string) => {
    setIsLoading(true)
    try {
      const formData = new FormData()
      formData.append('caption', editCaption)
      if (editImage) {
        formData.append('image', editImage)
      }

      const response = await fetch(`/api/blog/${blogId}`, {
        method: 'PATCH',
        body: formData,
        credentials: 'include',
      })

      if (response.ok) {
        const result = await response.json()
        // Update the blog in state
        setMyBlogs(prevBlogs => 
          prevBlogs.map(blog => 
            blog.id === blogId 
              ? { ...blog, caption: result.blog.caption, imageUrl: result.blog.imageUrl || blog.imageUrl }
              : blog
          )
        )
        setEditingPost(null)
        setEditCaption('')
        setEditImage(null)
        alert('Cập nhật bài viết thành công!')
      } else {
        alert('Có lỗi xảy ra khi cập nhật bài viết')
      }
    } catch (error) {
      console.error('Error updating post:', error)
      alert('Có lỗi xảy ra khi cập nhật bài viết')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancelEdit = () => {
    setEditingPost(null)
    setEditCaption('')
    setEditImage(null)
  }

  const handleDeletePost = async (blogId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
        // Remove the blog from state
        setMyBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
        setShowDeleteModal(null)
        alert('Xóa bài viết thành công!')
      } else {
        alert('Có lỗi xảy ra khi xóa bài viết')
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Có lỗi xảy ra khi xóa bài viết')
    } finally {
      setIsLoading(false)
    }
  }

  // Hàm để cập nhật like count trong state
  const handleLikeUpdate = (blogId: string, newCount: number, isLiked: boolean) => {
    // Cập nhật trong myBlogs
    setMyBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.id === blogId 
          ? { 
              ...blog, 
              _count: { 
                ...blog._count, 
                likes: newCount 
              },
              likes: isLiked 
                ? [...blog.likes, { userId: user.id }]
                : blog.likes.filter(like => like.userId !== user.id)
            }
          : blog
      )
    )

    // Cập nhật trong likedBlogs
    setLikedBlogs(prevBlogs => 
      prevBlogs.map(blog => 
        blog.id === blogId 
          ? { 
              ...blog, 
              _count: { 
                ...blog._count, 
                likes: newCount 
              },
              likes: isLiked 
                ? [...blog.likes, { userId: user.id }]
                : blog.likes.filter(like => like.userId !== user.id)
            }
          : blog
      )
    )

    // Nếu user unlike một bài viết, remove nó khỏi tab "Đã thích"
    if (!isLiked && activeTab === 'liked') {
      setLikedBlogs(prevBlogs => prevBlogs.filter(blog => blog.id !== blogId))
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-3 text-gray-600 text-center text-sm">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Cover Photo & Profile Section */}
      <div className="bg-white">
        {/* Cover Photo */}
        <div className="relative">
          <div className="h-80 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 relative overflow-hidden">
            <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          </div>
          
          {/* Profile Info Overlay */}
          <div className="absolute -bottom-6 left-6">
            <div className="flex items-end space-x-4">
              {/* Profile Picture */}
              <div className="relative">
                <div className="w-40 h-40 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-4xl font-bold text-white">
                    {user.fullname?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-500 rounded-full border-3 border-white"></div>
              </div>
              
              {/* Name and Username */}
              <div className="pb-4">
                <h1 className="text-3xl font-bold text-white drop-shadow-lg">{user.fullname}</h1>
                <p className="text-lg text-gray-200 drop-shadow">@{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Actions & Info */}
        <div className="pt-8 pb-4 px-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="mt-2 text-gray-600">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-1">
                    <span>📧</span>
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span>📱</span>
                    <span>{user.phone}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <Link
                href="/home"
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                🏠 Trang chủ
              </Link>
              <Link
                href="/blog/create"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                + Thêm bài viết
              </Link>
              <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors">
                ✏️ Chỉnh sửa trang cá nhân
              </button>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="px-6 border-t">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bài viết ({myBlogs.length})
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`py-4 font-medium border-b-2 transition-colors ${
                activeTab === 'liked'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Đã thích ({likedBlogs.length})
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-6 grid grid-cols-12 gap-6">
        {/* Left Sidebar */}
        <div className="col-span-12 lg:col-span-4 space-y-4">
          {/* Intro Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Giới thiệu</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2 text-gray-600">
                <span>👤</span>
                <span>Tên: {user.fullname}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>📧</span>
                <span>{user.email}</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <span>📱</span>
                <span>{user.phone}</span>
              </div>
            </div>
          </div>

          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Thống kê</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-xl font-bold text-blue-600">{myBlogs.length}</div>
                <div className="text-xs text-gray-600">Bài viết</div>
              </div>
              <div className="text-center p-3 bg-pink-50 rounded-lg">
                <div className="text-xl font-bold text-pink-600">{likedBlogs.length}</div>
                <div className="text-xs text-gray-600">Đã thích</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className="col-span-12 lg:col-span-8">
          {/* Create Post Card */}
          {activeTab === 'posts' && (
            <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-sm">
                    {user.fullname.charAt(0).toUpperCase()}
                  </span>
                </div>
                <Link
                  href="/blog/create"
                  className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-gray-500 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  {user.fullname} ơi, bạn đang nghĩ gì thế?
                </Link>
              </div>
              <div className="flex items-center justify-around mt-3 pt-3 border-t">
                <Link
                  href="/blog/create"
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center"
                >
                  <span className="text-green-500">📸</span>
                  <span className="text-gray-600 font-medium">Ảnh/Video</span>
                </Link>
              </div>
            </div>
          )}

          {/* Posts */}
          <div className="space-y-4">
            {(activeTab === 'posts' ? myBlogs : likedBlogs).map((blog) => (
              <div key={blog.id} className="bg-white rounded-lg shadow-sm">
                {/* Post Header */}
                <div className="p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold text-sm">
                        {user.fullname.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{user.fullname}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(blog.createdAt).toLocaleDateString('vi-VN', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                  
                  {/* Options Menu - Only show for own posts */}
                  {activeTab === 'posts' && (
                    <div className="relative">
                      <button 
                        className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors"
                        onClick={() => setShowDropdown(showDropdown === blog.id ? null : blog.id)}
                      >
                        <span className="text-xl">•••</span>
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showDropdown === blog.id && (
                        <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-10">
                          <button
                            onClick={() => {
                              handleEditPost(blog)
                              setShowDropdown(null)
                            }}
                            className="w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                          >
                            <span>✏️</span>
                            <span>Chỉnh sửa bài viết</span>
                          </button>
                          <button
                            onClick={() => {
                              setShowDeleteModal(blog.id)
                              setShowDropdown(null)
                            }}
                            className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                          >
                            <span>🗑️</span>
                            <span>Xóa bài viết</span>
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Edit Form or Post Content */}
                {editingPost === blog.id ? (
                  <div className="px-4 pb-3">
                    <textarea
                      value={editCaption}
                      onChange={(e) => setEditCaption(e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                      placeholder="Nhập nội dung bài viết..."
                    />
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                        className="mb-3"
                      />
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleSaveEdit(blog.id)}
                          disabled={isLoading}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="px-4 pb-3">
                    <p className="text-gray-900">{blog.caption}</p>
                  </div>
                )}

                {/* Post Image */}
                <Link href={`/blog/${blog.id}`}>
                  <div className="cursor-pointer">
                    <Image
                      src={blog.imageUrl}
                      alt={blog.caption}
                      width={600}
                      height={400}
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </Link>

                {/* Post Actions */}
                <div className="p-4">
                  <div className="flex items-center justify-between text-gray-500 text-sm mb-3">
                    <div className="flex items-center space-x-1">
                      <span className="text-blue-500">👍</span>
                      <span>{blog._count?.likes || 0}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <span>{blog._count?.comments || 0} bình luận</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-around border-t pt-2">
                    {/* Thay thế button Like cũ bằng LikeButton component */}
                    <LikeButton 
                      blogId={blog.id}
                      initialLiked={blog.likes?.some(like => like.userId === user.id) || false}
                      initialCount={blog._count?.likes || 0}
                      onLikeChange={handleLikeUpdate}
                    />
                    <Link
                      href={`/blog/${blog.id}`}
                      className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center"
                    >
                      <span className="text-gray-600">💬</span>
                      <span className="text-gray-600 font-medium">Bình luận</span>
                    </Link>
                    <button className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 rounded-lg transition-colors flex-1 justify-center">
                      <span className="text-gray-600">📤</span>
                      <span className="text-gray-600 font-medium">Chia sẻ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {(activeTab === 'posts' ? myBlogs : likedBlogs).length === 0 && (
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl text-gray-400">
                  {activeTab === 'posts' ? '📝' : '❤️'}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {activeTab === 'posts' ? 'Chưa có bài viết nào' : 'Chưa có bài viết được thích'}
              </h3>
              <p className="text-gray-500 mb-4">
                {activeTab === 'posts'
                  ? 'Chia sẻ khoảnh khắc đầu tiên của bạn!'
                  : 'Hãy bắt đầu khám phá và thích những bài viết bạn yêu thích!'}
              </p>
              {activeTab === 'posts' && (
                <Link
                  href="/blog/create"
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Tạo bài viết đầu tiên
                </Link>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Xác nhận xóa bài viết</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.
            </p>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => handleDeletePost(showDeleteModal)}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Đang xóa...' : 'Xóa bài viết'}
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
              >
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}