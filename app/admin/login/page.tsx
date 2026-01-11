'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const submit = async () => {
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
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-black p-8 rounded w-80">
        <h1 className="text-white text-xl mb-4">Admin Login</h1>
        <input
          className="w-full p-2 mb-2"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
        />
        <input
          className="w-full p-2 mb-2"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />
        {error && <p className="text-red-500">{error}</p>}
        <button onClick={submit} className="w-full bg-red-600 text-white p-2 mt-2">
          Login
        </button>
      </div>
    </div>
  )
}
