import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

// 🔥 Helper tạo notification và gửi realtime
export async function createNotification(notification: {
  userId: string
  actorId: string
  type: 'FOLLOW' | 'NEW_POST' | 'LIKE_POST' | 'COMMENT_POST' | 'SHARE_POST' | 'MESSAGE'
  blogId?: string
  commentId?: string
  messageId?: string
}) {
  // 1️⃣ Lưu vào DB
  const saved = await prisma.notification.create({
    data: notification
  })

  return saved
}

// GET: Lấy danh sách notifications
export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json([], { status: 401 })

  const userId = session.user.id

  const notifications = await prisma.notification.findMany({
    where: { userId },
    include: {
      actor: { select: { id: true, username: true, fullname: true, image: true } },
      blog: { select: { id: true } },
      comment: { select: { id: true, blogId: true } },
      message: { select: { id: true, conversationId: true } }
    },
    orderBy: { createdAt: 'desc' },
    take: 50
  })

  return NextResponse.json(notifications)
}
