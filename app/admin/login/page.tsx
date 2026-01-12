'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const submit = async () => {
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    if (!res.ok) {
      setError('Sai tài khoản hoặc mật khẩu')
    } else {
      router.push('/admin')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-gray-900 via-[#1a103c] to-gray-900 relative flex items-center justify-center overflow-hidden">

      {/* BACKGROUND BLOBS */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-600/30 rounded-full blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-600/30 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-blue-600/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-2xl">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-600 to-purple-600 flex items-center justify-center shadow-lg shadow-red-500/30">
              🛡
            </div>
            <h1 className="text-3xl font-bold text-white">Admin</h1>
            <p className="text-gray-400 text-sm mt-1">Restricted Access</p>
          </div>

          {/* USERNAME */}
          <div className="mb-4">
            <label className="text-gray-300 text-xs uppercase ml-1">
              Username
            </label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Nhập admin username"
              className="w-full mt-1 px-5 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="mb-4">
            <label className="text-gray-300 text-xs uppercase ml-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full mt-1 px-5 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition"
            />
          </div>

          {/* ERROR */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg p-3 mb-4"
            >
              {error}
            </motion.div>
          )}

          {/* BUTTON */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={submit}
            disabled={loading || !username || !password}
            className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-red-600 to-purple-600 text-white shadow-lg shadow-red-500/30 hover:from-red-500 hover:to-purple-500 transition disabled:opacity-50"
          >
            {loading ? "Đang đăng nhập..." : "Đăng nhập Admin"}
          </motion.button>

          {/* FOOTER */}
          <p className="text-center text-gray-500 text-xs mt-6">
            Protected by InstaClone Security
          </p>
        </div>
      </motion.div>
    </div>
  )
}
