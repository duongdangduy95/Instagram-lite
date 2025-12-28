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
        // Nếu chưa đăng nhập (đăng ký mới), redirect về login
        setTimeout(() => {
          router.push('/login?verified=true')
        }, 1500)
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-serif mb-2">Instagram Lite</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded"></div>
        </div>

        {success ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác thực thành công!</h2>
            <p className="text-gray-600">Đang chuyển hướng đến trang đăng nhập...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Xác thực email</h2>
              <p className="text-gray-600">
                Chúng tôi đã gửi mã OTP gồm 6 chữ số đến
              </p>
              <p className="text-blue-600 font-medium">{email}</p>
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
                  className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none transition"
                  disabled={loading}
                />
              ))}
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              onClick={() => handleSubmit()}
              disabled={loading || otp.some(d => !d)}
              className="w-full bg-blue-500 text-white py-3 rounded-lg font-semibold hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition mb-4"
            >
              {loading ? 'Đang xác thực...' : 'Xác thực'}
            </button>

            {/* Resend OTP */}
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                Không nhận được mã?
              </p>
              <button
                onClick={handleResendOTP}
                disabled={resending || countdown > 0}
                className="text-blue-500 font-medium hover:text-blue-600 disabled:text-gray-400 disabled:cursor-not-allowed"
              >
                {countdown > 0 
                  ? `Gửi lại sau ${countdown}s` 
                  : resending 
                  ? 'Đang gửi...' 
                  : 'Gửi lại mã OTP'}
              </button>
            </div>

            {/* Info */}
            <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <p className="text-xs text-gray-600">
                <strong>💡 Lưu ý:</strong> Mã OTP có hiệu lực trong 3 phút. 
                Nếu không thấy email, vui lòng kiểm tra thư mục spam.
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
