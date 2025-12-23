'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '@/app/components/Navigation'
import FollowButton from '@/app/components/FollowButton'
import FollowModal from '@/app/components/FollowModal'

type BlogCounts = { likes: number; comments: number }

type BlogDTO = {
  id: string
  caption: string | null
  imageUrls: string[]
  createdAt: string
  _count: BlogCounts
  sharedFrom?: {
    id: string
    caption: string | null
    imageUrls: string[]
    createdAt: string
    _count: BlogCounts
    author: {
      id: string
      fullname: string
      username: string
    }
  } | null
}

type UserDTO = {
  id: string
  fullname: string
  username: string
  createdAt: string
  blogs: BlogDTO[]
  _count: {
    followers: number
    following: number
  }
}

export default function ProfileOtherClient(props: {
  user: UserDTO
  currentUserId: string | null
  initialIsFollowing: boolean
}) {
  const { user, currentUserId, initialIsFollowing } = props
  const [activeTab, setActiveTab] = useState<'posts' | 'shared' | 'saved' | 'liked'>('posts')
  const [showFollowModal, setShowFollowModal] = useState<'followers' | 'following' | null>(null)
  const [followersCount, setFollowersCount] = useState(user._count?.followers ?? 0)
  const followingCount = user._count?.following ?? 0

  const myBlogs = useMemo(() => user.blogs ?? [], [user.blogs])
  const originalBlogs = useMemo(() => myBlogs.filter((b) => !b.sharedFrom), [myBlogs])
  const sharedBlogs = useMemo(() => myBlogs.filter((b) => !!b.sharedFrom), [myBlogs])

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="ml-64 min-h-screen">
        {/* Profile Header */}
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="flex flex-col sm:flex-row items-start gap-8 sm:gap-12">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-3xl sm:text-4xl font-bold border-2 border-gray-700">
                {user.fullname?.charAt(0).toUpperCase()}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 min-w-0">
              {/* Username + Follow button */}
              <div className="flex items-center gap-4 mb-4">
                <h1 className="text-xl sm:text-2xl font-light text-white">{user.username}</h1>

                {currentUserId && (
                  <FollowButton
                    targetUserId={user.id}
                    initialIsFollowing={initialIsFollowing}
                      onFollowChange={(_isFollowing, newFollowersCount) => {
                        if (typeof newFollowersCount === 'number') {
                          setFollowersCount(newFollowersCount)
                        }
                      }}
                    size="md"
                  />
                )}

                <button className="p-1.5">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6 sm:gap-8 mb-4">
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
                <h2 className="text-white font-semibold">{user.fullname}</h2>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex items-center justify-center gap-0 border-t border-gray-800 mt-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`flex items-center gap-2 px-8 py-4 border-t transition-colors ${
                activeTab === 'posts'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              <span className="text-xs uppercase tracking-wider font-medium">Bài viết</span>
            </button>
            <button
              onClick={() => setActiveTab('saved')}
              className={`flex items-center gap-2 px-8 py-4 border-t transition-colors ${
                activeTab === 'saved'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              <span className="text-xs uppercase tracking-wider font-medium">Đã lưu</span>
            </button>
            <button
              onClick={() => setActiveTab('shared')}
              className={`flex items-center gap-2 px-8 py-4 border-t transition-colors ${
                activeTab === 'shared'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider font-medium">Chia sẻ</span>
            </button>
            <button
              onClick={() => setActiveTab('liked')}
              className={`flex items-center gap-2 px-8 py-4 border-t transition-colors ${
                activeTab === 'liked'
                  ? 'border-white text-white'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xs uppercase tracking-wider font-medium">Đã thích</span>
            </button>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="max-w-4xl mx-auto px-4 pb-8">
          {activeTab === 'posts' && (
            <>
              {originalBlogs.length > 0 ? (
                <div className="grid grid-cols-3 gap-1">
                  {originalBlogs.map((blog) => {
                    const displayBlog = blog.sharedFrom ?? blog
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${displayBlog.id}`}
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
                  <h3 className="text-xl font-semibold text-white mb-2">Chưa có bài viết</h3>
                  <p className="text-gray-400 mb-4 text-center max-w-sm">
                    Người dùng này chưa đăng bài viết nào.
                  </p>
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
                    return (
                      <Link
                        key={blog.id}
                        href={`/blog/${displayBlog.id}`}
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
                    <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 12v7a1 1 0 001 1h14a1 1 0 001-1v-7M16 6l-4-4-4 4M12 2v14"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Bài viết đã chia sẻ</h3>
                  <p className="text-gray-400 text-center max-w-sm">Người dùng này chưa chia sẻ bài viết nào.</p>
                </div>
              )}
            </>
          )}

          {activeTab === 'saved' && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 mb-6 flex items-center justify-center">
                <svg className="w-full h-full text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Chỉ chủ tài khoản mới có thể xem</h3>
              <p className="text-gray-400 text-center max-w-sm">Mục đã lưu không hiển thị với người khác.</p>
            </div>
          )}

          {activeTab === 'liked' && (
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
              <h3 className="text-xl font-semibold text-white mb-2">Bài viết đã thích</h3>
              <p className="text-gray-400 text-center max-w-sm">Mục này hiện chưa hiển thị cho người khác.</p>
            </div>
          )}
        </div>
      </div>

      {/* Follow Modal */}
      {showFollowModal && (
        <FollowModal
          isOpen={true}
          onClose={() => setShowFollowModal(null)}
          userId={user.id}
          type={showFollowModal}
        />
      )}
    </div>
  )
}


