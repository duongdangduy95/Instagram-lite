'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion' // Import thư viện chuyển động

export default function LoginPage() {
  const [usernameOrEmail, setUsernameOrEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email: usernameOrEmail,
        password: password,
        redirect: false,
      })

      if (result?.error) {
        setError('Email hoặc mật khẩu không chính xác')
      } else if (result?.ok) {
        router.push('/profile')
      }
    } catch {
      setError('Có lỗi xảy ra, vui lòng thử lại')
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleLogin()
    }
  }

  // Cấu hình Animation
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-gray-900 via-[#1a103c] to-gray-900 relative overflow-hidden flex items-center justify-center">
      
      {/* 1. BACKGROUND DYNAMIC (Hiệu ứng nền động) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         {/* Grid Pattern mờ để tạo texture */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        
        {/* Các khối màu Blobs di chuyển */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          
          {/* 2. LEFT SIDE - BRANDING (Đã nâng cấp Visual) */}
          <motion.div 
            className="hidden md:block space-y-8"
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
                {/* Hiệu ứng kính mờ cho khối text bên trái */}
                <div className="absolute -inset-6 bg-white/5 rounded-3xl blur-xl -z-10"></div>
                
                <div className="space-y-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 bg-gradient-to-bl from-pink-500 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30 ring-1 ring-white/20">
                            <svg className="w-9 h-9 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                            </svg>
                        </div>
                        <h1 className="text-[3.5rem] leading-none pb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 drop-shadow-lg" style={{ fontFamily: 'var(--font-logo), cursive' }}>
                            InstaClone
                        </h1>
                    </div>
                    
                    <h2 className="text-6xl font-extrabold leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm">
                        Open<br />the world
                        </span>
                    </h2>
                    
                    <p className="text-purple-200/80 text-lg max-w-md leading-relaxed font-light">
                        Chào mừng trở lại! Đăng nhập để truy cập hồ sơ của bạn và
                        kết nối với bạn bè. Nhanh chóng và dễ dàng.
                    </p>
                </div>
            </motion.div>
          </motion.div>

          {/* 3. RIGHT SIDE - LOGIN FORM (Đã nâng cấp UI/UX) */}
          <motion.div 
            className="w-full max-w-md mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Card Glassmorphism cao cấp hơn */}
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
              {/* Hiệu ứng viền sáng chạy (Shine effect) khi hover vào card */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine z-0 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-3xl font-bold text-white mb-2 text-center">Đăng nhập</h2>
                <p className="text-center text-gray-400 mb-8 text-sm">Nhập thông tin chi tiết của bạn để vào</p>
                
                <div className="space-y-5">
                  {/* Email/Username Input */}
                  <div className="space-y-1.5">
                    <label className="text-gray-300 text-xs font-medium uppercase tracking-wider ml-1">Tài khoản</label>
                    <input
                      type="text"
                      placeholder="Email hoặc tên đăng nhập"
                      value={usernameOrEmail}
                      onChange={(e) => setUsernameOrEmail(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                    />
                  </div>

                  {/* Password Input */}
                  <div className="space-y-1.5">
                    <label className="text-gray-300 text-xs font-medium uppercase tracking-wider ml-1">Mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Nhập mật khẩu"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="w-full px-5 py-3.5 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm flex items-center gap-2"
                    >
                      <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {error}
                    </motion.div>
                  )}

                  {/* Sign In Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleLogin}
                    disabled={isLoading || !usernameOrEmail || !password}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Đang xử lý...</span>
                      </>
                    ) : (
                      <>
                        <span>Đăng nhập</span>
                      </>
                    )}
                  </motion.button>

                  {/* Forgot Password Link */}
                  <div className="text-center pt-2">
                    <Link href="/forgot-password" className="text-gray-400 hover:text-purple-300 text-sm transition-colors duration-300">
                      Quên mật khẩu?
                    </Link>
                  </div>

                  {/* Divider */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="px-4 bg-[#1a152e] text-gray-500 rounded-full">Hoặc</span>
                    </div>
                  </div>

                  {/* Social Login */}
                  <div className="grid grid-cols-1">
                    <button
                        type="button"
                        onClick={() => signIn('google', { callbackUrl: '/profile' })}
                        className="flex items-center justify-center gap-3 w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all group"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-gray-300 text-sm font-medium group-hover:text-white">Đăng nhập với Google</span>
                    </button>
                  </div>

                  {/* Sign Up Link */}
                  <p className="text-center text-gray-400 text-sm pt-4">
                    Chưa có tài khoản?{' '}
                    <Link href="/signup" className="text-purple-400 hover:text-pink-400 font-semibold transition-colors">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-600 text-xs mt-8">
              Copyright © InstaClone 2024
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}