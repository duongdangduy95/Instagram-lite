import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // dùng service key để push realtime
)

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

  // Push vào Supabase Realtime
  // await supabase
  //   .from('Notification')
  //   .insert([saved])

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
