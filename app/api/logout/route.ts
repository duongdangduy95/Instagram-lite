// app/api/logout/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  const cookieStore = cookies()
  
  // Xóa cookie session
  ;(await
    // Xóa cookie session
    cookieStore).set({
    name: 'session',
    value: '',
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // xóa ngay
  })

  return NextResponse.json({ message: 'Logged out' })
}
