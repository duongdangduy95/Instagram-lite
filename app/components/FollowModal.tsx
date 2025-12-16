'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'

interface User {
  id: string
  fullname: string
  username: string
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">
          {type === 'followers' ? 'Người theo dõi' : 'Đang theo dõi'}
        </h3>
        {loading ? (
          <p className="text-gray-500">Đang tải...</p>
        ) : (
          <ul className="divide-y divide-gray-200 max-h-80 overflow-y-auto">
  {users.map(u => (
    <li key={u.id} className="py-2 flex justify-between items-center">
      <div>
        <p className="font-medium text-gray-900">{u.fullname}</p>
        <p className="text-xs text-gray-500">@{u.username}</p>
      </div>
      <Link
        href={`/profile/${u.id}`}
        className="px-3 py-1 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
      >
        Xem
      </Link>
    </li>
  ))}
  {users.length === 0 && <li className="py-2 text-gray-500">Chưa có người nào</li>}
</ul>

        )}
        <div className="mt-4 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400">
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}
