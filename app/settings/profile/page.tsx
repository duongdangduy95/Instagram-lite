'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import Navigation from '@/app/components/Navigation'
import { useCurrentUser } from '@/app/contexts/CurrentUserContext'

type ProfileData = {
  id: string
  fullname: string
  username: string
  phone: string | null
  image: string | null
}

export default function SettingsProfilePage() {
  const { update } = useSession()
  const { refresh } = useCurrentUser()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<ProfileData | null>(null)

  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [phone, setPhone] = useState('')
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/me/profile', { credentials: 'include' })
        if (!res.ok) throw new Error(await res.text().catch(() => ''))
        const data = (await res.json()) as ProfileData
        setProfile(data)
        setFullname(data.fullname || '')
        setUsername(data.username || '')
        setPhone(data.phone || '')
        setAvatarPreview(data.image || null)
      } catch {
        alert('Không thể tải thông tin hồ sơ. Vui lòng thử lại.')
      } finally {
        setLoading(false)
      }
    }
    void load()
  }, [])

  // Cleanup object URL
  useEffect(() => {
    if (!avatarPreview) return
    if (!avatarPreview.startsWith('blob:')) return
    return () => URL.revokeObjectURL(avatarPreview)
  }, [avatarPreview])

  const validate = () => {
    const next: Record<string, string> = {}

    const fn = fullname.trim()
    if (!fn) next.fullname = 'Họ và tên không được để trống'
    else if (fn.length < 2) next.fullname = 'Họ và tên phải có ít nhất 2 ký tự'
    else if (fn.length > 50) next.fullname = 'Họ và tên không được quá 50 ký tự'

    const un = username.trim()
    if (!un) next.username = 'Username không được để trống'
    else if (un.length < 3 || un.length > 30) next.username = 'Username phải có 3-30 ký tự'
    else if (!/^[a-zA-Z0-9._]+$/.test(un)) next.username = 'Username chỉ được chứa chữ, số, dấu chấm và gạch dưới'

    const ph = phone.trim()
    if (ph) {
      const phoneRegex = /^[0-9]{10,11}$/
      if (!phoneRegex.test(ph.replace(/\s/g, ''))) next.phone = 'Số điện thoại phải có 10-11 chữ số'
    }

    setErrors(next)
    return Object.keys(next).length === 0
  }

  const onPickAvatar = (file: File) => {
    if (file.size > 5 * 1024 * 1024) {
      alert('Ảnh quá lớn. Vui lòng chọn ảnh <= 5MB.')
      return
    }
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const onSave = async () => {
    if (!validate()) return
    setSaving(true)
    try {
      const form = new FormData()
      form.append('fullname', fullname.trim())
      form.append('username', username.trim())
      form.append('phone', phone.trim())
      if (avatarFile) form.append('avatar', avatarFile)

      const res = await fetch('/api/me', {
        method: 'PATCH',
        body: form,
        credentials: 'include',
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        if (res.status === 409) {
          // Backend trả msg chung; map theo field nếu có
          const msg = (data?.error as string) || 'Dữ liệu đã được sử dụng'
          if ((msg || '').toLowerCase().includes('username')) setErrors((p) => ({ ...p, username: msg }))
          else alert(msg)
          return
        }
        alert(data?.error || 'Không thể cập nhật hồ sơ')
        return
      }

      // Update state local + refresh session & navbar
      setProfile({
        id: data.id,
        fullname: data.fullname,
        username: data.username,
        phone: data.phone ?? null,
        image: data.image ?? null,
      })

      setAvatarFile(null)
      setAvatarPreview(data.image ?? null)

      await update({ fullname: data.fullname ?? null, username: data.username ?? null, image: data.image ?? null })
      await refresh()

      // Broadcast để các màn đang giữ state (home feed, suggestions, modal, ...) tự cập nhật avatar ngay
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('user:profile-change', {
            detail: {
              userId: data.id,
              fullname: data.fullname ?? null,
              username: data.username ?? null,
              image: data.image ?? null,
            },
          })
        )
      }

      alert('Cập nhật hồ sơ thành công!')
    } catch {
      alert('Có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="ml-64 min-h-screen">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-semibold text-white">Chỉnh sửa trang cá nhân</h1>
              <p className="text-sm text-gray-400 mt-1">Cập nhật ảnh đại diện, họ tên, username và số điện thoại.</p>
            </div>
            <Link href="/profile" className="text-gray-300 hover:text-white underline">
              Quay lại
            </Link>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            {/* Avatar */}
            <div className="flex items-center gap-5 mb-8">
              <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-700 bg-gray-800 flex items-center justify-center flex-shrink-0">
                {avatarPreview ? (
                  <Image src={avatarPreview} alt="Avatar" width={80} height={80} className="object-cover w-full h-full" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                    {(profile?.fullname || profile?.username || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <input
                  id="settings-avatar-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0]
                    if (!f) return
                    onPickAvatar(f)
                  }}
                />

                <div className="flex items-center gap-3">
                  <label
                    htmlFor="settings-avatar-input"
                    className="inline-flex items-center justify-center px-4 py-2 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer text-sm font-semibold"
                  >
                    Chọn ảnh
                  </label>

                  <button
                    type="button"
                    className="text-sm text-gray-400 hover:text-gray-200 underline"
                    onClick={() => {
                      setAvatarFile(null)
                      setAvatarPreview(profile?.image || null)
                      const input = document.getElementById('settings-avatar-input') as HTMLInputElement | null
                      if (input) input.value = ''
                    }}
                  >
                    Hoàn tác
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG/JPG/WebP, tối đa 5MB</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Họ và tên</label>
                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  onBlur={validate}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.fullname ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                  }`}
                  placeholder="Nhập họ và tên"
                />
                {errors.fullname && <p className="text-red-500 text-sm mt-1">{errors.fullname}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onBlur={validate}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.username ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                  }`}
                  placeholder="Nhập username"
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-300 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  onBlur={validate}
                  className={`w-full px-4 py-3 bg-gray-800 border rounded-lg text-white focus:outline-none focus:ring-2 transition-all ${
                    errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-gray-700 focus:ring-blue-500'
                  }`}
                  placeholder="Nhập số điện thoại (tuỳ chọn)"
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div className="flex items-center gap-3 mt-8">
              <button
                onClick={onSave}
                disabled={saving}
                className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-semibold disabled:opacity-50"
              >
                {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
              </button>
              <Link href="/profile" className="px-5 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-colors font-semibold">
                Hủy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


