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

  return (
    <div className="text-gray-200 text-sm leading-relaxed break-words">
      <p style={style}>{text}</p>
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


