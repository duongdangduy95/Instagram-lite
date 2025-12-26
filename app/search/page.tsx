'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import Navigation from '../components/Navigation'
import BlogFeed from '../components/BlogFeed'
import type { BlogDTO, CurrentUserSafe } from '@/types/dto'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<BlogDTO[]>([])

  const { data: session } = useSession()

  const currentUser: CurrentUserSafe = session?.user?.id ? { id: session.user.id } : null

  const handleSearch = async () => {
    const res = await fetch(`/api/search?q=${query}`)
    const data = await res.json()
    setResults(data as BlogDTO[])
  }

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navigation />

      <div className="ml-64 grid grid-cols-1 lg:grid-cols-[1fr_400px]">
        <main className="flex justify-center px-4 py-4">
          <div className="w-full max-w-xl space-y-6">

            {/* SEARCH BOX */}
            <div className="border border-gray-800 rounded-lg p-4">
              <input
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Tìm caption hoặc username..."
                className="w-full bg-black border border-gray-700 px-4 py-2 rounded"
              />

              <button
                onClick={handleSearch}
                className="mt-3 w-full bg-gray-100 text-black py-2 rounded"
              >
                Tìm kiếm
              </button>
            </div>

            {/* ✅ BLOG FEED GIỐNG HOME */}
            <BlogFeed blogs={results} currentUser={currentUser} />

          </div>
        </main>

        <aside className="hidden lg:block border-l border-gray-800 bg-black" />
      </div>
    </div>
  )
}
