import { cookies } from 'next/headers'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST() {
  const cookieStore = cookies()
  const token = cookieStore.get('admin_session')?.value

  if (token) {
    await prisma.adminsession.deleteMany({ where: { token } })
  }

  // Xóa cookie ở root path
  cookieStore.set('admin_session', '', {
    path: '/',  // quan trọng phải là root
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

  return NextResponse.json({ ok: true })
}
