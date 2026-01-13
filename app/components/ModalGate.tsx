'use client'

import { useMemo } from 'react'
import { usePathname } from 'next/navigation'

export default function ModalGate({ modal }: { modal: React.ReactNode }) {
  const pathname = usePathname()

  const shouldRenderModal = useMemo(() => {
    // Dự án hiện chỉ có modal cho blog (intercept route /blog/*).
    // Khi người dùng điều hướng sang route khác (vd: /profile/*, /user/*),
    // Next có thể giữ state slot @modal => cần gate theo pathname để tránh modal "đè" lên màn khác.
    // Admin không cần modal
    if (pathname.startsWith('/admin/')) return false
    // Không render modal khi ở trang edit
    if (pathname.includes('/edit')) return false
    return /^\/blog(?:\/|$)/.test(pathname)
  }, [pathname])

  if (!shouldRenderModal) return null
  return <>{modal}</>
}


