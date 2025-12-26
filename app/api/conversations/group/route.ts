// /app/api/conversations/group/route.ts
import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, userIds } = body

  if (!name || !userIds || userIds.length < 1) {
    return new Response(JSON.stringify({ error: 'Thiếu dữ liệu' }), { status: 400 })
  }

  // Kiểm tra xem đã tồn tại nhóm với đúng các participant chưa
  const existing = await prisma.conversation.findFirst({
    where: {
      isGroup: true,
      participants: {
        every: { userId: { in: userIds } } // tất cả userIds đều phải có trong conversation
      },
    },
    include: { participants: true }
  })

  if (existing) {
    return new Response(JSON.stringify({ conversation: existing, existing: true }))
  }

  // Tạo conversation mới
  const conversation = await prisma.conversation.create({
    data: {
      name,
      isGroup: true,
      participants: { create: userIds.map((id: string) => ({ userId: id })) }
    },
    include: { participants: true }
  })

  return new Response(JSON.stringify({ conversation, existing: false }))
}
