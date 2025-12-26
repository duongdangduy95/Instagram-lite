'use client'

import Image from 'next/image'
import { useEffect, useMemo, useState } from 'react'

interface BlogImagesProps {
  imageUrls: string[] // ảnh + video URLs (theo thứ tự)
  rounded?: boolean
  frameMode?: 'aspect' | 'fill'
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
}: BlogImagesProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

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
                preload="metadata"
                className="block w-full h-full object-contain"
                onClick={(e) => {
                  // nếu BlogImages nằm trong Link, tránh navigate khi user bấm play/controls
                  e.stopPropagation()
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
            />
          )}
        </div>

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
