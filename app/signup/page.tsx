'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion } from 'framer-motion'
import { Grand_Hotel } from 'next/font/google'

// Cấu hình font Logo
const logoFont = Grand_Hotel({ weight: '400', subsets: ['latin'] })

export default function SignupPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    phone: '',
    password: ''
  })

  // (Nếu sau này bạn muốn thêm input upload avatar thì dùng state này)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)

  const [confirmPassword, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})
  const [agreedToTerms, setAgreedToTerms] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })

    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' })
    }
  }

  const validateForm = () => {
    const errors: Record<string, string> = {}
    if (formData.username.length < 3) errors.username = 'Username phải có ít nhất 3 ký tự'
    if (formData.fullname.length < 2) errors.fullname = 'Họ tên phải có ít nhất 2 ký tự'
    if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email không hợp lệ'
    if (formData.phone && !/^[0-9]{10,11}$/.test(formData.phone.replace(/\s/g, ''))) errors.phone = 'SĐT không hợp lệ'
    if (formData.password.length < 6) errors.password = 'Mật khẩu tối thiểu 6 ký tự'
    if (formData.password !== confirmPassword) errors.confirmPassword = 'Mật khẩu xác nhận không khớp'
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
      const fd = new FormData()
      fd.append('username', formData.username)
      fd.append('fullname', formData.fullname)
      fd.append('email', formData.email)
      fd.append('phone', formData.phone)
      fd.append('password', formData.password)
      if (avatarFile) fd.append('avatar', avatarFile)

      const res = await fetch('/api/signup', {
        method: 'POST',
        body: fd
      })

      const data = await res.json()

      if (res.ok) {
        // If requires OTP verification, redirect to verify page
        if (data.requiresVerification) {
          setMessage('✅ Đăng ký thành công! Đang chuyển đến trang nhập OTP...')
          setMessageType('success')
          
          // Redirect ngay lập tức đến trang nhập OTP (sau 800ms để user thấy message)
          setTimeout(() => {
            router.push(`/verify-otp?email=${encodeURIComponent(formData.email)}&username=${encodeURIComponent(formData.username)}`)
          }, 800)
        } else {
          // Old flow - direct to login (trường hợp không cần OTP)
          setMessage(data.message || 'Đăng ký thành công!')
          setMessageType('success')
          
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
        setMessage(data.message || data.error || 'Đăng ký thất bại')
        setMessageType('error')
      }
    } catch {
      setMessage('Có lỗi xảy ra, vui lòng thử lại')
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  // Animation Variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }
  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  }

  // Class chung cho input để đỡ lặp code
  const inputClass = "w-full px-5 py-3 bg-black/20 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300"
  const labelClass = "text-gray-300 text-xs font-medium uppercase tracking-wider ml-1"
  const errorClass = "text-red-400 text-xs mt-1 ml-1"

  return (
    <div className="min-h-screen bg-[#0f0c29] bg-gradient-to-br from-gray-900 via-[#1a103c] to-gray-900 relative overflow-hidden flex items-center justify-center p-4">
      
      {/* 1. BACKGROUND DYNAMIC */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
         <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
         <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-pink-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
         <div className="absolute top-[40%] left-[40%] w-80 h-80 bg-blue-600/20 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
          
          {/* 2. LEFT SIDE - BRANDING */}
          <motion.div 
            className="hidden md:block space-y-8"
            initial="hidden" animate="visible" variants={staggerContainer}
          >
            <motion.div variants={fadeInUp} className="relative">
                <div className="absolute -inset-6 bg-white/5 rounded-3xl blur-xl -z-10"></div>
                
                {/* Logo Section */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-gradient-to-bl from-pink-500 via-red-500 to-yellow-500 rounded-2xl flex items-center justify-center shadow-xl shadow-red-500/30 ring-1 ring-white/20">
                        <svg className="w-9 h-9 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/>
                        </svg>
                    </div>
                    <h1 className={`${logoFont.className} text-[3.5rem] leading-none pb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-purple-200 drop-shadow-lg`}>
                        InstaClone
                    </h1>
                </div>

                <div className="space-y-4">
                <h2 className="text-6xl font-extrabold leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-100 to-purple-300 drop-shadow-sm">
                        Open<br />the world
                        </span>
                    </h2>
                  <p className="text-purple-200/80 text-lg max-w-md leading-relaxed font-light">
                      Tham gia cùng hàng triệu người dùng. Chia sẻ khoảnh khắc
                      của bạn với bạn bè và gia đình.
                  </p>
                </div>
            </motion.div>
          </motion.div>

          {/* 3. RIGHT SIDE - SIGNUP FORM */}
          <motion.div 
            className="w-full max-w-[500px] mx-auto"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-white/5 backdrop-blur-2xl rounded-3xl p-8 border border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden group">
               {/* Shine Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-shine z-0 pointer-events-none"></div>

              <div className="relative z-10">
                <h2 className="text-2xl font-bold text-white mb-6 text-center">Đăng ký thành viên</h2>
                
                <div className="space-y-4">
                  {/* Row 1: Username & Fullname */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className={labelClass}>Username</label>
                      <input
                        name="username"
                        placeholder="VD: user123"
                        value={formData.username}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {validationErrors.username && <p className={errorClass}>{validationErrors.username}</p>}
                    </div>
                    <div className="space-y-1">
                      <label className={labelClass}>Họ tên</label>
                      <input
                        name="fullname"
                        placeholder="Nguyễn Văn A"
                        value={formData.fullname}
                        onChange={handleChange}
                        className={inputClass}
                      />
                      {validationErrors.fullname && <p className={errorClass}>{validationErrors.fullname}</p>}
                    </div>
                  </div>

                  {/* Row 2: Email */}
                  <div className="space-y-1">
                    <label className={labelClass}>Email</label>
                    <input
                      type="email"
                      name="email"
                      placeholder="email@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {validationErrors.email && <p className={errorClass}>{validationErrors.email}</p>}
                  </div>

                  {/* Row 3: Phone */}
                  <div className="space-y-1">
                    <label className={labelClass}>Số điện thoại</label>
                    <input
                      name="phone"
                      placeholder="0912..."
                      value={formData.phone}
                      onChange={handleChange}
                      className={inputClass}
                    />
                    {validationErrors.phone && <p className={errorClass}>{validationErrors.phone}</p>}
                  </div>

                  {/* Row 4: Password */}
                  <div className="space-y-1">
                    <label className={labelClass}>Mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="••••••"
                        value={formData.password}
                        onChange={handleChange}
                        className={inputClass}
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
                    {validationErrors.password && <p className={errorClass}>{validationErrors.password}</p>}
                  </div>

                  {/* Row 5: Confirm Password */}
                  <div className="space-y-1">
                    <label className={labelClass}>Xác nhận Mật khẩu</label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={inputClass}
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
                    {validationErrors.confirmPassword && <p className={errorClass}>{validationErrors.confirmPassword}</p>}
                  </div>
                  
                  {/* Message Alert */}
                  {message && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                        className={`rounded-lg p-3 text-center text-sm ${
                          messageType === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                        }`}
                    >
                      {message}
                    </motion.div>
                  )}

                {/* Terms Checkbox */}
                <div className="flex items-start gap-2 p-3 bg-white/5 border border-white/10 rounded-lg">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded border-white/10 bg-white/5 text-purple-500 focus:ring-purple-500 cursor-pointer"
                  />
                  <label htmlFor="terms" className="text-xs text-gray-300 cursor-pointer">
                    Tôi đồng ý với {' '}
                    <Link href="#" className="text-purple-400 hover:text-purple-300 underline font-medium">
                      Điều khoản dịch vụ
                    </Link>
                    {' '} và {' '}
                    <Link href="#" className="text-purple-400 hover:text-purple-300 underline font-medium">
                      Chính sách bảo mật
                    </Link>
                    {' '} của Instagram Lite *
                  </label>
                </div>

                {/* Submit Button */}
                <motion.button
                  whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={handleSubmit}
                  disabled={isLoading || !formData.username || !formData.fullname || !formData.email || !formData.password || !confirmPassword || !agreedToTerms}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-purple-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Đăng ký</span>
                    </>
                  )}
                </motion.button>
                
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
            </div>
            <p className="text-center text-gray-600 text-xs mt-6">Copyright © InstaClone 2024</p>
          </motion.div>
      </div>
    </div>
  )
}