'use client'

import { useState, useEffect } from 'react'

export default function CreateGroupModal({ onClose, currentUser }: any) {
  const [groupName, setGroupName] = useState('')
  const [followers, setFollowers] = useState<any[]>([])
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])

  // Lấy danh sách người theo dõi để add vào nhóm
  useEffect(() => {
  const fetchFollowers = async () => {
    try {
      const res = await fetch(`/api/user/${currentUser.id}/following`)
      if (!res.ok) throw new Error('Lỗi khi lấy danh sách followers')
      const data = await res.json()
      setFollowers(data)
    } catch (err) {
      console.error(err)
    }
  }

  fetchFollowers()
}, [currentUser.id])

  const toggleSelectUser = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter(u => u !== id))
    } else {
      setSelectedUsers([...selectedUsers, id])
    }
  }

  const handleCreateGroup = async () => {
    if (!groupName) return alert('Nhập tên nhóm!')

    const res = await fetch('/api/conversations/group', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: groupName, userIds: [currentUser.id, ...selectedUsers] }),
    })

    if (res.ok) {
      alert('Tạo nhóm thành công!')
      onClose()
    } else {
      alert('Lỗi khi tạo nhóm')
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg p-6 w-96">
        <h2 className="text-white font-semibold text-lg mb-4">Tạo nhóm chat mới</h2>
        <input
          type="text"
          placeholder="Tên nhóm"
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          className="w-full p-2 rounded mb-4 bg-gray-800 text-white"
        />

        <div className="mb-4 max-h-64 overflow-y-auto border border-gray-700 p-2 rounded">
          {followers.length === 0 ? (
            <span className="text-gray-400 text-sm">Bạn chưa follow ai</span>
          ) : (
            followers.map(f => (
              <div key={f.id} className="flex items-center justify-between p-1">
                <span className="text-white">{f.fullname || f.username}</span>
                <button
                  onClick={() => toggleSelectUser(f.id)}
                  className={`px-2 py-1 text-sm rounded ${
                    selectedUsers.includes(f.id) ? 'bg-green-500' : 'bg-gray-700'
                  }`}
                >
                  {selectedUsers.includes(f.id) ? 'Đã thêm' : 'Thêm'}
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end space-x-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-700 rounded text-white">Hủy</button>
          <button onClick={handleCreateGroup} className="px-4 py-2 bg-blue-600 rounded text-white">Tạo nhóm</button>
        </div>
      </div>
    </div>
  )
}
