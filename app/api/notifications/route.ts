import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

const CACHE_TTL = 3000 // seconds

// =======================
// 🔔 CREATE NOTIFICATION
// =======================
export async function createNotification(notification: {
  userId: string
  actorId: string
  type: 'FOLLOW' | 'NEW_POST' | 'LIKE_POST' | 'COMMENT_POST' | 'SHARE_POST' | 'MESSAGE'
  blogId?: string
  commentId?: string
  messageId?: string
  conversationId?: string
}) {
  // 1️⃣ Lưu DB
  const saved = await prisma.notification.create({
    data: notification
  })

  // 2️⃣ Invalidate cache của user nhận notification
  await redis.del(`notifications:${notification.userId}`)

  return saved
}

// =======================
// 📥 GET NOTIFICATIONS
// =======================
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 })
  }

  const userId = session.user.id
  const cacheKey = `notifications:${userId}`

  try {
    // 🔥 1. Redis first
    const cached = await redis.get(cacheKey)
    if (cached) {
      return NextResponse.json(cached)
    }

    // 🐢 2. DB fallback
    const notifications = await prisma.notification.findMany({
      where: { userId },
      include: {
        actor: {
          select: { id: true, username: true, fullname: true, image: true }
        },
        blog: { select: { id: true } },
        comment: { select: { id: true, blogId: true } },
        message: { select: { id: true, conversationId: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    // ⚡ 3. Cache result
    await redis.setex(cacheKey, CACHE_TTL, JSON.stringify(notifications))

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notification API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
