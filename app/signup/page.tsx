'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
        setMessage('Đăng ký thành công!')
        setMessageType('success')

        setFormData({
          username: '',
          fullname: '',
          email: '',
          phone: '',
          password: ''
        })
        setConfirmPassword('')
        setAvatarFile(null)

        setTimeout(() => {
          router.push('/login')
        }, 1500)
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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <div className="bg-white rounded-2xl shadow-xl p-8 backdrop-blur-sm border border-white/20">

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Tạo tài khoản mới
            </h1>
            <p className="text-gray-600">Điền thông tin để bắt đầu</p>
          </div>

          <div className="space-y-5">

            {/* Avatar */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ảnh đại diện (tùy chọn)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setAvatarFile(file)
                }}
                className="w-full text-sm text-gray-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:text-sm file:font-semibold
                  file:bg-emerald-50 file:text-emerald-700
                  hover:file:bg-emerald-100"
              />
            </div>

            {/* Username */}
            <input
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Fullname */}
            <input
              name="fullname"
              placeholder="Họ và tên"
              value={formData.fullname}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Email */}
            <input
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Phone */}
            <input
              name="phone"
              placeholder="Số điện thoại"
              value={formData.phone}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Password */}
            <input
              type="password"
              name="password"
              placeholder="Mật khẩu"
              value={formData.password}
              onChange={handleChange}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {/* Confirm */}
            <input
              type="password"
              placeholder="Xác nhận mật khẩu"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-3 border rounded-xl"
            />

            {message && (
              <p className={`text-center text-sm ${
                messageType === 'success' ? 'text-emerald-600' : 'text-red-600'
              }`}>
                {message}
              </p>
            )}

            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 rounded-xl"
            >
              {isLoading ? 'Đang đăng ký...' : 'Tạo tài khoản'}
            </button>

            <p className="text-center text-sm">
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-emerald-600 font-medium">
                Đăng nhập
              </Link>
            </p>

          </div>
        </div>
      </div>
    </div>
  )
}
