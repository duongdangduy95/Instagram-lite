'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    password: ''
  })

  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}

    if (formData.username.length < 3) {
      errors.username = 'Username phải có ít nhất 3 ký tự'
    }

    if (formData.fullname.length < 2) {
      errors.fullname = 'Họ tên phải có ít nhất 2 ký tự'
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ'
    }

    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Số điện thoại không hợp lệ'
    }

    if (formData.password.length < 6) {
      errors.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }

    if (formData.password !== confirmPassword) {
      errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
    }

    return errors
  }

  const handleSubmit = async () => {
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors)
      return
    }

    setIsLoading(true)
    setMessage('')
    setValidationErrors({})

    try {
      // ✅ DÙNG FORMDATA (để gửi file)
      const fd = new FormData()
      fd.append('username', formData.username)
      fd.append('fullname', formData.fullname)
      fd.append('email', formData.email)
      fd.append('phone', formData.phone)
      fd.append('password', formData.password)

      if (avatarFile) {
        fd.append('avatar', avatarFile)
      }

      const res = await fetch('/api/signup', {
        method: 'POST',
        body: fd // ❌ KHÔNG set Content-Type
      })

      const data = await res.json()

      if (res.ok) {
        setMessage(data.message || 'Đăng ký thành công!')
        setMessageType('success')

        // If requires OTP verification, redirect to verify page
        if (data.requiresVerification) {
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&username=${encodeURIComponent(formData.username)}`)
          }, 1500)
        } else {
          // Old flow - direct to login
          setFormData({
            username: '',
            fullname: '',
            email: '',
            phone: '',
            password: ''
          })
          setConfirmPassword('')
          
          setTimeout(() => {
            router.push('/login')
          }, 1500)
        }
      } else {
        setMessage(data.message || 'Đăng ký thất bại')
        setMessageType('error')
      }
    } catch {
      setMessage('Có lỗi xảy ra, vui lòng thử lại')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Welcome Section */}
          <div className="text-white space-y-8 hidden md:block">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold">Instagram Lite</h1>
              </div>
              
              <h2 className="text-5xl font-bold leading-tight">
                Tạo tài khoản<br />mới
              </h2>
              
              <p className="text-gray-300 text-lg">
                Tham gia cùng hàng triệu người dùng. Chia sẻ khoảnh khắc<br />
                của bạn với bạn bè và gia đình. Nhanh chóng và dễ dàng.
              </p>
            </div>
          </div>

          {/* Right Side - Signup Form */}
          <div className="w-full max-w-md mx-auto">
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-2xl">
              <h2 className="text-3xl font-bold text-white mb-4 text-center">Đăng ký ngay</h2>
              <p className="text-gray-300 text-sm text-center mb-6">Nhanh chóng và dễ dàng.</p>
              
              <div className="space-y-3">
                {/* Username & Full name - Same Row */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      name="username"
                      placeholder="Tên đăng nhập *"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    {validationErrors.username && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.username}</p>
                    )}
                  </div>
                  <div>
                    <input
                      name="fullname"
                      placeholder="Họ và tên *"
                      value={formData.fullname}
                      onChange={handleChange}
                      className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    {validationErrors.fullname && (
                      <p className="text-red-400 text-xs mt-1">{validationErrors.fullname}</p>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div>
                  <input
                    type="email"
                    name="email"
                    placeholder="Email *"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  {validationErrors.email && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.email}</p>
                  )}
                </div>

                {/* Phone */}
                <div>
                  <input
                    name="phone"
                    placeholder="Số điện thoại"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                  />
                  {validationErrors.phone && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.phone}</p>
                  )}
                </div>

                {/* Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Mật khẩu mới *"
                      value={formData.password}
                      onChange={handleChange}
                      className="w-full px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showPassword ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                          <path d="M2,4.27L19.73,22L21.14,20.59L3.41,2.86L2,4.27Z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.password && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.password}</p>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Xác nhận mật khẩu *"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-2 pr-10 bg-white/5 border border-white/10 rounded-lg text-white text-xs placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                          <path d="M2,4.27L19.73,22L21.14,20.59L3.41,2.86L2,4.27Z"/>
                        </svg>
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9M12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17M12,4.5C7,4.5 2.73,7.61 1,12C2.73,16.39 7,19.5 12,19.5C17,19.5 21.27,16.39 23,12C21.27,7.61 17,4.5 12,4.5Z"/>
                        </svg>
                      )}
                    </button>
                  </div>
                  {validationErrors.confirmPassword && (
                    <p className="text-red-400 text-xs mt-1">{validationErrors.confirmPassword}</p>
                  )}
                </div>

                {/* Message */}
                {message && (
                  <div className={`rounded-lg p-3 text-center text-sm ${
                    messageType === 'success' 
                      ? 'bg-green-500/10 border border-green-500/50 text-green-400' 
                      : 'bg-red-500/10 border border-red-500/50 text-red-400'
                  }`}>
                    {message}
                  </div>
                )}

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500"
                    defaultChecked={false}
                  />
                  <label htmlFor="terms" className="text-xs text-gray-400">
                    Tôi đồng ý với {' '}
                    <Link href="#" className="text-purple-400 hover:text-purple-300 underline">
                      Điều khoản dịch vụ
                    </Link>
                  </label>
                </div>

                {/* Sign Up Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.username || !formData.fullname || !formData.email || !formData.password || !confirmPassword}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating account...
                    </>
                  ) : (
                    <>
                      Đăng ký
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                      </svg>
                    </>
                  )}
                </button>

                {/* Divider */}
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/10"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-transparent text-gray-400">Hoặc tiếp tục với</span>
                  </div>
                </div>

                {/* Google Sign Up */}
                <button
                  type="button"
                  onClick={() => signIn('google', { callbackUrl: '/profile' })}
                  className="flex items-center justify-center w-12 h-12 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-all mx-auto"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                </button>

                {/* Login Link */}
                <p className="text-center text-gray-400 text-sm">
                  Đã có tài khoản?{' '}
                  <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium transition-colors">
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 text-sm mt-8">
              Copyright © Instagram Lite
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
