'use client'

import { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Navigation from '@/app/components/Navigation'
import { MAX_MEDIA_FILES, validateAndFilterMediaFiles } from '@/lib/mediaValidation'
import type { BlogMusicDTO } from '@/types/dto'

export default function EditBlogPage() {
  const { id } = useParams()
  const router = useRouter()
  const [newPreviews, setNewPreviews] = useState<string[]>([])

  useEffect(() => {
    return () => {
      newPreviews.forEach(url => URL.revokeObjectURL(url))
    }
  }, [newPreviews])


  const [caption, setCaption] = useState('')
  const [existingImages, setExistingImages] = useState<string[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [newFileTypes, setNewFileTypes] = useState<('image' | 'video')[]>([])
  const [showSaveConfirm, setShowSaveConfirm] = useState(false)

  // Music (optional) - only for image-only posts
  const [music, setMusic] = useState<BlogMusicDTO>(null)
  const [musicModalOpen, setMusicModalOpen] = useState(false)
  const [musicQuery, setMusicQuery] = useState('')
  const [musicResults, setMusicResults] = useState<NonNullable<BlogMusicDTO>[]>([])
  const [musicLoading, setMusicLoading] = useState(false)
  const [musicError, setMusicError] = useState<string | null>(null)
  const [searchIndex, setSearchIndex] = useState<number | null>(0)
  const [searchTotal, setSearchTotal] = useState<number | null>(null)
  const [trendingTracks, setTrendingTracks] = useState<NonNullable<BlogMusicDTO>[]>([])
  const [trendingIndex, setTrendingIndex] = useState<number | null>(0)
  const [trendingLoading, setTrendingLoading] = useState(false)
  const [trendingError, setTrendingError] = useState<string | null>(null)
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null)
  const musicAudioRef = useRef<HTMLAudioElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const isVideoUrl = (url: string) => /\.(mp4|mov|webm)$/i.test((url.split('?')[0] || '').toLowerCase())
  const hasVideo = existingImages.some(isVideoUrl) || newFileTypes.includes('video')



  // Load blog data
  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`/api/blog/${id}`)
      if (!res.ok) {
        router.push('/home')
        return
      }
      const data = await res.json()
      setCaption(data.caption ?? '')
      setExistingImages(data.imageUrls ?? [])
      setMusic(data.music ?? null)
    }

    fetchBlog()
  }, [id, router])

  // Remove existing image
  const removeExistingImage = (index: number) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index))
  }

  // Add new images
  const handleAddFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return

    const selected = Array.from(e.target.files)

    // Reset input để có thể chọn lại cùng file
    e.target.value = ''

    const remainingSlots = Math.max(0, MAX_MEDIA_FILES - existingImages.length - newFiles.length)
    const { accepted, rejectedReasons, truncatedByLimit } = validateAndFilterMediaFiles({
      selectedFiles: selected,
      remainingSlots,
    })

    if (rejectedReasons.length > 0) {
      alert(rejectedReasons.slice(0, 3).join('\n') + (rejectedReasons.length > 3 ? '\n...' : ''))
    }
    if (truncatedByLimit) {
      alert(`Chỉ được tối đa ${MAX_MEDIA_FILES} file (tính cả file hiện có). Một số file đã bị bỏ qua.`)
    }
    if (accepted.length === 0) return

    setNewFiles(prev => [...prev, ...accepted])
    setNewFileTypes(prev => [
      ...prev,
      ...accepted.map(file =>
        file.type.startsWith('video') ? 'video' : 'image'
      ),
    ])

    setNewPreviews(prev => [
      ...prev,
      ...accepted.map(file => URL.createObjectURL(file))
    ])

    // If user adds any video, lock music feature and clear any selected music
    const addedHasVideo = accepted.some((f) => (f.type || '').startsWith('video'))
    if (addedHasVideo) {
      if (music) {
        setMusic(null)
      }
      if (musicModalOpen) setMusicModalOpen(false)
    }
  }

  // Save edit
  const handleSave = () => {
    setShowSaveConfirm(true)
  }

  const stopMusicPreview = () => {
    const a = musicAudioRef.current
    if (a) {
      a.pause()
      musicAudioRef.current = null
    }
    setPlayingTrackId(null)
  }

  const togglePreview = async (trackId: number, previewUrl: string) => {
    if (!previewUrl) return
    if (playingTrackId === trackId) {
      stopMusicPreview()
      return
    }
    stopMusicPreview()
    try {
      const a = new Audio(previewUrl)
      a.preload = 'none'
      a.onended = () => {
        setPlayingTrackId(null)
        musicAudioRef.current = null
      }
      musicAudioRef.current = a
      setPlayingTrackId(trackId)
      await a.play()
    } catch {
      setPlayingTrackId(null)
      musicAudioRef.current = null
    }
  }

  const loadTrending = async (opts?: { reset?: boolean }) => {
    const reset = !!opts?.reset
    const nextIndex = reset ? 0 : trendingIndex
    if (nextIndex === null) return
    if (trendingLoading) return

    setTrendingLoading(true)
    setTrendingError(null)
    try {
      const res = await fetch(`/api/music/deezer/trending?index=${nextIndex}&limit=10`)
      const json = (await res.json()) as { data?: NonNullable<BlogMusicDTO>[]; nextIndex?: number | null; error?: string }
      if (!res.ok) {
        setTrendingError(json?.error || 'Không thể tải nhạc gợi ý')
        return
      }
      const data = Array.isArray(json?.data) ? json.data : []
      setTrendingTracks((prev) => {
        if (reset) return data
        const seen = new Set(prev.map((x) => x.trackId))
        const merged = [...prev]
        for (const item of data) {
          if (!seen.has(item.trackId)) {
            seen.add(item.trackId)
            merged.push(item)
          }
        }
        return merged
      })
      setTrendingIndex(typeof json?.nextIndex === 'number' ? json.nextIndex : null)
    } catch {
      setTrendingError('Không thể tải nhạc gợi ý')
    } finally {
      setTrendingLoading(false)
    }
  }

  // Stop preview when modal closes
  useEffect(() => {
    if (musicModalOpen) return
    stopMusicPreview()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicModalOpen])

  // Load trending when modal opens and query is empty
  useEffect(() => {
    if (!musicModalOpen) return
    if (hasVideo) return
    if (musicQuery.trim()) return
    if (trendingTracks.length > 0) return
    void loadTrending({ reset: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [musicModalOpen, hasVideo])

  // Debounced search
  useEffect(() => {
    if (!musicModalOpen) return
    if (hasVideo) return
    const q = musicQuery.trim()
    if (!q) {
      setMusicError(null)
      return
    }
    const t = window.setTimeout(async () => {
      setMusicLoading(true)
      setMusicError(null)
      try {
        const res = await fetch(`/api/music/deezer/search?q=${encodeURIComponent(q)}&index=0&limit=12`)
        const json = (await res.json()) as { data?: NonNullable<BlogMusicDTO>[]; nextIndex?: number | null; total?: number; error?: string }
        if (!res.ok) {
          setMusicResults([])
          setMusicError(json?.error || 'Không thể tìm nhạc')
          return
        }
        setMusicResults(Array.isArray(json?.data) ? json.data : [])
        setSearchIndex(typeof json?.nextIndex === 'number' ? json.nextIndex : null)
        setSearchTotal(typeof json?.total === 'number' ? json.total : null)
      } catch {
        setMusicResults([])
        setMusicError('Không thể tìm nhạc')
      } finally {
        setMusicLoading(false)
      }
    }, 300)
    return () => window.clearTimeout(t)
  }, [musicModalOpen, musicQuery, hasVideo])

  const loadMoreSearch = async () => {
    const q = musicQuery.trim()
    if (!q) return
    if (musicLoading) return
    if (searchIndex === null) return

    setMusicLoading(true)
    setMusicError(null)
    try {
      const res = await fetch(`/api/music/deezer/search?q=${encodeURIComponent(q)}&index=${searchIndex}&limit=12`)
      const json = (await res.json()) as { data?: NonNullable<BlogMusicDTO>[]; nextIndex?: number | null; total?: number; error?: string }
      if (!res.ok) {
        setMusicError(json?.error || 'Không thể tìm nhạc')
        return
      }
      const data = Array.isArray(json?.data) ? json.data : []
      setMusicResults((prev) => {
        const seen = new Set(prev.map((x) => x.trackId))
        const merged = [...prev]
        for (const item of data) {
          if (!seen.has(item.trackId)) {
            seen.add(item.trackId)
            merged.push(item)
          }
        }
        return merged
      })
      setSearchIndex(typeof json?.nextIndex === 'number' ? json.nextIndex : null)
      setSearchTotal(typeof json?.total === 'number' ? json.total : null)
    } catch {
      setMusicError('Không thể tìm nhạc')
    } finally {
      setMusicLoading(false)
    }
  }

  const confirmSave = async () => {
    setLoading(true)
    setShowSaveConfirm(false)

    const formData = new FormData()
    formData.append('caption', caption)
    existingImages.forEach(url => formData.append('existingImages', url))
    newFiles.forEach(file => formData.append('newFiles', file))
    formData.append('music', music ? JSON.stringify(music) : '')

    const res = await fetch(`/api/blog/${id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include',
    })

    setLoading(false)

    if (res.ok) {
      window.location.href = `/home`
    } else {
      alert('Cập nhật thất bại')
    }
  }

  return (
    <div className="min-h-screen bg-[#0B0E11] text-white">
      <Navigation />

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-xl font-semibold mb-4">Chỉnh sửa bài viết</h1>

        {/* Caption */}
        <textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          rows={3}
          className="w-full bg-[#212227] border border-gray-700 rounded-lg p-3 text-gray-100 focus:outline-none focus:border-[#7565E6]"
        />

        {/* Images grid */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {/* Existing images */}
          {existingImages.map((url, index) => {
            const isVideo = url.match(/\.(mp4|webm|mov)$/)

            return (
              <div key={url} className="relative group">
                {isVideo ? (
                  <video
                    src={url}
                    controls
                    className="aspect-square object-cover rounded-lg"
                  />
                ) : (
                  <img
                    src={url}
                    className="aspect-square object-cover rounded-lg"
                  />
                )}

                <button
                  onClick={() => removeExistingImage(index)}
                  className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2 opacity-0 group-hover:opacity-100 transition"
                >
                  ✕
                </button>
              </div>
            )
          })}


          {/* New images */}
          {newPreviews.map((url, index) => (
            <div key={url} className="relative group">
              {newFileTypes[index] === 'video' ? (
                <video
                  src={url}
                  controls
                  className="aspect-square object-cover rounded-lg"
                />
              ) : (
                <img
                  src={url}
                  className="aspect-square object-cover rounded-lg"
                />
              )}

              <button
                onClick={() => {
                  // Revoke ngay để tránh leak khi thao tác nhiều
                  URL.revokeObjectURL(url)
                  setNewPreviews(prev => prev.filter((_, i) => i !== index))
                  setNewFiles(prev => prev.filter((_, i) => i !== index))
                  setNewFileTypes(prev => prev.filter((_, i) => i !== index))
                }}
                className="absolute top-1 right-1 bg-black/70 text-white rounded-full px-2 opacity-0 group-hover:opacity-100 transition"
              >
                ✕
              </button>
            </div>
          ))}


          {/* Add button */}
          <label
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square flex items-center justify-center rounded-lg border-2 border-dashed border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200 cursor-pointer transition"
          >
            <span className="text-3xl">+</span>
          </label>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={handleAddFiles}
          className="hidden"
        />

        {/* Music (optional) */}
        <div className="mt-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-gray-200">Nhạc</div>
            <button
              type="button"
              onClick={() => {
                setMusicModalOpen(true)
              }}
              disabled={loading || hasVideo}
              className={`px-3 py-2 rounded-lg border text-sm transition ${
                hasVideo
                  ? 'border-gray-700 text-gray-500 cursor-not-allowed'
                  : 'border-gray-700 hover:border-gray-500 text-gray-200 hover:text-white'
              }`}
            >
              {music ? 'Đổi nhạc' : 'Thêm nhạc'}
            </button>
          </div>

          {hasVideo && (
            <p className="mt-2 text-xs text-gray-500">
              Nhạc chỉ áp dụng cho bài đăng toàn ảnh. Khi có video, tính năng nhạc sẽ bị khóa.
            </p>
          )}

          {music && (
            <div className="mt-3 flex items-center justify-between gap-3 rounded-lg border border-gray-700 bg-[#212227] p-3">
              <div className="min-w-0">
                <div className="text-sm font-semibold text-white truncate">{music.title}</div>
                <div className="text-xs text-gray-400 truncate">{music.artist} • Deezer preview 30s</div>
              </div>
              <button
                type="button"
                onClick={() => setMusic(null)}
                className="px-3 py-1.5 rounded-lg bg-gray-700 hover:bg-gray-600 text-sm"
              >
                Xóa
              </button>
            </div>
          )}
        </div>


        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-4 py-2 bg-[#7565E6] rounded-lg hover:bg-[#6455C2]"
          >
            {loading ? 'Đang lưu...' : 'Lưu'}
          </button>

          <button
            onClick={() => router.push('/home')}
            className="px-4 py-2 bg-gray-700 rounded-lg"
          >
            Hủy
          </button>
        </div>
      </div>

{/* Music modal */}
{musicModalOpen && (
        <div
          className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) setMusicModalOpen(false)
          }}
        >
          {/* CSS Animation cho sóng nhạc */}
          <style>{`
            @keyframes music-bar {
              0%, 100% { height: 20%; }
              50% { height: 100%; }
            }
            .animate-music-bar-1 { animation: music-bar 0.6s infinite ease-in-out; }
            .animate-music-bar-2 { animation: music-bar 0.6s infinite ease-in-out 0.2s; }
            .animate-music-bar-3 { animation: music-bar 0.6s infinite ease-in-out 0.4s; }
          `}</style>

          <div
            className="w-full max-w-lg bg-[#121212] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-white/5 flex items-center justify-between bg-[#121212] z-10">
              <div className="font-bold text-lg text-white">Thêm nhạc</div>
              <button
                type="button"
                className="h-8 w-8 rounded-full hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-colors"
                onClick={() => setMusicModalOpen(false)}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Search Input */}
            <div className="p-4 bg-[#121212]">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500 group-focus-within:text-purple-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                </div>
                <input
                  value={musicQuery}
                  onChange={(e) => setMusicQuery(e.target.value)}
                  placeholder="Tìm bài hát, nghệ sĩ..."
                  className="w-full pl-10 pr-4 py-3 bg-[#2a2a2a] border border-transparent rounded-xl text-white placeholder-gray-500 focus:outline-none focus:bg-[#333] focus:border-purple-500/50 transition-all"
                />
              </div>
              
              {musicError && <div className="mt-2 text-sm text-red-400">{musicError}</div>}
              {trendingError && !musicQuery.trim() && <div className="mt-2 text-sm text-red-400">{trendingError}</div>}
            </div>

            {/* Scrollable List */}
            <div
              ref={listRef}
              className="flex-1 overflow-y-auto px-2 pb-4 space-y-1 no-scrollbar"
              onScroll={(e) => {
                const el = e.currentTarget
                const remaining = el.scrollHeight - el.scrollTop - el.clientHeight
                if (remaining < 240) {
                  if (musicQuery.trim()) {
                    void loadMoreSearch()
                  } else {
                    if (trendingLoading) return
                    if (trendingIndex === null) return
                    void loadTrending()
                  }
                }
              }}
            >
              {/* Loading / Empty States */}
              {musicQuery.trim() ? (
                <>
                  {musicLoading && <div className="py-4 text-center text-sm text-gray-400">Đang tìm...</div>}
                  {!musicLoading && musicResults.length === 0 && !musicError && (
                    <div className="py-8 text-center text-sm text-gray-500">Không tìm thấy kết quả nào.</div>
                  )}
                </>
              ) : (
                <>
                  {trendingTracks.length === 0 && trendingLoading && <div className="py-4 text-center text-sm text-gray-400">Đang tải gợi ý...</div>}
                </>
              )}

              {/* Track List */}
              {(musicQuery.trim() ? musicResults : trendingTracks).map((t) => {
                 const isPlaying = playingTrackId === t.trackId;
                 return (
                  <div
                    key={`deezer:${t.trackId}`}
                    className="group flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer select-none"
                    // Bấm vào dòng cũng có thể chọn (tuỳ ý, hoặc để nút chọn riêng)
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {/* Album Art + Play Overlay */}
                      <div 
                        className="relative h-12 w-12 flex-shrink-0 cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          void togglePreview(t.trackId, t.previewUrl);
                        }}
                      >
                        {t.coverUrl ? (
                          <img src={t.coverUrl} alt={t.title} className="w-full h-full rounded-lg object-cover bg-gray-800" />
                        ) : (
                          <div className="w-full h-full rounded-lg bg-gray-800" />
                        )}

                        {/* Overlay: Play Icon or Visualizer */}
                        <div className={`absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center transition-opacity ${isPlaying ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                           {isPlaying ? (
                              // Sóng nhạc nhảy nhót
                              <div className="flex gap-[2px] items-end h-3">
                                <span className="w-[3px] bg-white animate-music-bar-1"></span>
                                <span className="w-[3px] bg-white animate-music-bar-2"></span>
                                <span className="w-[3px] bg-white animate-music-bar-3"></span>
                              </div>
                           ) : (
                              // Nút Play Icon
                              <svg className="w-6 h-6 text-white drop-shadow-md" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                           )}
                        </div>
                      </div>

                      {/* Info */}
                      <div className="min-w-0 flex-1 flex flex-col justify-center">
                        <div className={`text-sm font-semibold truncate ${isPlaying ? 'text-purple-400' : 'text-white'}`}>
                          {t.title}
                        </div>
                        <div className="text-xs text-gray-400 truncate">{t.artist}</div>
                      </div>
                    </div>

                    {/* Select Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        stopMusicPreview();
                        setMusic(t);
                        setMusicModalOpen(false);
                      }}
                      className="ml-3 px-4 py-1.5 rounded-full bg-white/10 hover:bg-[#6455C2] hover:text-white border border-white/5 text-xs font-semibold text-gray-300 transition-all active:scale-95"
                    >
                      Chọn
                    </button>
                  </div>
                )
              })}

              {/* Bottom Loaders */}
              {!musicQuery.trim() && trendingTracks.length > 0 && (
                <div className="py-4 text-center text-xs text-gray-600">
                  {trendingLoading
                    ? <div className="flex justify-center"><div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                    : (trendingIndex === null ? 'Đã hiển thị hết danh sách.' : '')}
                </div>
              )}

              {musicQuery.trim() && musicResults.length > 0 && (
                <div className="py-4 text-center text-xs text-gray-600">
                  {musicLoading
                    ? <div className="flex justify-center"><div className="w-4 h-4 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div></div>
                    : (searchIndex === null ? 'Đã hiển thị hết kết quả.' : '')}
                </div>
              )}
            </div>
          </div>
        </div>
      )}


      {/* Confirmation Modal */}
      {
        showSaveConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
            <div className="w-full max-w-sm bg-[#212227] border border-gray-700 rounded-lg p-6 shadow-xl">
              <h2 className="text-lg font-semibold text-white mb-2">Lưu thay đổi?</h2>
              <p className="text-gray-300 mb-6 text-sm">
                Bạn có chắc chắn muốn lưu các thay đổi này không?
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowSaveConfirm(false)}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-white text-sm font-medium transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmSave}
                  disabled={loading}
                  className="px-4 py-2 rounded-lg bg-[#7565E6] hover:bg-[#6455C2] text-white text-sm font-medium transition-colors"
                  autoFocus
                >
                  {loading ? 'Đang lưu...' : 'Lưu'}
                </button>
              </div>
            </div>
          </div>
        )
      }
    </div >
  )
}
