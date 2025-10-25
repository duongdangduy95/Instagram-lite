// /api/logout/route.ts
import { NextResponse } from 'next/server'
import { serialize } from 'cookie'

export async function POST() {
  const res = NextResponse.json({ success: true })

  res.headers.set(
    'Set-Cookie',
    serialize('token', '', {
      httpOnly: true,
      path: '/',
      expires: new Date(0), // Xóa cookie
    })
  )

  return res
}
