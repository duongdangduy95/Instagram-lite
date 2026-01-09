import { Suspense } from 'react'
import MessagesClient from './MessagesClient'

export const dynamic = 'force-dynamic'

export default function MessagesPage() {
  // Next.js 15: useSearchParams() cần nằm trong client component được bọc Suspense từ server component.
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0E11]" />}>
      <MessagesClient />
    </Suspense>
  )
}
