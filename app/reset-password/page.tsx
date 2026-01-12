'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Grand_Hotel } from 'next/font/google'

const logoFont = Grand_Hotel({ weight: '400', subsets: ['latin'] })

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  useEffect(() => {
    if (!token || !email) {
      setMessage('Liên kết không hợp lệ hoặc thiếu thông tin xác thực.')
      setMessageType('error')
    }
  }, [token, email])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!password || !confirmPassword) {
      setMessage('Vui lòng nhập đầy đủ thông tin')
      setMessageType('error')
      return
    }

    if (password.length < 6) {
      setMessage('Mật khẩu phải có ít nhất 6 ký tự')
      setMessageType('error')
      return
    }

    if (password !== confirmPassword) {
      setMessage('Mật khẩu xác nhận không khớp')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, email, password })
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Đặt lại mật khẩu thành công! Đang chuyển đến trang đăng nhập...')
        setMessageType('success')
        setTimeout(() => {
          router.push('/login')
        }, 2000)
      } else {
        setMessage(data.error || 'Có lỗi xảy ra. Vui lòng thử lại.')
        setMessageType('error')
      }
    } catch {
      setMessage('Có lỗi xảy ra. Vui lòng thử lại.')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  // Animation Variant
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  // Input Class Shared
  const inputClass = "w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
  const labelClass = "text-gray-300 text-xs font-medium uppercase tracking-wider ml-1 mb-1 block"

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-gray-900 via-[#1a103c] to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      
      {/* 1. BACKGROUND DYNAMIC */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <motion.div 
            initial="hidden" animate="visible" variants={fadeInUp}
            className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group"
        >
            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine z-0 pointer-events-none"></div>

            <div className="relative z-10">
                {/* Header Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-2xl mb-4 shadow-lg shadow-purple-500/30 ring-1 ring-white/20">
                        {/* Key/Reset Icon */}
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12.65 10C11.83 7.67 9.61 6 7 6C3.69 6 1 8.69 1 12C1 15.31 3.69 18 7 18C9.61 18 11.83 16.33 12.65 14H17V18H21V14H23V10H12.65M7 14C5.9 14 5 13.1 5 12C5 10.9 5.9 10 7 10C8.1 10 9 10.9 9 12C9 13.1 8.1 14 7 14Z" />
                        </svg>
                    </div>
                    <h1 className={`${logoFont.className} text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 drop-shadow-sm mb-2`}>
                        InstaClone
                    </h1>
                    <h2 className="text-xl font-bold text-white">Đặt lại mật khẩu</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        Nhập mật khẩu mới an toàn hơn cho tài khoản của bạn.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    
                    {/* Password Input */}
                    <div>
                        <label className={labelClass}>Mật khẩu mới</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Tối thiểu 6 ký tự"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className={inputClass}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Confirm Password Input */}
                    <div>
                        <label className={labelClass}>Xác nhận mật khẩu</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Nhập lại mật khẩu"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className={inputClass}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                            >
                                {showConfirmPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Message */}
                    {message && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className={`rounded-lg p-3 text-center text-sm flex items-center justify-center gap-2 ${
                                messageType === 'success' 
                                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                                : 'bg-red-500/10 border border-red-500/20 text-red-400'
                            }`}
                        >
                            {messageType === 'success' ? (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                            ) : (
                                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            )}
                            {message}
                        </motion.div>
                    )}

                    {/* Submit Button */}
                    <motion.button
                        whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isLoading || !password || !confirmPassword || !token || !email}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Đang xử lý...</span>
                            </>
                        ) : (
                            <>
                                <span>Đổi mật khẩu</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                            </>
                        )}
                    </motion.button>

                    {/* Back to Login */}
                    <div className="text-center pt-4">
                        <Link 
                            href="/login" 
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm transition-colors group"
                        >
                            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
                            </svg>
                            Quay lại Đăng nhập
                        </Link>
                    </div>
                </form>
            </div>
        </motion.div>

        {/* Footer */}
        <p className="text-center text-gray-600 text-xs mt-8">
            Copyright © InstaClone 2024
        </p>
      </div>
    </div>
  )
}

// Export page bọc Suspense để tránh lỗi trên server
export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
        <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  )
}