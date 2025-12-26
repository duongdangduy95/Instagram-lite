'use client'

import Image from 'next/image'
import { useState } from 'react'

interface BlogImagesProps {
  imageUrls: string[] // ảnh + video URLs
}

export default function BlogImages({ imageUrls }: BlogImagesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (!imageUrls || imageUrls.length === 0) return null

  const openLightbox = (index: number) => {
    setCurrentIndex(index)
    setIsOpen(true)
  }

  const nextIndex = () => (currentIndex + 1) % imageUrls.length
  const prevIndex = () =>
    (currentIndex - 1 + imageUrls.length) % imageUrls.length

  const displayUrls = imageUrls.slice(0, 4)

  const isVideo = (url: string) =>
    url.endsWith('.mp4') || url.endsWith('.mov') || url.endsWith('.webm')

  const renderMedia = (url: string, idx: number) => {
    const video = isVideo(url)

    return (
      <div
        key={idx}
        className="relative w-full h-full cursor-pointer bg-black"
        onClick={() => openLightbox(idx)}
      >
        {video ? (
          <>
            <video
              src={url}
              muted
              playsInline
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="backdrop-blur-sm bg-black/40 rounded-full p-4 shadow-lg">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="white"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>

          </>
        ) : (
          <Image
            src={url}
            alt={`image ${idx}`}
            fill
            className="object-cover"
          />
        )}
      </div>
    )
  }

  return (
    <div className="w-full aspect-square rounded-lg overflow-hidden">
      {/* Grid */}
      {displayUrls.length === 1 && (
        <div className="w-full h-full">{renderMedia(displayUrls[0], 0)}</div>
      )}

      {displayUrls.length === 2 && (
        <div className="grid grid-cols-2 gap-1 w-full h-full">
          {displayUrls.map(renderMedia)}
        </div>
      )}

      {displayUrls.length === 3 && (
        <div className="grid grid-rows-2 gap-1 w-full h-full">
          <div className="row-span-1">{renderMedia(displayUrls[0], 0)}</div>
          <div className="grid grid-cols-2 gap-1 row-span-1">
            {displayUrls.slice(1).map(renderMedia)}
          </div>
        </div>
      )}

      {displayUrls.length >= 4 && (
        <div className="grid grid-cols-2 grid-rows-2 gap-1 w-full h-full">
          {displayUrls.map((url, idx) => (
            <div key={idx} className="relative w-full h-full">
              {renderMedia(url, idx)}
              {idx === 3 && imageUrls.length > 4 && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold pointer-events-none">
                  +{imageUrls.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={() => setIsOpen(false)}
        >
          <button
            className="absolute left-4 text-white text-3xl cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(prevIndex())
            }}
          >
            ‹
          </button>

          <div className="relative w-4/5 max-w-3xl h-[80%]">
            {isVideo(imageUrls[currentIndex]) ? (
              <video
                src={imageUrls[currentIndex]}
                className="w-full h-full object-contain"
                controls
                autoPlay
              />
            ) : (
              <Image
                src={imageUrls[currentIndex]}
                alt={`lightbox image ${currentIndex}`}
                fill
                className="object-contain"
              />
            )}
          </div>


          <button
            className="absolute right-4 text-white text-3xl cursor-pointer select-none"
            onClick={(e) => {
              e.stopPropagation()
              setCurrentIndex(nextIndex())
            }}
          >
            ›
          </button>
        </div>
      )}
    </div>
  )
}
