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
      ? (crypto as any).randomUUID()
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

  // Debug: Log music data để kiểm tra
  useEffect(() => {
    if (music) {
      console.log('[BlogImages] Music data:', {
        hasMusic: !!music,
        hasPreviewUrl: !!music?.previewUrl,
        previewUrl: music?.previewUrl,
        previewUrlType: typeof music?.previewUrl,
        previewUrlLength: music?.previewUrl?.length,
        musicKey,
        fullMusic: music
      })
    } else {
      console.log('[BlogImages] No music data')
    }
  }, [music, musicKey])

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
    if (!music?.previewUrl) {
      console.warn('[BlogImages] Cannot play music: no previewUrl', { music, musicKey })
      return
    }
    if (musicPlaying) {
      stopMusic()
      return
    }

    // Validate URL
    let previewUrl = music.previewUrl.trim()
    if (!previewUrl || (!previewUrl.startsWith('http://') && !previewUrl.startsWith('https://'))) {
      console.error('[BlogImages] Invalid previewUrl:', previewUrl)
      // Không hiển thị alert, chỉ log lỗi
      return
    }

    console.log('[BlogImages] Attempting to play music:', {
      previewUrl,
      title: music.title,
      artist: music.artist,
      fullMusicObject: music
    })

    // Tell other posts to stop
    window.dispatchEvent(
      new CustomEvent('music:play', {
        detail: { key, instanceId: instanceIdRef.current },
      })
    )

    try {
      // Kiểm tra Deezer URL - bao gồm cả cdnt-preview.dzcdn.net và cdns-preview.dzcdn.net
      const isDeezerUrl = previewUrl.includes('deezer.com') || 
                          previewUrl.includes('dzcdn.net') ||
                          previewUrl.startsWith('https://cdns-preview-') ||
                          previewUrl.startsWith('https://cdnt-preview-')
      let audioSrc = previewUrl
      let useProxy = false

      // Tạo audio element và phát trực tiếp (không test trước để giảm delay)
      if (!audioRef.current) {
        const a = new Audio()
        a.preload = 'auto'
        
        // Set up error handlers trước khi set src
        a.onended = () => {
          console.log('[BlogImages] Music ended')
          setMusicPlaying(false)
          // Cleanup blob URL nếu có
          if (useProxy && audioSrc.startsWith('blob:')) {
            URL.revokeObjectURL(audioSrc)
          }
        }
        
        a.onerror = async (e) => {
          const error = a.error
          console.warn('[BlogImages] Audio playback error, trying fallback methods...', {
            errorCode: error?.code,
            errorMessage: error?.message,
            previewUrl,
            networkState: a.networkState,
            readyState: a.readyState
          })
          
          // Đợi một chút để đảm bảo lỗi thực sự xảy ra (không phải chỉ là đang load)
          await new Promise(resolve => setTimeout(resolve, 500))
          
          // Kiểm tra lại xem audio có đang phát không (có thể đã load xong)
          if (a.readyState >= 2 && !a.error) {
            try {
              await a.play()
              setMusicPlaying(true)
              console.log('[BlogImages] Audio loaded after error, playing now')
              return
            } catch (playError) {
              // Vẫn fail, tiếp tục với fallback
            }
          }
          
          let allMethodsFailed = true
          
          // Nếu có lỗi và là Deezer URL, thử refresh hoặc proxy
          if (isDeezerUrl && music.trackId) {
            try {
              // Thử refresh previewUrl từ Deezer trước
              console.log('[BlogImages] Trying to refresh previewUrl from Deezer...')
              const refreshRes = await fetch(`/api/music/deezer/refresh?trackId=${music.trackId}`)
              if (refreshRes.ok) {
                const refreshedMusic = await refreshRes.json()
                if (refreshedMusic?.previewUrl) {
                  const newPreviewUrl = refreshedMusic.previewUrl
                  console.log('[BlogImages] Got fresh previewUrl, trying to play...')
                  a.src = newPreviewUrl
                  a.load()
                  try {
                    await a.play()
                    setMusicPlaying(true)
                    console.log('[BlogImages] Fresh previewUrl works!')
                    allMethodsFailed = false
                    return
                  } catch (playError) {
                    console.warn('[BlogImages] Fresh previewUrl also failed, trying proxy...')
                  }
                }
              }
            } catch (refreshError) {
              console.warn('[BlogImages] Failed to refresh previewUrl:', refreshError)
            }

            // Nếu refresh fail, thử proxy
            if (allMethodsFailed) {
              try {
                console.log('[BlogImages] Trying proxy...')
                const proxyUrl = `/api/music/proxy?url=${encodeURIComponent(previewUrl)}`
                const response = await fetch(proxyUrl)
                
                if (response.ok) {
                  const blob = await response.blob()
                  const blobUrl = URL.createObjectURL(blob)
                  a.src = blobUrl
                  a.load()
                  try {
                    await a.play()
                    audioSrc = blobUrl
                    useProxy = true
                    setMusicPlaying(true)
                    console.log('[BlogImages] Proxy URL works!')
                    allMethodsFailed = false
                    return
                  } catch (playError) {
                    URL.revokeObjectURL(blobUrl)
                    throw playError
                  }
                }
              } catch (proxyError) {
                console.error('[BlogImages] Proxy also failed:', proxyError)
              }
            }
          }
          
          // Chỉ hiển thị alert khi đã thử tất cả các phương pháp và vẫn fail
          // Đợi thêm một chút để đảm bảo audio không thể phát
          if (allMethodsFailed && a.error) {
            // Đợi thêm 1.5 giây để đảm bảo audio thực sự không thể phát
            // (tránh hiển thị alert khi audio đang load)
            setTimeout(() => {
              // Kiểm tra lại lần cuối xem audio có đang phát không
              // Chỉ hiển thị alert nếu audio vẫn có lỗi và không thể phát
              if (a.error && a.readyState === 0 && a.networkState === 3) {
                console.error('[BlogImages] All methods failed, showing error to user')
                alert('Không thể phát nhạc. URL có thể đã hết hạn hoặc không khả dụng.')
              }
            }, 1500)
          }
          
          // Cleanup blob URL nếu có
          if (useProxy && audioSrc.startsWith('blob:')) {
            URL.revokeObjectURL(audioSrc)
          }
          
          setMusicPlaying(false)
        }
        
        // Set src và phát trực tiếp
        a.src = audioSrc
        audioRef.current = a
      } else {
        // Cleanup old blob URL nếu có
        if (audioRef.current.src.startsWith('blob:')) {
          URL.revokeObjectURL(audioRef.current.src)
        }
        audioRef.current.src = audioSrc
      }

      // Phát ngay lập tức (không delay)
      try {
        await audioRef.current.play()
        setMusicPlaying(true)
        console.log('[BlogImages] Music playing successfully', { useProxy, audioSrc })
      } catch (playError) {
        // Nếu play() fail, đợi một chút để audio load xong rồi thử lại
        console.warn('[BlogImages] Initial play() failed, waiting for audio to load...', playError)
        
        // Đợi audio load xong
        await new Promise((resolve) => {
          if (audioRef.current) {
            const onCanPlay = () => {
              audioRef.current?.removeEventListener('canplay', onCanPlay)
              resolve(undefined)
            }
            audioRef.current.addEventListener('canplay', onCanPlay, { once: true })
            
            // Timeout sau 2 giây
            setTimeout(() => {
              audioRef.current?.removeEventListener('canplay', onCanPlay)
              resolve(undefined)
            }, 2000)
          } else {
            resolve(undefined)
          }
        })
        
        // Thử play lại
        if (audioRef.current && !audioRef.current.error) {
          try {
            await audioRef.current.play()
            setMusicPlaying(true)
            console.log('[BlogImages] Music playing after retry')
          } catch (retryError) {
            console.error('[BlogImages] Retry play() also failed:', retryError)
            // Không hiển thị alert ở đây, để onerror handler xử lý
            setMusicPlaying(false)
          }
        } else {
          setMusicPlaying(false)
        }
      }
    } catch (error) {
      console.error('[BlogImages] Failed to setup audio:', error, {
        previewUrl,
        errorName: (error as Error)?.name,
        errorMessage: (error as Error)?.message
      })
      
      setMusicPlaying(false)
      // Không hiển thị alert ở đây, để onerror handler xử lý nếu cần
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
