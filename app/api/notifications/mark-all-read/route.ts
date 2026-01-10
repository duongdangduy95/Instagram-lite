import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redis } from '@/lib/redis'

// Mark all notifications as read for current user.
// NOTE: Notification type MESSAGE đã bị loại khỏi nút Thông báo, nên cũng không cần mark ở đây.
export async function POST() {
  const session = await getServerSession(authOptions)
  const userId = session?.user?.id
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const result = await prisma.notification.updateMany({
    where: {
      userId,
      isRead: false,
      NOT: { type: 'MESSAGE' },
    },
    data: { isRead: true },
  })

  await redis.del(`notifications:${userId}`)

  return NextResponse.json({ updatedCount: result.count })
}

