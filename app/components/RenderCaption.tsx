'use client'

import Link from 'next/link'

type Props = {
  text: string
}

export default function RenderCaption({ text }: Props) {
  const parts = text.split(/(#\w+)/g)

  return (
    <>
      {parts.map((part, idx) => {
        if (part.startsWith('#')) {
          const tag = part.slice(1)
          return (
            <Link
              key={idx}
              href={`/hashtags/${encodeURIComponent(tag.toLowerCase())}`}
              className="text-sky-500 hover:underline"
            >
              {part}
            </Link>
          )
        }
        return <span key={idx}>{part}</span>
      })}
    </>
  )
}
