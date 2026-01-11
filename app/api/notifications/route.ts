import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'


export async function createNotification(notification: {
  userId: string
  actorId: string
  type:
    | 'FOLLOW'
    | 'NEW_POST'
    | 'LIKE_POST'
    | 'COMMENT_POST'
    | 'SHARE_POST'
    | 'REPLY_COMMENT'
    | 'MESSAGE'
  blogId?: string
  commentId?: string
  messageId?: string
  conversationId?: string
}) {
  return prisma.notification.create({
    data: notification
  })
}

/* =====================================================
   📥 GET NOTIFICATIONS
   ===================================================== */
export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json([], { status: 401 })
  }

  const userId = session.user.id

  try {
    const notifications = await prisma.notification.findMany({
      where: {
        userId,
        // bỏ hẳn noti tin nhắn khỏi nút Thông báo
        NOT: { type: 'MESSAGE' }
      },
      include: {
        actor: {
          select: {
            id: true,
            username: true,
            fullname: true,
            image: true
          }
        },
        blog: { select: { id: true } },
        comment: { select: { id: true, blogId: true } },
        message: { select: { id: true, conversationId: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    return NextResponse.json(notifications)
  } catch (error) {
    console.error('Notification API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}
