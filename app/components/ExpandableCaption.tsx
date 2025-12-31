'use client'

import { useState } from 'react'

type Props = {
  text: string
  initialLines?: number
  showMoreLabel?: string
  showLessLabel?: string
  maxCharsToClamp?: number
}

export default function ExpandableCaption({
  text,
  initialLines = 1,
  showMoreLabel = 'Xem thêm',
  showLessLabel = 'Thu gọn',
  maxCharsToClamp = 140,
}: Props) {
  const [expanded, setExpanded] = useState(false)

  const shouldClamp = text.length > maxCharsToClamp
  const toggle = () => setExpanded((v) => !v)

  const style =
    expanded || !shouldClamp
      ? {}
      : {
        display: '-webkit-box',
        WebkitLineClamp: initialLines,
        WebkitBoxOrient: 'vertical' as const,
        overflow: 'hidden',
      }

  function parseCaption(text: string) {
    const regex = /#([\p{L}\p{N}_]+)/gu
    const parts: React.ReactNode[] = []

    let lastIndex = 0
    let match

    while ((match = regex.exec(text)) !== null) {
      const start = match.index
      const end = regex.lastIndex
      const tag = match[1]

      if (start > lastIndex) {
        parts.push(text.slice(lastIndex, start))
      }

      parts.push(
        <a
          key={`${tag}-${start}`}
          href={`/hashtags/${tag.toLowerCase()}`}
          className="text-[#7565E6] hover:text-[#877EFF] cursor-pointer font-medium"
        >
          #{tag}
        </a>
      )

      lastIndex = end
    }

    if (lastIndex < text.length) {
      parts.push(text.slice(lastIndex))
    }

    return parts
  }

  return (
    <div className="text-gray-200 text-sm leading-relaxed break-words">
      <p style={style}>{parseCaption(text)}</p>
      {shouldClamp && (
        <button
          type="button"
          onClick={toggle}
          className="mt-1 text-sm font-semibold text-purple-primary hover:text-purple-primary-dark"
        >
          {expanded ? showLessLabel : showMoreLabel}
        </button>
      )}
    </div>
  )
}


