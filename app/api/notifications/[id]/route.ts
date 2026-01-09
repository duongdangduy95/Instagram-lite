import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

const CACHE_TTL = 3000 // seconds

// =======================
// 📥 GET NOTIFICATION BY ID
// =======================
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 })
  }

  const cacheKey = `notification:${params.id}`

  // 🔥 1. Redis first
  const cached = await redis.get(cacheKey)
  if (cached) {
    // đảm bảo user chỉ đọc noti của mình
    const cachedNotif = JSON.parse(typeof cached === 'string' ? cached : JSON.stringify(cached))
    if (cachedNotif.userId !== session.user.id) {
      return NextResponse.json(null, { status: 404 })
    }
    return NextResponse.json(cachedNotif)
  }

  // 🐢 2. DB fallback
  const notif = await prisma.notification.findUnique({
    where: { id: params.id },
    include: {
      actor: { select: { id: true, username: true, fullname: true, image: true } },
      blog: { select: { id: true } },
      comment: { select: { id: true, blogId: true } },
      message: { select: { id: true, conversationId: true } },
    },
  })

  if (!notif || notif.userId !== session.user.id) {
    return NextResponse.json(null, { status: 404 })
  }

  // ⚡ 3. Cache result
  await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(notif))

  return NextResponse.json(notif)
}

// =======================
// ✏️ MARK AS READ
// =======================
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 })
  }

  const notif = await prisma.notification.findUnique({
    where: { id: params.id },
  })

  if (!notif || notif.userId !== session.user.id) {
    return NextResponse.json(null, { status: 404 })
  }

  const updated = await prisma.notification.update({
    where: { id: params.id },
    data: { isRead: true },
  })

  // 🔥 Invalidate cache
  await Promise.all([
    redis.del(`notification:${params.id}`),
    redis.del(`notifications:${session.user.id}`),
  ])

  return NextResponse.json(updated)
}
