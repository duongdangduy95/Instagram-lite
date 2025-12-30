'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signOut, useSession } from 'next-auth/react'

export default function VerifyOTPPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { data: session, status, update } = useSession()
  const email = searchParams.get('email')
  const username = searchParams.get('username') || 'User'

  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [resending, setResending] = useState(false)
  const [countdown, setCountdown] = useState(0)

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
    if (!/^\d*$/.test(value)) return // Only allow digits

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)
    setError('')

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }

    // Auto-submit when all 6 digits are entered
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

    // Auto-submit if 6 digits
    if (pastedData.length === 6) {
      handleSubmit(pastedData)
    }
  }

  const handleSubmit = async (otpCode?: string) => {
    const code = otpCode || otp.join('')

    if (code.length !== 6) {
      setError('Vui lòng nhập đủ 6 chữ số')
      return
    }

    setLoading(true)
    setError('')

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

      // Nếu đã đăng nhập (Google OAuth), refresh session và redirect
      if (status === 'authenticated') {
        // Update session để lấy emailVerified mới
        await update()
        
        // Đợi một chút để session update xong
        setTimeout(() => {
          window.location.href = '/home' // Force full page reload
        }, 1000)
      } else {
        // Nếu chưa đăng nhập (đăng ký mới), tự động đăng nhập
        if (data.user && data.user.email) {
          // Tự động đăng nhập bằng email (sử dụng auto-login sau verify)
          const signInResult = await signIn('credentials', {
            email: data.user.email,
            password: 'auto-verified', // Placeholder - backend sẽ skip password check nếu emailVerified = true vừa được set
            redirect: false,
            callbackUrl: '/home'
          })

          if (signInResult?.ok) {
            setTimeout(() => {
              window.location.href = '/home'
            }, 1000)
          } else {
            // Nếu auto-login thất bại, redirect về login
            setTimeout(() => {
              router.push('/login?verified=true&message=Vui lòng đăng nhập')
            }, 1500)
          }
        } else {
          // Fallback: redirect về login
          setTimeout(() => {
            router.push('/login?verified=true')
          }, 1500)
        }
      }

    } catch (err: any) {
      setError(err.message)
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResendOTP = async () => {
    if (countdown > 0) return

    setResending(true)
    setError('')

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

      setCountdown(60) // 60 seconds cooldown
      alert('Mã OTP mới đã được gửi đến email của bạn')

    } catch (err: any) {
      setError(err.message)
    } finally {
      setResending(false)
    }
  }

  if (!email) return null

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white/5 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/10">
            {/* Logo */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mb-4">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12,2C6.48,2 2,6.48 2,12C2,17.52 6.48,22 12,22C17.52,22 22,17.52 22,12C22,6.48 17.52,2 12,2M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M16.59,7.58L10,14.17L7.41,11.59L6,13L10,17L18,9L16.59,7.58Z"/>
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Instagram Lite</h1>
              <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded"></div>
            </div>

            {success ? (
              <div className="text-center">
                <div className="w-20 h-20 bg-green-500/20 border-2 border-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-3">Xác thực thành công!</h2>
                <p className="text-gray-300 mb-4">Đang chuyển hướng đến trang chủ...</p>
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-3 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
                ) : (
              <>
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-3">Xác thực email</h2>
                  <p className="text-gray-300 text-sm mb-1">
                    Chúng tôi đã gửi mã OTP gồm 6 chữ số đến
                  </p>
                  <p className="text-purple-400 font-medium">{email}</p>
                </div>

                {/* OTP Input */}
                <div className="flex justify-center gap-2 mb-6">
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
                      className="w-12 h-14 text-center text-2xl font-bold bg-white/5 border-2 border-white/10 rounded-lg text-white focus:border-purple-500 focus:outline-none transition disabled:opacity-50"
                      disabled={loading}
                    />
                  ))}
                </div>

                {/* Error Message */}
                {error && (
                  <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm text-center">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  onClick={() => handleSubmit()}
                  disabled={loading || otp.some(d => !d)}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition mb-6 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Đang xác thực...
                    </>
                  ) : (
                    'Xác thực'
                  )}
                </button>

                {/* Resend OTP */}
                <div className="text-center mb-6">
                  <p className="text-gray-400 text-sm mb-2">
                    Không nhận được mã?
                  </p>
                  <button
                    onClick={handleResendOTP}
                    disabled={resending || countdown > 0}
                    className="text-purple-400 font-medium hover:text-purple-300 disabled:text-gray-500 disabled:cursor-not-allowed transition"
                  >
                    {countdown > 0 
                      ? `Gửi lại sau ${countdown}s` 
                      : resending 
                      ? 'Đang gửi...' 
                      : 'Gửi lại mã OTP'}
                  </button>
                </div>

                {/* Info */}
                <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
                  <p className="text-xs text-gray-300">
                    <strong className="text-purple-400">💡 Lưu ý:</strong> Mã OTP có hiệu lực trong 3 phút. 
                    Nếu không thấy email, vui lòng kiểm tra thư mục spam.
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-gray-500 text-sm mt-8">
            Copyright © Instagram Lite
          </p>
        </div>
      </div>
    </div>
  )
}
