// app/search/page.tsx
'use client'

import { useEffect, useState } from 'react'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])

  const handleSearch = async () => {
    const res = await fetch(`/api/search?q=${query}`)
    const data = await res.json()
    setResults(data)
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Search Blogs</h1>
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        className="border px-3 py-2 rounded w-full mb-4"
        placeholder="Search by caption or username..."
      />
      <button
        onClick={handleSearch}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Search
      </button>

      <div className="mt-4 space-y-3">
        {results.map(blog => (
          <div key={blog.id} className="border p-3 rounded">
            <p className="text-sm text-gray-600">@{blog.author.username}</p>
            <p className="font-semibold">{blog.caption}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
