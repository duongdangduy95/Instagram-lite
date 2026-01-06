'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Image from 'next/image'

interface User {
  id: string
  fullname: string
  username: string
  image?: string | null
}

interface Props {
  isOpen: boolean
  onClose: () => void
  userId: string
  type: 'followers' | 'following'
}

export default function FollowModal({ isOpen, onClose, userId, type }: Props) {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return

    const fetchUsers = async () => {
      setLoading(true)
      try {
        const res = await fetch(`/api/user/${userId}/${type}`)
        const data = await res.json()
        setUsers(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [isOpen, userId, type])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-[#212227] rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">
            {type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
          </div>
        ) : (
          <ul className="divide-y divide-gray-800 max-h-80 overflow-y-auto">
            {users.map(u => (
              <li key={u.id} className="py-3 flex justify-between items-center hover:bg-gray-800 px-2 rounded transition-colors">
                <Link href={`/profile/${u.id}`} className="flex-1 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold overflow-hidden">
                    {u.image ? (
                      <Image src={u.image} alt={u.username} width={40} height={40} className="object-cover w-full h-full" />
                    ) : (
                      u.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-white">{u.username}</p>
                    <p className="text-xs text-gray-400">{u.fullname}</p>
                  </div>
                </Link>
                <Link
                  href={`/profile/${u.id}`}
                  className="px-4 py-1.5 bg-[#877EFF] text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
                >
                  Xem
                </Link>
              </li>
            ))}
            {users.length === 0 && (
              <li className="py-8 text-center text-gray-400">Chưa có người nào</li>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}
