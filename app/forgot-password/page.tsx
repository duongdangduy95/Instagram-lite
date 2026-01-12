'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Grand_Hotel } from 'next/font/google'

const logoFont = Grand_Hotel({ weight: '400', subsets: ['latin'] })

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error'>('success')
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!email) {
      setMessage('Vui lòng nhập địa chỉ email')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Đã bỏ .toLowerCase() theo yêu cầu của bạn
        body: JSON.stringify({ email }) 
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Liên kết đặt lại mật khẩu đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư đến (kể cả mục Spam).')
        setMessageType('success')
        setEmail('')
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
                        {/* Lock Icon */}
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,17C10.89,17 10,16.1 10,15C10,13.89 10.89,13 12,13A2,2 0 0,1 14,15A2,2 0 0,1 12,17M18,20V10H6V20H18M18,8A2,2 0 0,1 20,10V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V10C4,8.89 4.89,8 6,8H7V6A5,5 0 0,1 12,1A5,5 0 0,1 17,6V8H18M12,3A3,3 0 0,0 9,6V8H15V6A3,3 0 0,0 12,3Z"/>
                        </svg>
                    </div>
                    <h1 className={`${logoFont.className} text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 drop-shadow-sm mb-2`}>
                        InstaClone
                    </h1>
                    <h2 className="text-xl font-bold text-white">Quên mật khẩu?</h2>
                    <p className="text-gray-400 text-sm mt-2">
                        Nhập email của bạn để nhận liên kết đặt lại mật khẩu.
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Email Input */}
                    <div className="space-y-1.5">
                        <label className="text-gray-300 text-xs font-medium uppercase tracking-wider ml-1">Email đăng ký</label>
                        <input
                            type="email"
                            placeholder="VD: email@domain.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                            required
                        />
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
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                <span>Đang gửi...</span>
                            </>
                        ) : (
                            <>
                                <span>Gửi link xác nhận</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
                            </>
                        )}
                    </motion.button>

                    {/* Back to Login */}
                    <div className="text-center pt-2">
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