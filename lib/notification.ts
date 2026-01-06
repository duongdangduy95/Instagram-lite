import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'

// Supabase admin key để push event
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

type CreateNotificationInput = {
  userId: string
  actorId: string
  type: 'FOLLOW' | 'NEW_POST' | 'LIKE_POST' | 'COMMENT_POST' | 'SHARE_POST' | 'MESSAGE'
  blogId?: string
  commentId?: string
  messageId?: string
  conversationId?: string
}

export async function createNotification(data: CreateNotificationInput) {
  if (data.userId === data.actorId) return

  // 1️⃣ Lưu vào DB
  const saved = await prisma.notification.create({ data })

  // 2️⃣ Push vào Supabase Realtime
  await supabase
    .from('notification') // bảng Notification
    .insert([saved])

  return saved
}
