import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/* =======================
   📥 GET NOTIFICATION BY ID
   ======================= */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 })
  }

  const userId = session.user.id
  const { id: notificationId } = await params

  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
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
    }
  })

  // 🔒 đảm bảo user chỉ đọc noti của mình
  if (!notif || notif.userId !== userId) {
    return NextResponse.json(null, { status: 404 })
  }

  return NextResponse.json(notif)
}

/* =======================
   ✏️ MARK NOTIFICATION AS READ
   ======================= */
export async function PATCH(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return NextResponse.json(null, { status: 401 })
  }

  const userId = session.user.id
  const { id: notificationId } = await params

  const notif = await prisma.notification.findUnique({
    where: { id: notificationId },
    select: { id: true, userId: true, isRead: true }
  })

  if (!notif || notif.userId !== userId) {
    return NextResponse.json(null, { status: 404 })
  }

  // Nếu đã read rồi thì trả luôn, tránh update thừa
  if (notif.isRead) {
    return NextResponse.json(notif)
  }

  const updated = await prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true }
  })

  return NextResponse.json(updated)
}
