'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Grand_Hotel } from 'next/font/google'

const logoFont = Grand_Hotel({ weight: '400', subsets: ['latin'] })

// Tách logic chính vào một component con để dùng được useSearchParams() trong Suspense
function VerifyOTPContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()
  const email = searchParams.get('email')
  const username = searchParams.get('username') || 'User'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (!email) {
      router.push('/signup')
    }
  }, [email, router])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    if (messageType === 'error') setMessage('')

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    if (index === 5 && value && newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''))
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').slice(0, 6)
    if (!/^\d+$/.test(pastedData)) return

    const newOtp = pastedData.split('').concat(Array(6).fill('')).slice(0, 6)
    setOtp(newOtp)

    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('')

    if (code.length !== 6) {
      setMessage('Vui lòng nhập đủ 6 chữ số')
      setMessageType('error')
      return
    }

    setLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp: code })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Xác thực thất bại')
      }

      setSuccess(true)
      setMessage('Xác thực thành công! Đang đăng nhập...')
      setMessageType('success')

      if (status === 'authenticated') {
        await update()
        setTimeout(() => window.location.href = '/home', 1000)
      } else {
        if (data.user && data.user.email) {
          const signInResult = await signIn('credentials', {
            email: data.user.email,
            password: 'auto-verified',
            redirect: false,
            callbackUrl: '/home'
          })

          if (signInResult?.ok) {
            setTimeout(() => window.location.href = '/home', 1000)
          } else {
            setTimeout(() => router.push('/login?verified=true&message=Vui lòng đăng nhập'), 1500)
          }
        } else {
          setTimeout(() => router.push('/login?verified=true'), 1500)
        }
      }

    } catch (err: any) {
      setMessage(err.message)
      setMessageType('error')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setResending(true)
    setMessage('')
    
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username })
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Không thể gửi lại OTP')
      }

      setCountdown(60)
      setMessage('Mã OTP mới đã được gửi đến email của bạn')
      setMessageType('success')

    } catch (err: any) {
      setMessage(err.message)
      setMessageType('error')
    } finally {
      setResending(false)
    }
  }

  if (!email) return null

  // Animation variants
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
                        <svg className="w-8 h-8 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z"/>
                        </svg>
                    </div>
                    <h1 className={`${logoFont.className} text-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 drop-shadow-sm`}>
                        InstaClone
                    </h1>
                </div>

                {success ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-4"
                    >
                        <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-white mb-2">Xác thực thành công!</h2>
                        <p className="text-gray-400 text-sm">Đang chuyển hướng vào trang chủ...</p>
                    </motion.div>
                ) : (
                    <>
                        <div className="text-center mb-8">
                            <h2 className="text-xl font-bold text-white mb-2">Xác thực Email</h2>
                            <p className="text-gray-400 text-sm">
                                Mã OTP đã được gửi đến <br/>
                                <span className="text-purple-300 font-medium">{email}</span>
                            </p>
                        </div>

                        {/* OTP Inputs */}
                        <div className="flex justify-center gap-2 mb-8">
                            {otp.map((digit, index) => (
                                <input
                                    key={index}
                                    id={`otp-${index}`}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    value={digit}
                                    onChange={(e) => handleChange(index, e.target.value)}
                                    onKeyDown={(e) => handleKeyDown(index, e)}
                                    onPaste={index === 0 ? handlePaste : undefined}
                                    className="w-11 h-14 sm:w-12 sm:h-14 text-center text-xl font-bold bg-black/20 border border-white/10 rounded-xl text-white focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 focus:outline-none transition-all duration-300"
                                    disabled={loading}
                                />
                            ))}
                        </div>

                        {/* Message Alert */}
                        {message && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-3 rounded-lg text-sm text-center flex items-center justify-center gap-2 ${
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
                            onClick={() => handleSubmit()}
                            disabled={loading || otp.some(d => !d)}
                            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-6"
                        >
                            {loading ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    <span>Đang xử lý...</span>
                                </>
                            ) : (
                                'Xác thực ngay'
                            )}
                        </motion.button>

                        {/* Resend Logic */}
                        <div className="text-center space-y-4">
                            <p className="text-gray-400 text-sm">
                                Không nhận được mã?{' '}
                                <button
                                    onClick={handleResendOTP}
                                    disabled={resending || countdown > 0}
                                    className="text-purple-400 font-medium hover:text-pink-400 disabled:text-gray-600 disabled:cursor-not-allowed transition-colors"
                                >
                                    {countdown > 0 ? `Gửi lại sau (${countdown}s)` : resending ? 'Đang gửi...' : 'Gửi lại mã'}
                                </button>
                            </p>
                            
                            <div className="text-xs text-gray-500/80 px-4">
                                <span className="block mb-1">💡 Mẹo:</span>
                                Mã OTP có hiệu lực trong 3 phút. Nếu không thấy email, hãy kiểm tra mục Spam/Junk.
                            </div>
                        </div>
                    </>
                )}
             </div>
        </motion.div>
        
        <p className="text-center text-gray-600 text-xs mt-8">Copyright © InstaClone 2024</p>
      </div>
    </div>
  )
}

// 3. Export default bọc trong Suspense
export default function VerifyOTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0f0c29] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <VerifyOTPContent />
    </Suspense>
  )
}