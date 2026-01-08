'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import Image from 'next/image'
import Navigation from '../components/Navigation'
import BlogFeed from '../components/BlogFeed'
import type { BlogDTO, CurrentUserSafe } from '@/types/dto'

export default function ExplorePage() {
    const [query, setQuery] = useState('')
    const [searchResults, setSearchResults] = useState<BlogDTO[]>([])
    const [searchLoading, setSearchLoading] = useState(false)

    // Explore Feed State
    const [exploreBlogs, setExploreBlogs] = useState<BlogDTO[]>([])
    const [cursor, setCursor] = useState<string | null>(null)
    const [hasMore, setHasMore] = useState(true)
    const [isExploreLoading, setIsExploreLoading] = useState(false)

    const observer = useRef<IntersectionObserver | null>(null)

    const { data: session } = useSession()
    const currentUser: CurrentUserSafe = session?.user?.id ? { id: session.user.id } : null

    // --- SEARCH LOGIC ---
    const handleSearch = async () => {
        if (!query.trim()) return
        setSearchLoading(true)
        try {
            const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`)
            const data = await res.json()
            setSearchResults(data as BlogDTO[])
        } catch (error) {
            console.error("Search error:", error)
        } finally {
            setSearchLoading(false)
        }
    }

    // --- EXPLORE FETCH LOGIC ---
    const fetchExploreBlogs = useCallback(async (currentCursor: string | null = null, limit: number = 9) => {
        if (isExploreLoading) return
        setIsExploreLoading(true)
        try {
            const url = `/api/explore?limit=${limit}${currentCursor ? `&cursor=${currentCursor}` : ''}`
            const res = await fetch(url)
            const { data, nextCursor } = await res.json()

            setExploreBlogs(prev => currentCursor ? [...prev, ...data] : data)
            setCursor(nextCursor)
            setHasMore(!!nextCursor)
        } catch (error) {
            console.error("Fetch explore error:", error)
        } finally {
            setIsExploreLoading(false)
        }
    }, []) // Remove isExploreLoading dependency to avoid loops if handled wrong, strictly managed by logic

    // Initial Load
    useEffect(() => {
        fetchExploreBlogs(null, 9)
    }, [])

    // Infinite Scroll Observer
    const lastBlogElementRef = useCallback((node: HTMLAnchorElement) => {
        if (isExploreLoading) return
        if (observer.current) observer.current.disconnect()

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                fetchExploreBlogs(cursor, 6)
            }
        })

        if (node) observer.current.observe(node)
    }, [isExploreLoading, hasMore, cursor, fetchExploreBlogs])


    return (
        <div className="min-h-screen bg-[#0B0E11] text-gray-100 pt-14 md:pt-0 pb-20 md:pb-0">
            <Navigation />

            <div className="ml-0 md:ml-20 lg:ml-64 min-h-screen">
                <main className="flex flex-col items-center px-4 pt-8 pb-10"> {/* Adjusted pt-20 to pt-8 */}
                    <div className="w-full max-w-5xl space-y-8">

                        {/* SEARCH BOX */}
                        <div className="relative group w-full max-w-2xl mx-auto">
                            <div className={`
                flex items-center w-full bg-[#1A1D21] border border-gray-700 rounded-full px-5 py-3 
                focus-within:border-[#7565E6] focus-within:ring-1 focus-within:ring-[#7565E6] 
                transition-all shadow-lg hover:shadow-xl hover:border-gray-600
              `}>
                                <svg className="w-5 h-5 text-gray-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>

                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                    placeholder="Tìm kiếm bài viết..."
                                    className="flex-1 bg-transparent border-none outline-none text-gray-100 placeholder-gray-500"
                                />

                                {query && (
                                    <button
                                        onClick={() => { setQuery(''); setSearchResults([]) }}
                                        className="p-1 hover:bg-gray-700 rounded-full mr-2 transition-colors"
                                    >
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                )}

                                <button
                                    onClick={handleSearch}
                                    disabled={searchLoading}
                                    className="ml-2 p-2 bg-[#7565E6] hover:bg-[#6455C2] text-white rounded-full transition-colors disabled:opacity-50"
                                >
                                    {searchLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* CONTENT AREA */}
                        <div className="w-full">
                            {query ? (
                                // SEARCH RESULTS
                                <div>
                                    {searchResults.length > 0 ? (
                                        <BlogFeed blogs={searchResults} currentUser={currentUser} />
                                    ) : (
                                        !searchLoading && <div className="text-center text-gray-500 mt-8">Không tìm thấy kết quả nào.</div>
                                    )}
                                </div>
                            ) : (
                                // EXPLORE GRID
                                <div className="w-full">
                                    <div className="grid grid-cols-3 gap-1">
                                        {exploreBlogs.map((blog, index) => {
                                            // Last element ref for infinite scroll
                                            const isLast = index === exploreBlogs.length - 1
                                            return (
                                                <Link
                                                    href={`/blog/${blog.id}`}
                                                    key={blog.id}
                                                    ref={isLast ? lastBlogElementRef : null}
                                                    className="aspect-square relative group bg-gray-900 overflow-hidden cursor-pointer"
                                                >
                                                    {blog.imageUrls && blog.imageUrls.length > 0 && (
                                                        <Image
                                                            src={blog.imageUrls[0]}
                                                            alt="Explore"
                                                            fill
                                                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                            sizes="(max-width: 768px) 33vw, 300px"
                                                        />
                                                    )}
                                                    {/* Hover Overlay */}
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-6 text-white font-bold">
                                                        <div className="flex items-center">
                                                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg>
                                                            {blog._count?.likes || 0}
                                                        </div>
                                                        <div className="flex items-center">
                                                            <svg className="w-6 h-6 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" /></svg>
                                                            {blog._count?.comments || 0}
                                                        </div>
                                                    </div>
                                                </Link>
                                            )
                                        })}
                                    </div>
                                    {isExploreLoading && (
                                        <div className="flex justify-center py-8">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7565E6]"></div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                    </div>
                </main>
            </div>
        </div>
    )
}
