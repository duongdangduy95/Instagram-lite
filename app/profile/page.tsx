'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from "../components/Navigation"
import FollowModal from '../components/FollowModal'

interface Blog {
  _count: {
    likes: number
    comments: number
  }
  id: string
  caption: string
  imageUrls: string[]
  createdAt: string
  isdeleted?: boolean
  likes: Array<{ userId: string }>
  sharedFrom?: {
    id: string
    caption: string
    imageUrls: string[]
    createdAt: string
    isdeleted?: boolean
    author: {
      id: string
      fullname: string
      username: string
    }
    _count: {
      likes: number
      comments: number
    }
  }
  author?: {
    id: string
    fullname: string
    username: string
  }
}

interface Like {
  blog: Blog
}

interface UserType {
  id: string
  fullname: string
  image?: string | null
  email: string
  phone?: string
  username: string
  blogs: Blog[]
  likes: Like[]
  _count: {
    followers: number
    following: number
  }
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserType | null>(null)
  const [myBlogs, setMyBlogs] = useState<Blog[]>([])
  const [likedBlogs, setLikedBlogs] = useState<Blog[]>([])
  const [savedBlogs, setSavedBlogs] = useState<Blog[]>([])
  const [activeTab, setActiveTab] = useState<'posts' | 'shared' | 'saved' | 'liked'>('posts')
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [showDropdown, setShowDropdown] = useState<string | null>(null)
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('/api/me', {
        credentials: 'include',
      })
      const data = await res.json()

      if (!data || data.error) return

