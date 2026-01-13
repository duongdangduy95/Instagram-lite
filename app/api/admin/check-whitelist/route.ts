// app/api/admin/check-whitelist/route.ts
// API để check whitelist IP trước khi hiển thị trang login
import { NextRequest, NextResponse } from 'next/server'
import { isIPWhitelisted } from '@/lib/admin-whitelist'

export async function GET(req: NextRequest) {
  try {
    const allowed = isIPWhitelisted(req)
    
    if (!allowed) {
      return NextResponse.json(
        { allowed: false, message: 'Access denied' },
        { status: 403 }
      )
    }
    
    return NextResponse.json({ allowed: true })
  } catch (error) {
    // Fail-open: nếu có lỗi thì cho phép (an toàn hơn)
    console.error('[Admin Check Whitelist] Error:', error)
    return NextResponse.json({ allowed: true })
  }
}
