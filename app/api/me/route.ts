// app/api/me/route.ts
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { prisma } from '@/lib/prisma'  // hoặc tạo PrismaClient trực tiếp

export async function GET() {
  const cookieStore = cookies()
  const session = (await cookieStore).get('session')?.value

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized: no session' }, { status: 401 })
  }

  const [userId] = session.split(':')

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      blogs: { orderBy: { createdAt: 'desc' } },
      likes: {
        include: {
          blog: {
            include: {
              author: true,
            },
          },
        },
      },
    },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  return NextResponse.json(user)
}
