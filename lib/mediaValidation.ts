export type MediaKind = 'image' | 'video'

export const MAX_MEDIA_FILES = 10
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024 // 10MB
export const MAX_VIDEO_BYTES = 50 * 1024 * 1024 // 50MB

function formatBytes(bytes: number) {
  const mb = bytes / (1024 * 1024)
  return `${mb.toFixed(mb >= 10 ? 0 : 1)}MB`
}

export function validateAndFilterMediaFiles(opts: {
  selectedFiles: File[]
  remainingSlots: number
}) {
  const { selectedFiles, remainingSlots } = opts

  const accepted: File[] = []
  const rejectedReasons: string[] = []

  if (remainingSlots <= 0) {
    return {
      accepted,
      rejectedReasons: ['Bạn đã đạt giới hạn số lượng file.'],
      truncatedByLimit: false,
    }
  }

  let truncatedByLimit = false

  for (const f of selectedFiles) {
    if (accepted.length >= remainingSlots) {
      truncatedByLimit = true
      break
    }

    const isImage = f.type.startsWith('image/')
    const isVideo = f.type.startsWith('video/')

    if (!isImage && !isVideo) {
      rejectedReasons.push(`"${f.name}" không phải ảnh/video hợp lệ.`)
      continue
    }

    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (f.size > limit) {
      rejectedReasons.push(
        `"${f.name}" vượt quá dung lượng cho phép (${isVideo ? 'video' : 'ảnh'} ≤ ${formatBytes(limit)}).`
      )
      continue
    }

    accepted.push(f)
  }

  return { accepted, rejectedReasons, truncatedByLimit }
}