      setUser(data)
      setMyBlogs((data.blogs || []).filter(b => !b.isdeleted))
      setLikedBlogs(data.likes?.map((like: Like) => like.blog).filter((b: Blog | null) => b !== null) || [])
    }

    fetchData()

    const onBlogCreated = () => fetchData()
    const onBlogDeleted = (e: Event) => {
      const detail = (e as CustomEvent).detail as { blogId: string } | undefined
      if (detail?.blogId) {
        setMyBlogs((prev) => prev.filter((b) => b.id !== detail.blogId))
      }
    }

    window.addEventListener('blog:created', onBlogCreated)
    window.addEventListener('blog:deleted', onBlogDeleted)

    return () => {
      window.removeEventListener('blog:created', onBlogCreated)
      window.removeEventListener('blog:deleted', onBlogDeleted)
    }
  }, [])

  useEffect(() => {
    if (activeTab === 'saved' && savedBlogs.length === 0) {
      const fetchSaved = async () => {
        setIsLoading(true)
        try {
          const res = await fetch('/api/user/saved', { credentials: 'include' })
          const data = await res.json()
          if (Array.isArray(data)) {
            setSavedBlogs(data.filter((b: Blog) => b && b.id && !b.isdeleted))
          }
        } catch (error) {
          console.error('Error fetching saved blogs:', error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchSaved()
    }
  }, [activeTab, savedBlogs.length])

  // Listen for save/unsave events to refresh saved posts in real-time
  useEffect(() => {
    const handleSaveChange = () => {
      // Only refetch if we're on the saved tab and have already loaded data
      if (activeTab === 'saved' && savedBlogs.length > 0) {
        fetch('/api/user/saved', { credentials: 'include' })
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setSavedBlogs(data.filter((b: Blog) => b && b.id && !b.isdeleted))
            }
          })
          .catch(err => console.error('Error refetching saved blogs:', err))
      }
    }

    window.addEventListener('blog:save-change', handleSaveChange)
    return () => window.removeEventListener('blog:save-change', handleSaveChange)
  }, [activeTab, savedBlogs.length])

  useEffect(() => {
    if (!showDropdown) return

    const handleClickOutside = () => {
      setShowDropdown(null)
    }

    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [showDropdown])

  const handleDeletePost = async (blogId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/blog/${blogId}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (response.ok) {
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

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  const followersCount = user._count?.followers || 0
  const followingCount = user._count?.following || 0

  const originalBlogs = myBlogs.filter((b) => !b.sharedFrom && !b.isdeleted)
  const sharedBlogs = myBlogs.filter((b) => !!b.sharedFrom && !b.isdeleted)

  return (
    <div className="min-h-screen bg-[#0B0E11] pt-14 md:pt-0 pb-20 md:pb-0">
      {/* NAVIGATION - Cố định bên trái */}
      <Navigation />

      {/* PROFILE CONTENT - Chiếm phần còn lại */}
      <div className="ml-0 md:ml-20 lg:ml-64 min-h-screen">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0 mx-auto sm:mx-0">
              <div className="w-20 h-20 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-gray-800 flex items-center justify-center aspect-square">
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.fullname}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                    priority
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl sm:text-4xl font-bold">
                    {user.username?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0 w-full sm:w-auto">
              {/* Username và Settings */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                <h1 className="text-lg sm:text-2xl font-light text-white break-words">{user.username}</h1>
                <Link
                  href="/settings/profile"
                  className="w-full sm:w-auto px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors text-center sm:text-left whitespace-nowrap"
                >
                  Chỉnh sửa trang cá nhân
                </Link>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 sm:gap-8 mb-3 sm:mb-4 text-sm sm:text-base">
                <div className="flex items-center gap-1">
                  <span className="text-white font-semibold">{originalBlogs.length}</span>
                  <span className="text-gray-400">bài viết</span>
                </div>
                <button
                  onClick={() => setShowFollowModal('followers')}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <span className="text-white font-semibold">{followersCount}</span>
                  <span className="text-gray-400">người theo dõi</span>
                </button>
                <button
                  onClick={() => setShowFollowModal('following')}
                  className="flex items-center gap-1 hover:opacity-70 transition-opacity cursor-pointer"
                >
                  <span className="text-white font-semibold">{followingCount}</span>
                  <span className="text-gray-400">đang theo dõi</span>
                </button>
              </div>

              {/* Full Name */}
              <div className="mb-2">
                <h2 className="text-white font-semibold text-sm sm:text-base break-words">{user.fullname}</h2>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-0 border-t border-gray-800 mt-4 sm:mt-8 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 border-t transition-colors flex-shrink-0 ${activeTab === 'posts'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium whitespace-nowrap">BÀI VIẾT</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 border-t transition-colors flex-shrink-0 ${activeTab === 'saved'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium whitespace-nowrap">ĐÃ LƯU</span>
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 border-t transition-colors flex-shrink-0 ${activeTab === 'shared'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14"
                />
              </svg>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium whitespace-nowrap">CHIA SẺ</span>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-8 py-3 sm:py-4 border-t transition-colors flex-shrink-0 ${activeTab === 'liked'
                ? 'border-white text-white'
                : 'border-transparent text-gray-400 hover:text-white'
                }`}
            >
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider font-medium whitespace-nowrap">ĐÃ THÍCH</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-4xl mx-auto px-3 sm:px-4 pb-8">
          {activeTab === 'posts' && (
            <>
              {originalBlogs.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {originalBlogs.map((blog) => {
                    const displayBlog = blog.sharedFrom ?? blog
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className="aspect-square bg-gray-900 relative group overflow-hidden"
                      >
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 0 && (() => {
                          const first = displayBlog.imageUrls[0]
                          const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url)
                          const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url)

                          if (isImage(first)) {
                            return (
                              <Image
                                src={first}
                                alt={displayBlog.caption || 'Post'}
                                fill
                                className="object-cover group-hover:opacity-70 transition-opacity"
                                sizes="(max-width: 768px) 33vw, 300px"
                              />
                            )
                          } else if (isVideo(first)) {
                            return (
                              <>
                                <video
                                  src={first}
                                  className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                                  muted
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              </>
                            )
                          }
                          return null
                        })()}
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 1 && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                              <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold">{blog._count?.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="font-semibold">{blog._count?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Chia sẻ ảnh</h3>
                  <p className="text-gray-400 mb-4 text-center max-w-sm">
                    Khi bạn chia sẻ ảnh, ảnh sẽ xuất hiện trên trang cá nhân của bạn.
                  </p>
                  <Link
                    href="/blog/create"
                    className="text-[#877EFF] hover:opacity-80 font-medium"
                  >
                    Chia sẻ ảnh đầu tiên của bạn
                  </Link>
                </div>
              )}
            </>
          )}

          {activeTab === 'shared' && (
            <>
              {sharedBlogs.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {sharedBlogs.map((blog) => {
                    const displayBlog = blog.sharedFrom ?? blog
                    const isOriginalMissing = !!blog.sharedFrom && blog.sharedFrom.isdeleted === true
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className="aspect-square bg-gray-900 relative group overflow-hidden"
                      >
                        {isOriginalMissing ? (
                          <div className="w-full h-full flex flex-col items-center justify-center text-center px-2 bg-gray-900">
                            <div className="mb-2 h-10 w-10 rounded-full bg-gray-800 flex items-center justify-center">
                              <span className="text-lg">⛔</span>
                            </div>
                            <p className="text-xs text-gray-200 font-semibold leading-snug">
                              Bài viết này không còn tồn tại
                            </p>
                          </div>
                        ) : displayBlog.imageUrls && displayBlog.imageUrls.length > 0 && (() => {
                          const first = displayBlog.imageUrls[0]
                          const isImage = (url: string) => /\.(jpg|jpeg|png|gif|webp|avif|svg)$/i.test(url)
                          const isVideo = (url: string) => /\.(mp4|mov|webm)$/i.test(url)

                          if (isImage(first)) {
                            return (
                              <Image
                                src={first}
                                alt={displayBlog.caption || 'Post'}
                                fill
                                className="object-cover group-hover:opacity-70 transition-opacity"
                                sizes="(max-width: 768px) 33vw, 300px"
                              />
                            )
                          } else if (isVideo(first)) {
                            return (
                              <>
                                <video
                                  src={first}
                                  className="w-full h-full object-cover group-hover:opacity-70 transition-opacity"
                                  muted
                                  preload="metadata"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <svg className="w-8 h-8 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                                  </svg>
                                </div>
                              </>
                            )
                          }
                          return null
                        })()}
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 1 && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                              <path
                                fillRule="evenodd"
                                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-semibold">{blog._count?.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="font-semibold">{blog._count?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Bài viết bạn đã chia sẻ</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    Những bài viết bạn chia sẻ sẽ xuất hiện ở đây.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <>
              {savedBlogs.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {savedBlogs.map((blog) => {
                    const displayBlog = blog.sharedFrom ?? blog
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className="aspect-square bg-gray-900 relative group overflow-hidden"
                      >
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 0 && (
                          <Image
                            src={displayBlog.imageUrls[0]}
                            alt={displayBlog.caption || 'Post'}
                            fill
                            className="object-cover group-hover:opacity-70 transition-opacity"
                            sizes="(max-width: 768px) 33vw, 300px"
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              <span className="font-semibold">{blog._count?.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                              <span className="font-semibold">{blog._count?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Chỉ bạn mới có thể thấy những gì bạn đã lưu</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    Lưu ảnh và video mà bạn muốn xem lại. Không ai được thông báo và chỉ bạn mới có thể thấy những gì bạn đã lưu.
                  </p>
                </div>
              )}
            </>
          )}

          {activeTab === 'liked' && (
            <>
              {likedBlogs.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {likedBlogs.map((blog) => {
                    const displayBlog = blog.sharedFrom ?? blog
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${blog.id}`}
                        className="aspect-square bg-gray-900 relative group overflow-hidden"
                      >
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 0 && (
                          <Image
                            src={displayBlog.imageUrls[0]}
                            alt={displayBlog.caption || 'Post'}
                            fill
                            className="object-cover group-hover:opacity-70 transition-opacity"
                            sizes="(max-width: 768px) 33vw, 300px"
                          />
                        )}
                        {displayBlog.imageUrls && displayBlog.imageUrls.length > 1 && (
                          <div className="absolute top-2 right-2">
                            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                              <path
                                fillRule="evenodd"
                                d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center">
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-6 text-white">
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-semibold">{blog._count?.likes || 0}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                                />
                              </svg>
                              <span className="font-semibold">{blog._count?.comments || 0}</span>
                            </div>
                          </div>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-24 h-24 mb-6 flex items-center justify-center">
                    <svg className="w-full h-full text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Bài viết bạn đã thích</h3>
                  <p className="text-gray-400 text-center max-w-sm">
                    Những bài viết bạn bấm thích sẽ xuất hiện ở đây.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Follow Modal */}
      {showFollowModal && user && (
        <FollowModal
          isOpen={true}
          onClose={() => setShowFollowModal(null)}
          userId={user.id}
          type={showFollowModal}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800">
            <h3 className="text-lg font-semibold text-white mb-3">Xác nhận xóa bài viết</h3>
            <p className="text-gray-400 mb-6">
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
                className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
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
