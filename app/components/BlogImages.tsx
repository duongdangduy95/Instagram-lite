'use client'

import Image from 'next/image'
import { useEffect, useMemo, useRef, useState } from 'react'

interface BlogImagesProps {
  imageUrls: string[] // ảnh + video URLs (theo thứ tự)
  rounded?: boolean
  frameMode?: 'aspect' | 'fill'
  // Optional: music preview (30s). Only for image-only posts.
  music?: {
    provider: 'deezer'
    trackId: number
    title: string
    artist: string
    previewUrl: string
    coverUrl?: string | null
    durationSec?: number | null
  } | null
  musicKey?: string
}

const isVideoUrl = (url: string) =>
  (() => {
    const clean = url.split('?')[0].toLowerCase()
    return clean.endsWith('.mp4') || clean.endsWith('.mov') || clean.endsWith('.webm')
  })()

export default function BlogImages({
  imageUrls,
  rounded = true,
  frameMode = 'aspect',
  music = null,
  musicKey,
}: BlogImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const instanceIdRef = useRef<string>(
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? // @ts-expect-error - runtime guarded
        crypto.randomUUID()
      : `${Date.now()}-${Math.random()}`
  )

  const urls = useMemo(() => imageUrls ?? [], [imageUrls])
  const [ratioByUrl, setRatioByUrl] = useState<Record<string, number>>({})
  const [frameRatio, setFrameRatio] = useState(1)

  // Reset index khi list media đổi (vd: feed re-render)
  useEffect(() => {
    if (urls.length === 0) return
    setCurrentIndex(0)
  }, [urls.length])

  const hasMultiple = urls.length > 1

  const nextIndex = () => (currentIndex + 1) % urls.length
  const prevIndex = () => (currentIndex - 1 + urls.length) % urls.length

  const dots = urls.map((_, idx) => idx)

  const clampRatio = (ratio: number) => {
    // Instagram-like: portrait tối đa 4:5 (0.8), landscape tối đa 1.91:1
    const MIN = 4 / 5
    const MAX = 1.91
    return Math.max(MIN, Math.min(MAX, ratio))
  }

  // Tính "khung lớn nhất" theo yêu cầu:
  // - Giữ nguyên bề ngang
  // - Chỉ thay đổi chiều cao => khung cao nhất tương ứng với ratio nhỏ nhất (w/h nhỏ => ảnh cao)
  // - Vẫn clamp theo kiểu Instagram để tránh loạn layout
  const desiredFrameRatio = useMemo(() => {
    if (urls.length === 0) return 1
    let minRatio = Infinity
    for (const u of urls) {
      const raw = ratioByUrl[u]
      const r = clampRatio(typeof raw === 'number' && raw > 0 ? raw : 1)
      if (r < minRatio) minRatio = r
    }
    return Number.isFinite(minRatio) ? minRatio : 1
  }, [urls, ratioByUrl])

  useEffect(() => {
    setFrameRatio(desiredFrameRatio)
  }, [desiredFrameRatio])

  // Load aspect ratio cho tất cả media trong post để chọn khung "lớn nhất" ổn định
  useEffect(() => {
    if (urls.length === 0) return
    let cancelled = false

    const setRatioFor = (u: string, ratio: number) => {
      if (cancelled) return
      if (!Number.isFinite(ratio) || ratio <= 0) return
      setRatioByUrl((prev) => (prev[u] ? prev : { ...prev, [u]: ratio }))
    }

    for (const u of urls) {
      if (!u) continue
      if (ratioByUrl[u]) continue

      if (isVideoUrl(u)) {
        const v = document.createElement('video')
        v.preload = 'metadata'
        v.muted = true
        v.playsInline = true
        v.src = u
        v.onloadedmetadata = () => {
          const w = v.videoWidth || 0
          const h = v.videoHeight || 0
          if (w > 0 && h > 0) setRatioFor(u, w / h)
          v.src = ''
        }
        v.onerror = () => {
          v.src = ''
        }
      } else {
        const img = new window.Image()
        img.decoding = 'async'
        img.src = u
        img.onload = () => {
          const w = (img as HTMLImageElement).naturalWidth || 0
          const h = (img as HTMLImageElement).naturalHeight || 0
          if (w > 0 && h > 0) setRatioFor(u, w / h)
        }
      }
    }

    return () => {
      cancelled = true
    }
  }, [urls, ratioByUrl])

  if (urls.length === 0) return null

  const canShowMusic = !!music?.previewUrl
  const key = musicKey ?? (music?.previewUrl ?? '')

  const stopMusic = () => {
    const a = audioRef.current
    if (a) {
      a.pause()
      try {
        a.currentTime = 0
      } catch {}
    }
    setMusicPlaying(false)
  }

  const toggleMusic = async () => {
    if (!music?.previewUrl) return
    if (musicPlaying) {
      stopMusic()
      return
    }

    // Tell other posts to stop
    window.dispatchEvent(
      new CustomEvent('music:play', {
        detail: { key, instanceId: instanceIdRef.current },
      })
    )

    try {
      if (!audioRef.current) {
        const a = new Audio(music.previewUrl)
        a.preload = 'none'
        a.onended = () => setMusicPlaying(false)
        audioRef.current = a
      } else {
        audioRef.current.src = music.previewUrl
      }

      await audioRef.current.play()
      setMusicPlaying(true)
    } catch {
      setMusicPlaying(false)
    }
  }

  // Global stop listener: only one preview should play at a time
  useEffect(() => {
    if (!canShowMusic) return
    const onPlay = (e: Event) => {
      const detail = (e as CustomEvent).detail as { key?: string; instanceId?: string } | undefined
      if (!detail) return
      // Stop if another instance started playing (even same post key)
      if (detail.instanceId && detail.instanceId === instanceIdRef.current) return
      stopMusic()
    }
    const onStopAll = () => stopMusic()
    window.addEventListener('music:play', onPlay as EventListener)
    window.addEventListener('music:stop', onStopAll as EventListener)
    return () => {
      window.removeEventListener('music:play', onPlay as EventListener)
      window.removeEventListener('music:stop', onStopAll as EventListener)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canShowMusic, key])

  // Cleanup on unmount / previewUrl change
  useEffect(() => {
    return () => {
      const a = audioRef.current
      if (a) {
        a.pause()
        audioRef.current = null
      }
    }
  }, [music?.previewUrl])

  return (
    <div className={frameMode === 'fill' ? 'w-full h-full' : 'w-full'}>
      {/* Carousel (Instagram-like): 1 media + arrows + dots */}
      <div
        className={`relative w-full overflow-hidden bg-black select-none ${rounded ? 'rounded-lg' : ''} ${
          frameMode === 'fill' ? 'h-full' : ''
        }`}
        style={frameMode === 'fill' ? undefined : { aspectRatio: `${frameRatio}` }}
      >
        {/* Media */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          {isVideoUrl(urls[currentIndex]) ? (
            <>
              <video
                src={urls[currentIndex]}
                playsInline
                controls
                preload="none"
                className="block w-full h-full object-contain"
                onClick={(e) => {
                  // nếu BlogImages nằm trong Link, tránh navigate khi user bấm play/controls
                  e.stopPropagation()
                }}
                onMouseEnter={(e) => {
                  // Preload metadata khi hover (tối ưu UX)
                  const video = e.currentTarget
                  if (video.readyState < 1) {
                    video.preload = 'metadata'
                  }
                }}
              />
            </>
          ) : (
            <Image
              src={urls[currentIndex]}
              alt={`Ảnh ${currentIndex + 1}`}
              width={1080}
              height={1080}
              className="block w-full h-full object-contain"
              sizes="(max-width: 768px) 100vw, 560px"
              loading="lazy"
            />
          )}
        </div>

        {/* Music speaker icon (bottom-right) */}
        {canShowMusic && !isVideoUrl(urls[currentIndex]) && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              void toggleMusic()
            }}
            className="absolute bottom-3 right-3 z-30 h-10 w-10 rounded-full bg-black/55 hover:bg-black/75 text-white flex items-center justify-center"
            aria-label={musicPlaying ? 'Tắt nhạc' : 'Bật nhạc'}
            title={music ? `${music.title} • ${music.artist}` : 'Nhạc'}
          >
            <div
              className="w-5 h-5 bg-white"
              style={{
                maskImage: `url(${musicPlaying ? '/icons/sound-svgrepo-com.svg' : '/icons/sound-off-svgrepo-com.svg'})`,
                maskRepeat: 'no-repeat',
                maskPosition: 'center',
                maskSize: 'contain',
                WebkitMaskImage: `url(${musicPlaying ? '/icons/sound-svgrepo-com.svg' : '/icons/sound-off-svgrepo-com.svg'})`,
                WebkitMaskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                WebkitMaskSize: 'contain',
              }}
            />
          </button>
        )}

        {/* Arrows */}
        {hasMultiple && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(prevIndex())
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
              aria-label="Ảnh trước"
            >
              ‹
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                setCurrentIndex(nextIndex())
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center"
              aria-label="Ảnh sau"
            >
              ›
            </button>
          </>
        )}

        {/* Dots */}
        {hasMultiple && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex gap-1.5">
            {dots.map((idx) => (
              <button
                key={idx}
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setCurrentIndex(idx)
                }}
                className={`h-2 w-2 rounded-full transition ${
                  idx === currentIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`Chuyển đến ảnh ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
